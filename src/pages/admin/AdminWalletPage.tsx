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
import AdminWalletAPI, { AdminWalletBalance, AdminWalletTransaction } from "@/services/AdminWalletAPI";
import AdminStripeAPI, { StripeAccountStatus } from "@/services/AdminStripeAPI";
import { toast } from "sonner";

const AdminWalletPage = () => {
  const [walletBalance, setWalletBalance] = useState<AdminWalletBalance | null>(null);
  const [transactions, setTransactions] = useState<AdminWalletTransaction[]>([]);
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
        AdminWalletAPI.getWalletBalance(),
        AdminWalletAPI.getWalletTransactions()
      ]);

      setWalletBalance(balanceData);
      setTransactions(transactionData.transactions || []);

      // Load Stripe account status separately (non-critical)
      try {
        const stripeStatus = await AdminStripeAPI.getAccountStatus();
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

  const loadStripeAccountStatus = async () => {
    try {
      const stripeStatus = await AdminStripeAPI.getAccountStatus();
      setStripeAccount(stripeStatus);
    } catch (error) {
      console.error('Failed to load Stripe account status:', error);
    }
  };

  // Calculate totals
  const totalIncome = (transactions || [])
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = Math.abs((transactions || [])
    .filter(t => t.amount < 0 && t.type === "withdrawal")
    .reduce((sum, t) => sum + t.amount, 0));

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "commission": return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case "platform_revenue": return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case "withdrawal": return <ArrowDownLeft className="h-4 w-4 text-red-600" />;
      case "fee": return <ArrowDownLeft className="h-4 w-4 text-orange-600" />;
      case "refund": return <ArrowDownLeft className="h-4 w-4 text-blue-600" />;
      default: return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleConnectStripe = async () => {
    try {
      setStripeLoading(true);
      setError("");
      await AdminStripeAPI.redirectToStripeConnect();
    } catch (error: any) {
      console.error('Error connecting Stripe:', error);
      setError(error.message || 'Failed to connect Stripe account');
      toast.error('Failed to connect Stripe account');
    } finally {
      setStripeLoading(false);
    }
  };

  const handleDisconnectStripe = async () => {
    try {
      setStripeLoading(true);
      setError("");
      await AdminStripeAPI.disconnectAccount();
      setStripeAccount(null);
      toast.success('Stripe account disconnected successfully');
    } catch (error: any) {
      console.error('Error disconnecting Stripe:', error);
      setError(error.message || 'Failed to disconnect Stripe account');
      toast.error('Failed to disconnect Stripe account');
    } finally {
      setStripeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Wallet & Payments</h1>
          <p className="text-gray-600 mt-2">
            Manage your platform earnings, withdrawals, and payment settings
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="h-8 w-8 p-0"
            >
              {isBalanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isBalanceVisible
                ? `$${parseFloat(walletBalance?.balance || '0').toFixed(2)}`
                : '••••••'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isBalanceVisible
                ? `$${parseFloat(walletBalance?.pending_balance || '0').toFixed(2)}`
                : '••••••'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Processing payments
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isBalanceVisible
                ? `$${parseFloat(walletBalance?.total_earned || '0').toFixed(2)}`
                : '••••••'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Platform revenue
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isBalanceVisible
                ? `$${parseFloat(walletBalance?.total_withdrawals || '0').toFixed(2)}`
                : '••••••'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Withdrawn to bank
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stripe Connection */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Stripe Account Connection
          </CardTitle>
          <p className="text-sm text-gray-600">
            Connect your Stripe account to receive platform revenue and manage withdrawals securely.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {stripeAccount?.connected ? (
            <div className="space-y-4">
              {/* Account Status */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    stripeAccount.connected && stripeAccount.details_submitted
                      ? 'bg-green-100'
                      : 'bg-yellow-100'
                  }`}>
                    {stripeAccount.connected && stripeAccount.details_submitted ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <Clock className="h-6 w-6 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {stripeAccount.connected && stripeAccount.details_submitted
                        ? 'Account Connected'
                        : 'Setup Required'
                      }
                    </h3>
                    <p className="text-sm text-gray-600">
                      {stripeAccount.connected && stripeAccount.details_submitted
                        ? 'Your Stripe account is fully connected and ready to receive payments'
                        : 'Complete your Stripe account setup to receive payments'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {stripeAccount.charges_enabled && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {stripeAccount.payouts_enabled && (
                    <Badge variant="default" className="bg-blue-100 text-blue-800">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Payouts
                    </Badge>
                  )}
                </div>
              </div>

              {/* Account Actions */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Account ID</p>
                  <p className="text-sm text-gray-600 font-mono">{stripeAccount.account_id}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnectStripe}
                    disabled={stripeLoading}
                    className="text-red-600 hover:text-red-700"
                  >
                    {stripeLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Disconnect
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://dashboard.stripe.com/connect/accounts/${stripeAccount.account_id}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Stripe Dashboard
                  </Button>
                </div>
              </div>

              {/* Requirements */}
              {stripeAccount.requirements && stripeAccount.requirements.currently_due.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Action Required</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Complete the following requirements to enable full account functionality:
                      </p>
                      <ul className="list-disc list-inside text-sm text-yellow-700 mt-2">
                        {stripeAccount.requirements.currently_due.map((requirement, index) => (
                          <li key={index}>{requirement.replace(/_/g, ' ')}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect Your Stripe Account</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Connect your Stripe account to start receiving platform revenue and manage withdrawals.
              </p>
              <Button
                onClick={handleConnectStripe}
                disabled={stripeLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {stripeLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ExternalLink className="h-4 w-4 mr-2" />
                )}
                Connect Stripe Account
              </Button>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Connection Error</h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Purchase History
          </CardTitle>
          <CardDescription>View your platform earnings, withdrawals, and payment history.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            {transactions.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice(0, 10).map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTransactionIcon(transaction.type)}
                            <span className="capitalize">{transaction.type.replace('_', ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            {transaction.client_name && (
                              <p className="text-sm text-gray-500">Client: {transaction.client_name}</p>
                            )}
                            {transaction.vendor_name && (
                              <p className="text-sm text-gray-500">Vendor: {transaction.vendor_name}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            parseFloat(transaction.amount) > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {parseFloat(transaction.amount) > 0 ? '+' : ''}${Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {formatDate(transaction.created_at)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
                <p className="text-gray-600">
                  Your transaction history will appear here once you start earning platform revenue.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWalletPage;
