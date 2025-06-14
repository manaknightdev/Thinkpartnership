import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: "earning" | "withdrawal" | "fee" | "refund";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
  customer?: string;
  service?: string;
  stripeTransactionId?: string;
}

interface PaymentMethod {
  id: string;
  type: "card";
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  name: string;
}

const VendorWalletPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showBalance, setShowBalance] = useState(true);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  // Payment settings state
  const [paymentSettings, setPaymentSettings] = useState({
    autoPayRecurring: true,
    paymentNotifications: true,
    savePaymentMethods: true,
    autoWithdrawal: false,
    withdrawalThreshold: 1000,
  });

  // Mock data
  const [walletBalance] = useState(2847.50);
  const [pendingBalance] = useState(425.00);
  const [totalEarnings] = useState(15420.75);
  const [thisMonthEarnings] = useState(3247.50);

  const [transactions] = useState<Transaction[]>([
    {
      id: "txn_001",
      type: "earning",
      amount: 150.00,
      description: "Emergency Plumbing Repair",
      date: "2024-01-15",
      status: "completed",
      customer: "John Doe",
      service: "Emergency Plumbing",
      stripeTransactionId: "pi_1234567890"
    },
    {
      id: "txn_002",
      type: "withdrawal",
      amount: -500.00,
      description: "Withdrawal to Visa ****4242",
      date: "2024-01-14",
      status: "completed",
      stripeTransactionId: "po_1234567890"
    },
    {
      id: "txn_003",
      type: "earning",
      amount: 320.00,
      description: "Interior Painting Service",
      date: "2024-01-13",
      status: "completed",
      customer: "Sarah Wilson",
      service: "Interior Painting",
      stripeTransactionId: "pi_0987654321"
    },
    {
      id: "txn_004",
      type: "fee",
      amount: -15.75,
      description: "Platform fee (3.5%)",
      date: "2024-01-13",
      status: "completed",
      stripeTransactionId: "fee_1234567890"
    },
    {
      id: "txn_005",
      type: "withdrawal",
      amount: -1000.00,
      description: "Withdrawal to Visa ****4242",
      date: "2024-01-12",
      status: "pending",
      stripeTransactionId: "po_pending123"
    },
    {
      id: "txn_006",
      type: "earning",
      amount: 275.00,
      description: "Home Inspection Service",
      date: "2024-01-11",
      status: "completed",
      customer: "Mike Johnson",
      service: "Home Inspection",
      stripeTransactionId: "pi_1122334455"
    }
  ]);

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_001",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      name: "John Smith"
    },
    {
      id: "pm_002",
      type: "card",
      last4: "8888",
      brand: "Mastercard",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
      name: "John Smith"
    },
    {
      id: "pm_003",
      type: "card",
      last4: "1234",
      brand: "American Express",
      expiryMonth: 3,
      expiryYear: 2027,
      isDefault: false,
      name: "Rapid Plumbers LLC"
    }
  ]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earning": return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case "withdrawal": return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
      case "fee": return <Minus className="h-4 w-4 text-red-600" />;
      case "refund": return <ArrowDownLeft className="h-4 w-4 text-orange-600" />;
      default: return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "earning": return "text-green-600";
      case "withdrawal": return "text-blue-600";
      case "fee": return "text-red-600";
      case "refund": return "text-orange-600";
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

  const handleWithdrawal = () => {
    if (!withdrawalAmount || !selectedPaymentMethod) {
      toast.error("Please enter amount and select payment method");
      return;
    }

    const amount = parseFloat(withdrawalAmount);
    if (amount > walletBalance) {
      toast.error("Insufficient balance");
      return;
    }

    if (amount < 10) {
      toast.error("Minimum withdrawal amount is $10");
      return;
    }

    // Simulate Stripe withdrawal
    toast.success(`Withdrawal of $${amount} initiated. Funds will arrive in 1-2 business days.`);
    setWithdrawalAmount("");
    setSelectedPaymentMethod("");
  };

  const handleConnectStripe = () => {
    // Simulate Stripe Connect onboarding
    toast.info("Redirecting to Stripe Connect onboarding...");
    // In real implementation: window.location.href = stripeConnectUrl;
  };

  const handleAddPaymentMethod = () => {
    // Simulate adding payment method
    toast.info("Redirecting to Stripe to add payment method...");
    // In real implementation: redirect to Stripe setup
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
          <Button variant="outline" size="sm">
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
                    Available: ${walletBalance.toFixed(2)} • Min: $10
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
                        <SelectItem key={method.id} value={method.id}>
                          {`${method.brand} ****${method.last4}`}
                          {method.isDefault && " (Default)"}
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
                
                <Button onClick={handleWithdrawal} className="w-full">
                  Withdraw ${withdrawalAmount || "0.00"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
              {showBalance ? `$${walletBalance.toFixed(2)}` : "••••••"}
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
              {showBalance ? `$${pendingBalance.toFixed(2)}` : "••••••"}
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
              {showBalance ? `$${thisMonthEarnings.toFixed(2)}` : "••••••"}
            </div>
            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Total Earnings</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {showBalance ? `$${totalEarnings.toFixed(2)}` : "••••••"}
            </div>
            <p className="text-xs text-gray-500 mt-1">All time earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleConnectStripe}>
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span>Connect Stripe</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleAddPaymentMethod}>
                  <Plus className="h-6 w-6 text-green-600" />
                  <span>Add Payment Method</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Download className="h-6 w-6 text-purple-600" />
                  <span>Download Statement</span>
                </Button>
              </div>
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
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn("font-semibold", getTransactionColor(transaction.type))}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
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
                          <span>{transaction.date}</span>
                          {transaction.stripeTransactionId && (
                            <>
                              <span>•</span>
                              <span>ID: {transaction.stripeTransactionId}</span>
                            </>
                          )}
                        </div>
                        {transaction.customer && (
                          <p className="text-sm text-blue-600">Customer: {transaction.customer}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-lg font-semibold", getTransactionColor(transaction.type))}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment Methods</CardTitle>
              <Button onClick={handleAddPaymentMethod} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Method
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">
                            {method.brand} ****{method.last4}
                          </p>
                          {method.isDefault && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear} • {method.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <Button variant="outline" size="sm">
                          Set as Default
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stripe Integration Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Stripe Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">Stripe Connect Status</p>
                    <p className="text-sm text-blue-700">Your account is connected and verified</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Processing Fees</p>
                    <p className="text-gray-600">2.9% + $0.30 per transaction</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Payout Schedule</p>
                    <p className="text-gray-600">Daily (1-2 business days)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <p className="text-gray-600">Configure your payment preferences and automation.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Automatic Payments</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-pay for recurring services</Label>
                      <p className="text-sm text-gray-600">Automatically charge your default payment method for subscription fees</p>
                    </div>
                    <Switch
                      checked={paymentSettings.autoPayRecurring}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, autoPayRecurring: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-withdrawal</Label>
                      <p className="text-sm text-gray-600">Automatically withdraw funds when balance reaches threshold</p>
                    </div>
                    <Switch
                      checked={paymentSettings.autoWithdrawal}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, autoWithdrawal: checked})}
                    />
                  </div>
                  {paymentSettings.autoWithdrawal && (
                    <div className="ml-6 p-3 bg-blue-50 rounded-lg">
                      <Label htmlFor="withdrawal-threshold">Withdrawal Threshold</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm">$</span>
                        <Input
                          id="withdrawal-threshold"
                          type="number"
                          value={paymentSettings.withdrawalThreshold}
                          onChange={(e) => setPaymentSettings({...paymentSettings, withdrawalThreshold: parseInt(e.target.value) || 0})}
                          className="w-32"
                        />
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Funds will be automatically withdrawn to your default payment method when your balance reaches this amount.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Payment notifications</Label>
                      <p className="text-sm text-gray-600">Get notified when payments are processed or withdrawals complete</p>
                    </div>
                    <Switch
                      checked={paymentSettings.paymentNotifications}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, paymentNotifications: checked})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Save payment methods</Label>
                      <p className="text-sm text-gray-600">Securely store cards for faster payments and withdrawals</p>
                    </div>
                    <Switch
                      checked={paymentSettings.savePaymentMethods}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, savePaymentMethods: checked})}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">Secure Payment Processing</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    All payment methods are securely stored and processed by Stripe. Your financial information is encrypted and protected with bank-level security.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorWalletPage;
