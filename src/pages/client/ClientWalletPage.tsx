import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Shield,
  CheckCircle,
  Loader2,
  ExternalLink,
  Trash2,
  AlertCircle
} from "lucide-react";
import { formatDate } from "@/utils/dateFormat";
import ClientAPI, { WalletBalance, WalletTransaction } from "@/services/ClientAPI";
import ClientStripeAPI, { StripeAccountStatus } from "@/services/ClientStripeAPI";
import { toast } from "sonner";

const ClientWalletPage = () => {
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  // Stripe account state
  const [stripeAccount, setStripeAccount] = useState<StripeAccountStatus | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [error, setError] = useState("");



  // Load wallet data on component mount
  useEffect(() => {
    loadWalletData();
  }, []);

  // Check for Stripe connection status from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'true') {
      toast.success('Stripe account connected successfully!');
      loadStripeAccountStatus();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('refresh') === 'true') {
      loadStripeAccountStatus();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const [balanceData, transactionData] = await Promise.all([
        ClientAPI.getWalletBalance(),
        ClientAPI.getWalletTransactions()
      ]);

      setWalletBalance(balanceData);
      setTransactions(transactionData || []);

      // Load Stripe account status separately (non-critical)
      try {
        const stripeStatus = await ClientStripeAPI.getAccountStatus();
        setStripeAccount(stripeStatus);
      } catch (err) {
        console.error('Failed to load Stripe account status:', err);
        // Don't show error for Stripe status as it's not critical
      }


    } catch (error) {
      console.error('Error loading wallet data:', error);
      toast.error('Failed to load wallet data');
      setWalletBalance(null);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals with proper number handling
  const totalIncome = (transactions || [])
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + (parseFloat(t.amount?.toString()) || 0), 0);

  const totalWithdrawals = Math.abs((transactions || [])
    .filter(t => t.amount < 0 && t.type === "withdrawal")
    .reduce((sum, t) => sum + (parseFloat(t.amount?.toString()) || 0), 0));

  // Calculate this month's earnings from transactions
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthEarnings = (transactions || [])
    .filter(t => {
      const transactionDate = new Date(t.created_at);
      return transactionDate.getMonth() === currentMonth &&
             transactionDate.getFullYear() === currentYear &&
             t.amount > 0;
    })
    .reduce((sum, t) => sum + (parseFloat(t.amount?.toString()) || 0), 0);

  // Calculate net earnings safely
  const netEarnings = totalIncome - totalWithdrawals;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "commission": return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case "withdrawal": return <ArrowDownLeft className="h-4 w-4 text-blue-600" />;
      case "refund": return <ArrowUpRight className="h-4 w-4 text-orange-600" />;
      case "fee": return <ArrowDownLeft className="h-4 w-4 text-red-600" />;
      default: return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending": return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      case "failed": return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  // Handle Stripe account connection
  const handleConnectStripe = async () => {
    try {
      setStripeLoading(true);
      setError('');

      await ClientStripeAPI.redirectToStripeConnect();
    } catch (err: any) {
      setError(err.message || 'Failed to connect Stripe account');
      setStripeLoading(false);
    }
  };

  // Handle Stripe account disconnection
  const handleStripeDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your Stripe account? This will disable your ability to receive payments.')) {
      return;
    }

    try {
      setStripeLoading(true);
      setError('');

      await ClientStripeAPI.disconnectAccount();
      await loadStripeAccountStatus();
      toast.success('Stripe account disconnected successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect Stripe account');
    } finally {
      setStripeLoading(false);
    }
  };

  // Load Stripe account status
  const loadStripeAccountStatus = async () => {
    try {
      const accountStatus = await ClientStripeAPI.getAccountStatus();
      setStripeAccount(accountStatus);
    } catch (err: any) {
      console.error('Failed to load Stripe account status:', err);
      // Don't show error for Stripe account status as it's not critical
    }
  };



  return (
    <div className="p-2 xs:p-4 sm:p-6 space-y-4 xs:space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 xs:p-4 sm:p-6 border border-green-100">
        <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Wallet & Payments</h1>
        <p className="text-sm xs:text-base sm:text-lg text-gray-700">
          Manage your marketplace earnings and purchase history.
        </p>
      </div>

      {/* Stripe Connection */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Stripe Account Connection
          </CardTitle>
          <p className="text-sm text-gray-600">
            Connect your Stripe account to receive marketplace revenue and manage withdrawals securely.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {stripeAccount ? (
            <div className="space-y-4">
              {/* Account Status */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 xs:p-4 border border-gray-200 rounded-lg space-y-3 xs:space-y-4 sm:space-y-0">
                <div className="flex items-start xs:items-center space-x-3 xs:space-x-4">
                  <div className={`w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    stripeAccount.connected && stripeAccount.details_submitted
                      ? 'bg-green-100 text-green-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {stripeAccount.connected && stripeAccount.details_submitted ? (
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <AlertCircle className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-xs xs:text-sm sm:text-base break-words">
                      {stripeAccount.connected ? 'Stripe Connected' : 'Stripe Not Connected'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 break-words">
                      {stripeAccount.connected && stripeAccount.details_submitted
                        ? 'Ready to receive payments'
                        : stripeAccount.connected
                          ? 'Complete setup to receive payments'
                          : 'Connect to receive payments'
                      }
                    </div>
                    {stripeAccount.company && (
                      <div className="text-xs text-gray-500 mt-1 break-words">
                        {stripeAccount.company.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  {stripeAccount.connected ? (
                    <>
                      {!stripeAccount.details_submitted && (
                        <Button
                          onClick={handleConnectStripe}
                          disabled={stripeLoading}
                          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm"
                        >
                          {stripeLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <ExternalLink className="w-4 h-4 mr-2" />
                          )}
                          Complete Setup
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={handleStripeDisconnect}
                        disabled={stripeLoading}
                        className="text-red-600 hover:text-red-700 w-full sm:w-auto text-sm"
                      >
                        {stripeLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleConnectStripe}
                      disabled={stripeLoading}
                      className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-sm"
                    >
                      {stripeLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ExternalLink className="w-4 h-4 mr-2" />
                      )}
                      Connect Stripe Account
                    </Button>
                  )}
                </div>
              </div>

              {/* Account Capabilities */}
              {stripeAccount.connected && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        stripeAccount.charges_enabled ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className="font-medium text-gray-900 text-sm sm:text-base">Accept Payments</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {stripeAccount.charges_enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        stripeAccount.payouts_enabled ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className="font-medium text-gray-900 text-sm sm:text-base">Receive Payouts</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {stripeAccount.payouts_enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {stripeAccount.connected && stripeAccount.requirements && stripeAccount.requirements.currently_due.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Action Required on stripe</span>
                  </div>
                  <p className="text-sm text-yellow-700 mb-2">
                    Complete the following requirements on stripe to fully activate your account:
                  </p>
                  <ul className="text-sm text-yellow-700 list-disc list-inside">
                    {stripeAccount.requirements.currently_due.slice(0, 5).map((requirement, index) => (
                      <li key={index}>{requirement.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
                    ))}
                    {stripeAccount.requirements.currently_due.length > 5 && (
                      <li>... and {stripeAccount.requirements.currently_due.length - 5} more</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Secure & Trusted</h4>
                </div>
                <p className="text-sm text-green-700">
                  Stripe provides bank-level security for all your payment transactions and payouts.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Loading Stripe account status...</p>
            </div>
          )}
        </CardContent>
      </Card>



      {/* Balance Overview */}
      <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
          <CardContent className="p-3 xs:p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Available Balance</p>
                <div className="flex items-center gap-1 xs:gap-2 mt-1">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 animate-spin text-gray-400" />
                      <p className="text-lg xs:text-xl sm:text-3xl font-bold text-gray-400">Loading...</p>
                    </div>
                  ) : isBalanceVisible ? (
                    <p className="text-lg xs:text-xl sm:text-3xl font-bold text-green-600 truncate">
                      ${(parseFloat(walletBalance?.balance?.toString()) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  ) : (
                    <p className="text-lg xs:text-xl sm:text-3xl font-bold text-gray-400">••••••</p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                    className="flex-shrink-0 p-1 xs:p-2"
                  >
                    {isBalanceVisible ? <EyeOff className="h-3 w-3 xs:h-4 xs:w-4" /> : <Eye className="h-3 w-3 xs:h-4 xs:w-4" />}
                  </Button>
                </div>
              </div>
              <div className="p-2 xs:p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0 ml-1 xs:ml-2">
                <Wallet className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-orange-500">
          <CardContent className="p-3 xs:p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Pending Balance</p>
                {loading ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Loader2 className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 animate-spin text-gray-400" />
                    <p className="text-lg xs:text-xl sm:text-3xl font-bold text-gray-400">Loading...</p>
                  </div>
                ) : (
                  <p className="text-lg xs:text-xl sm:text-3xl font-bold text-orange-600 mt-1 truncate">
                    ${(parseFloat(walletBalance?.pending_balance?.toString()) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Processing in 2-3 days</p>
              </div>
              <div className="p-2 xs:p-2 sm:p-3 bg-orange-100 rounded-lg flex-shrink-0 ml-1 xs:ml-2">
                <Clock className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
          <CardContent className="p-3 xs:p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">This Month</p>
                {loading ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Loader2 className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 animate-spin text-gray-400" />
                    <p className="text-lg xs:text-xl sm:text-3xl font-bold text-gray-400">Loading...</p>
                  </div>
                ) : (
                  <p className="text-lg xs:text-xl sm:text-3xl font-bold text-blue-600 mt-1 truncate">
                    ${thisMonthEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                )}
                <p className="text-xs text-green-600 font-medium mt-1 break-words">+12.5% from last month</p>
              </div>
              <div className="p-2 xs:p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0 ml-1 xs:ml-2">
                <TrendingUp className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Purchase History
          </CardTitle>
          <CardDescription>View your earnings, withdrawals, and payment history.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between space-y-2 xs:space-y-0 gap-2">
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold">Recent Transactions</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full xs:w-auto text-xs xs:text-sm"
                  onClick={() => {
                    try {
                      if (!transactions || transactions.length === 0) {
                        toast.info('No transactions to export');
                        return;
                      }

                      const headers = ['Type', 'Description', 'Amount', 'Date', 'Status'];
                      const csvContent = [
                        headers.join(','),
                        ...transactions.map(t => [
                          `"${t.type}"`,
                          `"${(t.description || '').replace(/"/g, '""')}"`,
                          `${(parseFloat(t.amount?.toString()) || 0).toFixed(2)}`,
                          `"${formatDate(t.created_at)}"`,
                          `"${t.status}"`
                        ].join(','))
                      ].join('\n');

                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const link = document.createElement('a');
                      const url = URL.createObjectURL(blob);
                      link.setAttribute('href', url);
                      link.setAttribute('download', `wallet-transactions-${new Date().toISOString().split('T')[0]}.csv`);
                      link.style.visibility = 'hidden';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);

                      toast.success('Transactions exported successfully');
                    } catch (error) {
                      console.error('Error exporting transactions:', error);
                      toast.error('Failed to export transactions');
                    }
                  }}
                >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 mb-4 xs:mb-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-3 xs:p-3 sm:p-4 text-center">
                  <TrendingUp className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600">Total Income</p>
                  <p className="text-base xs:text-lg sm:text-xl font-bold text-primary">
                    ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3 xs:p-3 sm:p-4 text-center">
                  <TrendingDown className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600">Total Withdrawals</p>
                  <p className="text-base xs:text-lg sm:text-xl font-bold text-blue-600">
                    ${totalWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200 xs:col-span-1 sm:col-span-2 lg:col-span-1">
                <CardContent className="p-3 xs:p-3 sm:p-4 text-center">
                  <DollarSign className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600">Net Earnings</p>
                  <p className="text-base xs:text-lg sm:text-xl font-bold text-purple-600">
                    ${isNaN(netEarnings) ? '0.00' : netEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">Type</TableHead>
                    <TableHead className="hidden xs:table-cell min-w-[120px]">Description</TableHead>
                    <TableHead className="min-w-[80px]">Amount</TableHead>
                    <TableHead className="hidden sm:table-cell min-w-[100px]">Date</TableHead>
                    <TableHead className="hidden sm:table-cell min-w-[80px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        <p>Loading transactions...</p>
                      </TableCell>
                    </TableRow>
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-gray-50">
                      <TableCell className="py-3">
                        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                          <div className="flex items-center gap-2">
                            {getTransactionIcon(transaction.type)}
                            <span className="capitalize text-xs xs:text-sm">{transaction.type}</span>
                          </div>
                          {/* Show description on mobile when hidden column */}
                          <div className="xs:hidden text-xs text-gray-500 truncate max-w-[120px]">
                            {transaction.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xs:table-cell max-w-[120px] xs:max-w-xs truncate text-xs xs:text-sm">
                        {transaction.description}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex flex-col">
                          <span className={`font-semibold text-xs xs:text-sm ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}${Math.abs(parseFloat(transaction.amount?.toString()) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          {/* Show date and status on mobile when hidden columns */}
                          <div className="sm:hidden text-xs text-gray-500 mt-1">
                            <div>{formatDate(transaction.created_at)}</div>
                            <div className="mt-1">{getStatusBadge(transaction.status)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs xs:text-sm">
                        {formatDate(transaction.created_at)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientWalletPage;
