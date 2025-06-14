import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Wallet, 
  CreditCard, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Settings,
  Eye,
  EyeOff,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Edit,
  Shield,
  Bell
} from "lucide-react";
import { toast } from "sonner";

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

interface Transaction {
  id: string;
  type: "commission" | "withdrawal" | "refund" | "fee";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
  paymentMethod?: string;
}

const ClientWalletPage = () => {
  const [balance] = useState(12450.75);
  const [pendingBalance] = useState(2340.50);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [autoWithdraw, setAutoWithdraw] = useState(false);
  const [autoWithdrawThreshold, setAutoWithdrawThreshold] = useState("1000");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_001",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      name: "Think Partnership Corp"
    },
    {
      id: "pm_002",
      type: "card",
      last4: "8888",
      brand: "Mastercard",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
      name: "Think Partnership Corp"
    },
    {
      id: "pm_003",
      type: "card",
      last4: "1234",
      brand: "American Express",
      expiryMonth: 3,
      expiryYear: 2027,
      isDefault: false,
      name: "Business Account"
    }
  ]);

  const transactions: Transaction[] = [
    {
      id: "txn_001",
      type: "commission",
      amount: 2450.00,
      description: "Monthly commission from marketplace transactions",
      date: "2024-01-25T10:00:00Z",
      status: "completed"
    },
    {
      id: "txn_002",
      type: "withdrawal",
      amount: -1500.00,
      description: "Withdrawal to Visa ****4242",
      date: "2024-01-24T14:30:00Z",
      status: "completed",
      paymentMethod: "Visa ****4242"
    },
    {
      id: "txn_003",
      type: "commission",
      amount: 890.25,
      description: "Weekly commission from vendor referrals",
      date: "2024-01-22T09:15:00Z",
      status: "completed"
    },
    {
      id: "txn_004",
      type: "withdrawal",
      amount: -2000.00,
      description: "Withdrawal to Mastercard ****8888",
      date: "2024-01-20T16:45:00Z",
      status: "pending",
      paymentMethod: "Mastercard ****8888"
    },
    {
      id: "txn_005",
      type: "fee",
      amount: -25.00,
      description: "Platform service fee",
      date: "2024-01-20T16:45:00Z",
      status: "completed"
    }
  ];

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
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCardBrandIcon = (brand: string) => {
    // In a real app, you'd use actual card brand icons
    return <CreditCard className="h-5 w-5" />;
  };

  const handleAddCard = () => {
    // Simulate Stripe payment method addition
    toast.info("Redirecting to Stripe to add payment method...");
    setIsAddCardOpen(false);
    // In real implementation: redirect to Stripe setup
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || !selectedPaymentMethod) {
      toast.error("Please fill in all required fields.");
      return;
    }
    toast.success(`Withdrawal of $${withdrawAmount} initiated successfully!`);
    setIsWithdrawOpen(false);
    setWithdrawAmount("");
    setSelectedPaymentMethod("");
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(pm => ({ ...pm, isDefault: pm.id === id }))
    );
    toast.success("Default payment method updated!");
  };

  const handleDeleteCard = (id: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
    toast.success("Payment method removed!");
  };

  const totalIncome = transactions
    .filter(t => t.type === "commission" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = Math.abs(transactions
    .filter(t => t.type === "withdrawal" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0));

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet & Payments</h1>
        <p className="text-lg text-gray-700 mb-4">
          Manage your marketplace earnings, payment methods, and withdrawal settings.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsWithdrawOpen(true)}>
            <ArrowDownLeft className="mr-2 h-4 w-4" />
            Withdraw Funds
          </Button>
          <Button variant="outline" onClick={() => setIsAddCardOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Balance</p>
                <div className="flex items-center gap-2">
                  {isBalanceVisible ? (
                    <p className="text-3xl font-bold text-green-600">${balance.toLocaleString()}</p>
                  ) : (
                    <p className="text-3xl font-bold text-gray-400">••••••</p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                  >
                    {isBalanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Wallet className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Balance</p>
                <p className="text-3xl font-bold text-orange-600">${pendingBalance.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Processing in 2-3 days</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-blue-600">$3,340.25</p>
                <p className="text-xs text-green-600 font-medium">+12.5% from last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Management
          </CardTitle>
          <CardDescription>Manage your payment methods, transactions, and withdrawal settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawal Settings</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Transactions</h3>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Total Income</p>
                      <p className="text-xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <TrendingDown className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Total Withdrawals</p>
                      <p className="text-xl font-bold text-blue-600">${totalWithdrawals.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Net Earnings</p>
                      <p className="text-xl font-bold text-purple-600">${(totalIncome - totalWithdrawals).toLocaleString()}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTransactionIcon(transaction.type)}
                              <span className="capitalize">{transaction.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                          <TableCell>
                            <span className={`font-semibold ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payment-methods" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Payment Methods</h3>
                  <Button onClick={() => setIsAddCardOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Method
                  </Button>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(method.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteCard(method.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stripe Integration Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Account ID</h4>
                          <p className="text-sm text-gray-600 font-mono">acct_1234567890</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Country</h4>
                          <p className="text-sm text-gray-600">United States</p>
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
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="withdrawals" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Withdrawal Settings</h3>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Auto-Withdrawal</CardTitle>
                    <CardDescription>
                      Automatically withdraw funds when your balance reaches a certain threshold.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-withdraw" className="text-sm font-medium">
                          Enable Auto-Withdrawal
                        </Label>
                        <p className="text-xs text-gray-500">
                          Funds will be automatically withdrawn to your default payment method
                        </p>
                      </div>
                      <Switch
                        id="auto-withdraw"
                        checked={autoWithdraw}
                        onCheckedChange={setAutoWithdraw}
                      />
                    </div>

                    {autoWithdraw && (
                      <div className="space-y-4 pt-4 border-t">
                        <div>
                          <Label htmlFor="threshold">Withdrawal Threshold</Label>
                          <Select value={autoWithdrawThreshold} onValueChange={setAutoWithdrawThreshold}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select threshold" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="500">$500</SelectItem>
                              <SelectItem value="1000">$1,000</SelectItem>
                              <SelectItem value="2500">$2,500</SelectItem>
                              <SelectItem value="5000">$5,000</SelectItem>
                              <SelectItem value="10000">$10,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <p className="text-sm text-orange-800">
                              Auto-withdrawals are processed within 2-3 business days.
                              You can disable this feature at any time.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Withdrawal Schedule</CardTitle>
                    <CardDescription>
                      Set up recurring withdrawals on a schedule.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="day">Day</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monday">Monday</SelectItem>
                            <SelectItem value="friday">Friday</SelectItem>
                            <SelectItem value="1">1st of month</SelectItem>
                            <SelectItem value="15">15th of month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Set Up Scheduled Withdrawals
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Payment Notifications</h3>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how you want to be notified about payment activities.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="text-sm font-medium">
                          Email Notifications
                        </Label>
                        <p className="text-xs text-gray-500">
                          Receive email alerts for withdrawals, deposits, and payment issues
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications" className="text-sm font-medium">
                          SMS Notifications
                        </Label>
                        <p className="text-xs text-gray-500">
                          Receive text messages for high-priority payment alerts
                        </p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                      />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium">Notification Types</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Successful withdrawals</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Failed transactions</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Commission payments received</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Low balance alerts</span>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Payment Method Dialog */}
      <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Add Payment Method
            </DialogTitle>
            <DialogDescription>
              Connect a new payment method through Stripe for secure withdrawals.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payment Setup</h3>
              <p className="text-sm text-gray-600">
                You'll be redirected to Stripe's secure platform to add your payment method.
                This ensures your financial information is protected with bank-level security.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">What happens next:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Secure redirect to Stripe's payment setup</li>
                <li>• Add your credit or debit card details</li>
                <li>• Verify your payment method</li>
                <li>• Return to your wallet dashboard</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-800 font-medium">
                  Powered by Stripe - Industry-leading payment security
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCardOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCard} className="bg-blue-600 hover:bg-blue-700">
              <Shield className="mr-2 h-4 w-4" />
              Continue with Stripe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Funds Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Transfer money from your wallet to your payment method.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="withdraw-amount">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Available balance: ${balance.toLocaleString()}
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
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>{method.brand} ****{method.last4}</span>
                        {method.isDefault && <Badge variant="outline" className="text-xs">Default</Badge>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-xs text-orange-800 font-medium">Processing Time</p>
                  <p className="text-xs text-orange-700">
                    Withdrawals typically take 2-3 business days to appear in your account.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWithdrawOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleWithdraw} className="bg-green-600 hover:bg-green-700">
              Withdraw ${withdrawAmount || '0.00'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientWalletPage;
