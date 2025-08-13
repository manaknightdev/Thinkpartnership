import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Plus,
  Minus,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
  Banknote,
  Building,
  Shield,
  Zap,
  Loader2,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import VendorWalletAPI, {
  WalletBalance,
  Transaction,
  PaymentMethod,
  EarningsStats,
  WithdrawalRequest
} from "@/services/VendorWalletAPI";
import VendorStripeAPI, { StripeAccountStatus } from "@/services/VendorStripeAPI";
import VendorOrdersAPI from "@/services/VendorOrdersAPI";
import { showSuccess, showError } from "@/utils/toast";

const VendorWalletPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showBalance, setShowBalance] = useState(true);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [error, setError] = useState("");

  // API Data State
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [earningsStats, setEarningsStats] = useState<EarningsStats | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Payment settings state
  const [paymentSettings, setPaymentSettings] = useState({
    auto_pay_recurring: true,
    payment_notifications: true,
    save_payment_methods: true,
    auto_withdrawal: false,
    withdrawal_threshold: 1000,
  });

  // Stripe account state
  const [stripeAccount, setStripeAccount] = useState<StripeAccountStatus | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);



  // Load data on component mount
  useEffect(() => {
    loadWalletData();
  }, []);

  // Check for Stripe connection status from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'true') {
      showSuccess('Stripe account connected successfully!');
      loadStripeAccountStatus();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('refresh') === 'true') {
      loadStripeAccountStatus();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Load Stripe account status
  const loadStripeAccountStatus = async () => {
    try {
      setStripeLoading(true);
      const accountStatus = await VendorStripeAPI.getAccountStatus();
      setStripeAccount(accountStatus);
    } catch (err: any) {
      console.error('Failed to load Stripe account status:', err);
      // Set a default state to prevent infinite loading
      setStripeAccount({
        connected: false,
        account_id: null,
        details_submitted: false,
        charges_enabled: false,
        payouts_enabled: false
      });
    } finally {
      setStripeLoading(false);
    }
  };



  const loadWalletData = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Load wallet balance using the proper wallet API
      const walletBalanceResponse = await VendorWalletAPI.getWalletBalance();

      if (!walletBalanceResponse.error && walletBalanceResponse.data) {
        setWalletBalance(walletBalanceResponse.data);
      } else {
        console.warn('Wallet balance API returned error:', walletBalanceResponse.message);
        // Set default empty state
        setWalletBalance({
          available_balance: 0,
          pending_balance: 0,
          total_earnings: 0,
          total_withdrawals: 0,
          currency: 'USD'
        });
      }

      // Load wallet transactions
      const transactionsResponse = await VendorWalletAPI.getTransactions();

      if (!transactionsResponse.error && transactionsResponse.data) {
        setTransactions(transactionsResponse.data.transactions);
        // The pagination is at the root level of the response, not inside data
        if ('pagination' in transactionsResponse && transactionsResponse.pagination) {
          setPagination(transactionsResponse.pagination);
        } else {
          // Fallback pagination if not provided
          setPagination({
            page: 1,
            limit: 10,
            total: transactionsResponse.data.transactions.length,
            pages: Math.ceil(transactionsResponse.data.transactions.length / 10)
          });
        }
      } else {
        console.warn('Wallet transactions API returned error:', transactionsResponse.message);
        setTransactions([]);
        setPagination({
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        });
      }

      // Load other data in parallel - handle errors gracefully
      try {
        const [paymentMethodsRes, statsRes] = await Promise.all([
          VendorWalletAPI.getPaymentMethods().catch(err => ({ error: true, message: err.message })),
          VendorWalletAPI.getEarningsStats().catch(err => ({ error: true, message: err.message })),
        ]);

        // Handle payment methods response
        if (paymentMethodsRes.error) {
          console.warn('Failed to load payment methods:', paymentMethodsRes.message);
          setPaymentMethods([]);
        } else {
          const paymentData = 'data' in paymentMethodsRes ? paymentMethodsRes.data : null;
          setPaymentMethods(paymentData?.payment_methods || []);
        }

        // Handle earnings stats response
        if (statsRes.error) {
          console.warn('Failed to load earnings stats:', statsRes.message);
          setEarningsStats(null);
        } else {
          const statsData = 'data' in statsRes ? statsRes.data : null;
          setEarningsStats(statsData);
        }
      } catch (err) {
        console.warn('Error loading additional wallet data:', err);
        setPaymentMethods([]);
        setEarningsStats(null);
      }

      // Load Stripe account status separately (non-critical)
      loadStripeAccountStatus();


    } catch (err: any) {
      console.error('Error in loadWalletData:', err);
      setError(err.response?.data?.message || "Failed to load wallet data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || !selectedPaymentMethod) {
      showError("Please enter withdrawal amount and select payment method");
      return;
    }

    const amount = parseFloat(withdrawalAmount);
    if (amount <= 0) {
      showError("Please enter a valid withdrawal amount");
      return;
    }

    if (walletBalance && amount > walletBalance.available_balance) {
      showError("Insufficient balance for withdrawal");
      return;
    }

    try {
      setIsWithdrawing(true);
      setError("");

      const withdrawalData: WithdrawalRequest = {
        amount,
        payment_method_id: parseInt(selectedPaymentMethod),
        description: `Withdrawal to payment method`,
      };

      const response = await VendorWalletAPI.requestWithdrawal(withdrawalData);

      if (response.error) {
        setError(response.message);
        showError(response.message);
        return;
      }

      showSuccess("Withdrawal request submitted successfully!");
      setWithdrawalAmount("");
      setSelectedPaymentMethod("");
      await loadWalletData(); // Refresh data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to process withdrawal";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleRemovePaymentMethod = async (paymentMethodId: number) => {
    try {
      const response = await VendorWalletAPI.removePaymentMethod(paymentMethodId);

      if (response.error) {
        showError(response.message);
        return;
      }

      showSuccess("Payment method removed successfully!");
      await loadWalletData(); // Refresh data
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to remove payment method");
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: number) => {
    try {
      const response = await VendorWalletAPI.setDefaultPaymentMethod(paymentMethodId);

      if (response.error) {
        showError(response.message);
        return;
      }

      showSuccess("Default payment method updated!");
      await loadWalletData(); // Refresh data
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to update default payment method");
    }
  };

  const handleExportTransactions = async () => {
    try {
      const response = await VendorWalletAPI.exportTransactions({ format: 'csv' });

      if (response.error) {
        showError(response.message);
        return;
      }

      if (response.data?.download_url) {
        window.open(response.data.download_url, '_blank');
        showSuccess("Transaction export started!");
      }
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to export transactions");
    }
  };
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earning": return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case "withdrawal": return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
      case "fee": return <Minus className="h-4 w-4 text-red-600" />;
      case "refund": return <ArrowDownLeft className="h-4 w-4 text-orange-600" />;
      case "bonus": return <Plus className="h-4 w-4 text-purple-600" />;
      default: return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "earning": return "text-green-600";
      case "withdrawal": return "text-blue-600";
      case "fee": return "text-red-600";
      case "refund": return "text-orange-600";
      case "bonus": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle Stripe account connection
  const handleConnectStripe = async () => {
    try {
      setStripeLoading(true);
      setError('');

      VendorStripeAPI.redirectToStripeConnect();
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

      await VendorStripeAPI.disconnectAccount();
      await loadStripeAccountStatus();
      showSuccess('Stripe account disconnected successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect Stripe account');
    } finally {
      setStripeLoading(false);
    }
  };

  const handleAddPaymentMethod = () => {
    // TODO: Implement add payment method functionality
    showSuccess("Add payment method functionality coming soon!");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-600 mt-1">
            Manage your earnings, withdrawals, and payment methods.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExportTransactions}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Withdraw Funds
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Withdraw Funds</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="withdrawal-amount">Amount</Label>
                  <Input
                    id="withdrawal-amount"
                    type="number"
                    placeholder="0.00"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Available: ${walletBalance?.available_balance?.toFixed(2) || '0.00'} • Min: $10
                  </p>
                </div>

                <div>
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id.toString()}>
                          {method.type === 'bank_account'
                            ? `${method.bank_name} ****${method.last4}`
                            : `${method.card_brand} ****${method.last4}`
                          }
                          {method.is_default && " (Default)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Funds typically arrive in 1-2 business days
                  </p>
                </div>

                <Button
                  onClick={handleWithdrawal}
                  disabled={isWithdrawing}
                  className="w-full"
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Withdraw $${withdrawalAmount || "0.00"}`
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Available Balance</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="h-6 w-6 p-0"
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {showBalance ? `$${walletBalance?.available_balance?.toFixed(2) || '0.00'}` : "••••••"}
            </div>
            <p className="text-xs text-gray-500 mt-1">Ready for withdrawal</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Pending</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {showBalance ? `$${walletBalance?.pending_balance?.toFixed(2) || '0.00'}` : "••••••"}
            </div>
            <p className="text-xs text-gray-500 mt-1">Processing payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">This Month</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {showBalance ? `$${earningsStats?.this_month?.toFixed(2) || '0.00'}` : "••••••"}
            </div>
            <p className="text-xs text-green-600 mt-1">
              {earningsStats?.growth_percentage ?
                `${earningsStats.growth_percentage > 0 ? '+' : ''}${earningsStats.growth_percentage.toFixed(1)}% from last month` :
                'No data available'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Total Earnings</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {showBalance ? `$${walletBalance?.total_earnings?.toFixed(2) || '0.00'}` : "••••••"}
            </div>
            <p className="text-xs text-gray-500 mt-1">All time earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stripe Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Stripe Account Connection
              </CardTitle>
              <p className="text-sm text-gray-600">
                Connect your Stripe account to receive payments and manage withdrawals securely.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {stripeLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Loading Stripe account status...</p>
                </div>
              ) : stripeAccount ? (
                <div className="space-y-4">
                  {/* Account Status */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        stripeAccount.connected && stripeAccount.details_submitted
                          ? 'bg-green-100 text-green-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {stripeAccount.connected && stripeAccount.details_submitted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <AlertCircle className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {stripeAccount.connected ? 'Stripe Account Connected' : 'Stripe Account Not Connected'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stripeAccount.connected && stripeAccount.details_submitted
                            ? 'Your account is fully set up and ready to receive payments'
                            : stripeAccount.connected
                              ? 'Complete your account setup to start receiving payments'
                              : 'Connect your Stripe account to receive payments'
                          }
                        </div>
                        {stripeAccount.company && (
                          <div className="text-xs text-gray-500 mt-1">
                            {stripeAccount.company.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {stripeAccount.connected ? (
                        <>
                          {!stripeAccount.details_submitted && (
                            <Button
                              onClick={handleConnectStripe}
                              disabled={stripeLoading}
                              className="bg-blue-600 hover:bg-blue-700"
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
                            className="text-red-600 hover:text-red-700"
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
                          className="bg-green-600 hover:bg-green-700"
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            stripeAccount.charges_enabled ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="font-medium text-gray-900">Accept Payments</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {stripeAccount.charges_enabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            stripeAccount.payouts_enabled ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="font-medium text-gray-900">Receive Payouts</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
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
                  <AlertCircle className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Unable to load Stripe account status</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadStripeAccountStatus}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>



          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
                        {transaction.customer_name && (
                          <p className="text-sm text-blue-600">Customer: {transaction.customer_name}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn("font-semibold", getTransactionColor(transaction.type))}>
                        {transaction.type === 'earning' || transaction.type === 'bonus' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
                    <p className="text-gray-600">Your transaction history will appear here once you start earning.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>
                View your complete transaction history including earnings, withdrawals, and fees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                          {transaction.stripe_transaction_id && (
                            <>
                              <span>•</span>
                              <span>ID: {transaction.stripe_transaction_id}</span>
                            </>
                          )}
                        </div>
                        {transaction.customer_name && (
                          <p className="text-sm text-blue-600">Customer: {transaction.customer_name}</p>
                        )}
                        {transaction.service_title && (
                          <p className="text-sm text-gray-600">Service: {transaction.service_title}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-lg font-semibold", getTransactionColor(transaction.type))}>
                        {transaction.type === 'earning' || transaction.type === 'bonus' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}

                {transactions.length === 0 && (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
                    <p className="text-gray-600">Your transaction history will appear here once you start earning.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorWalletPage;
