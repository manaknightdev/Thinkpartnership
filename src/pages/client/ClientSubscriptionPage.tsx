import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Crown,
  CreditCard,
  DollarSign,
  CheckCircle,
  Calendar,
  TrendingUp,
  Building,
  Users,
  Settings,
  Star,
  Zap,
  Shield,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  monthlyPrice: number;
  features: string[];
  description: string;
  popular?: boolean;
  icon: any;
  color: string;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  plan: string;
  status: "paid" | "pending" | "failed";
  invoiceUrl?: string;
}

const ClientSubscriptionPage = () => {
  const [currentPlan, setCurrentPlan] = useState("professional");
  const [serviceFeeEnabled, setServiceFeeEnabled] = useState(true); // Toggle for service fee
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "starter",
      name: "Starter",
      price: "$99/month",
      monthlyPrice: 99,
      features: [
        "Up to 50 vendors",
        "Basic marketplace features", 
        "Standard support",
        "Basic analytics",
        "Custom subdomain"
      ],
      description: "Perfect for small businesses starting their marketplace journey.",
      icon: Shield,
      color: "blue"
    },
    {
      id: "professional",
      name: "Professional", 
      price: "$299/month",
      monthlyPrice: 299,
      features: [
        "Up to 200 vendors",
        "Advanced marketplace features",
        "Priority support", 
        "Advanced analytics",
        "Custom domain",
        "White-label branding"
      ],
      description: "Ideal for growing businesses with expanding vendor networks.",
      popular: true,
      icon: Star,
      color: "purple"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$599/month", 
      monthlyPrice: 599,
      features: [
        "Unlimited vendors",
        "Full marketplace suite",
        "24/7 dedicated support",
        "Enterprise analytics", 
        "Custom domain",
        "Full white-label",
        "API access",
        "Custom integrations"
      ],
      description: "Complete solution for large-scale marketplace operations.",
      icon: Zap,
      color: "green"
    }
  ];

  const billingHistory: BillingHistory[] = [
    {
      id: "inv-001",
      date: "2024-01-01",
      amount: 299,
      plan: "Professional",
      status: "paid",
      invoiceUrl: "#"
    },
    {
      id: "inv-002", 
      date: "2023-12-01",
      amount: 299,
      plan: "Professional",
      status: "paid",
      invoiceUrl: "#"
    },
    {
      id: "inv-003",
      date: "2023-11-01", 
      amount: 299,
      plan: "Professional",
      status: "paid",
      invoiceUrl: "#"
    }
  ];

  const handleUpgrade = (planId: string) => {
    setCurrentPlan(planId);
    toast.success(`Successfully upgraded to ${subscriptionPlans.find(p => p.id === planId)?.name} plan!`);
  };

  const handleManageBilling = () => {
    setIsBillingModalOpen(true);
  };

  const handleViewUsage = () => {
    setIsUsageModalOpen(true);
  };

  const handleToggleServiceFee = (enabled: boolean) => {
    setServiceFeeEnabled(enabled);
    if (enabled) {
      toast.success("Marketplace management service enabled. Admin will manage your marketplace for 2.5% service fee.");
    } else {
      toast.info("Marketplace management service disabled. You will manage your marketplace independently.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid": return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending": return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      case "failed": return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const currentPlanData = subscriptionPlans.find(p => p.id === currentPlan);

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Subscription</h1>
        <p className="text-lg text-gray-700 mb-4">
          Manage your platform subscription and billing with the admin team.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleManageBilling}>
            <CreditCard className="mr-2 h-4 w-4" />
            Manage Billing
          </Button>
          <Button variant="outline" onClick={handleViewUsage}>
            <Calendar className="mr-2 h-4 w-4" />
            View Usage
          </Button>
        </div>
      </div>

      {/* Current Plan Overview */}
      <Card className="border-l-4 border-l-blue-500 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-blue-600" />
            Current Plan
          </CardTitle>
          <CardDescription>Your active subscription with the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {currentPlanData && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-${currentPlanData.color}-100`}>
                  <currentPlanData.icon className={`h-6 w-6 text-${currentPlanData.color}-600`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{currentPlanData.name}</h3>
                  <p className="text-gray-600">{currentPlanData.price}</p>
                  <p className="text-sm text-gray-500">{currentPlanData.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">${currentPlanData.monthlyPrice}</div>
                <div className="text-sm text-gray-500">per month</div>
                <Badge className="bg-green-100 text-green-800 mt-2">Active</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">Available Plans</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="service-fees">Service Fees</TabsTrigger>
          <TabsTrigger value="referrals">Referral Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative transition-all duration-200 hover:shadow-lg ${
                  currentPlan === plan.id
                    ? 'ring-2 ring-blue-500 border-blue-200'
                    : plan.popular
                      ? 'shadow-lg border-purple-200'
                      : 'hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className={`mx-auto p-3 rounded-lg bg-${plan.color}-100 w-fit`}>
                    <plan.icon className={`h-6 w-6 text-${plan.color}-600`} />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">{plan.price}</div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    className="w-full"
                    variant={currentPlan === plan.id ? "secondary" : "default"}
                    disabled={currentPlan === plan.id}
                  >
                    {currentPlan === plan.id ? "Current Plan" : "Upgrade to " + plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Billing History
              </CardTitle>
              <CardDescription>Your payment history with the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingHistory.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                        <TableCell>{invoice.plan}</TableCell>
                        <TableCell>${invoice.amount}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="service-fees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Marketplace Management Service
              </CardTitle>
              <CardDescription>
                Choose whether you want admin to manage your marketplace for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Service Toggle */}
              <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Marketplace Management Service</h3>
                      <p className="text-sm text-gray-600">
                        {serviceFeeEnabled
                          ? "Admin is currently managing your marketplace for 2.5% service fee"
                          : "You are managing your marketplace independently"
                        }
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">
                        {serviceFeeEnabled ? "Enabled" : "Disabled"}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serviceFeeEnabled}
                          onChange={(e) => handleToggleServiceFee(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {serviceFeeEnabled ? (
                <>
                  {/* Service Fee Active Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-blue-900">Current Service Fee</h3>
                            <p className="text-sm text-gray-600">Applied to marketplace transactions</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">2.5%</div>
                            <Badge className="bg-blue-100 text-blue-800 mt-1">Active</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-green-900">This Month's Fees</h3>
                            <p className="text-sm text-gray-600">Service fees charged</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">$487.50</div>
                            <div className="text-sm text-gray-500">2.5% of $19,500 volume</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <>
                  {/* Service Fee Disabled Content */}
                  <Card className="mb-6 bg-gray-50 border-gray-200">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Self-Managed Marketplace</h3>
                        <p className="text-gray-600 mb-4">
                          You are currently managing your marketplace independently. No service fees are being charged.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="p-3 bg-white rounded-lg border">
                            <h4 className="font-medium text-gray-900 mb-2">Your Responsibilities:</h4>
                            <ul className="text-gray-600 space-y-1">
                              <li>• Vendor onboarding & training</li>
                              <li>• Customer support management</li>
                              <li>• Platform maintenance coordination</li>
                              <li>• Marketing & promotion</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-white rounded-lg border">
                            <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
                            <ul className="text-gray-600 space-y-1">
                              <li>• No additional service fees</li>
                              <li>• Full control over operations</li>
                              <li>• Direct vendor relationships</li>
                              <li>• Higher profit margins</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {serviceFeeEnabled && (
                <>
                  {/* Rest of the service fee content when enabled */}

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Service Fee Breakdown</CardTitle>
                  <CardDescription>
                    How marketplace management service fees are calculated
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Example Transaction Breakdown:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Customer Payment:</span>
                          <span className="font-medium">$100.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Platform Transaction Fee (5%):</span>
                          <span className="font-medium text-red-600">-$5.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service Fee (2.5%):</span>
                          <span className="font-medium text-blue-600">-$2.50</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Your Commission (10%):</span>
                          <span className="font-medium text-green-600">-$9.25</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-semibold">
                          <span>Vendor Receives:</span>
                          <span className="text-green-600">$83.25</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2">What's Included:</h5>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Vendor onboarding & training</li>
                          <li>• Customer support management</li>
                          <li>• Platform maintenance & updates</li>
                          <li>• Marketing & promotion</li>
                          <li>• Analytics & reporting</li>
                          <li>• Payment processing support</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h5 className="font-medium text-green-900 mb-2">Service Benefits:</h5>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Professional marketplace management</li>
                          <li>• Reduced operational overhead</li>
                          <li>• Expert vendor relationship management</li>
                          <li>• Enhanced customer experience</li>
                          <li>• Improved conversion rates</li>
                          <li>• 24/7 platform monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Service Fee History</CardTitle>
                  <CardDescription>
                    Monthly service fees charged for marketplace management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Transaction Volume</TableHead>
                          <TableHead>Service Fee Rate</TableHead>
                          <TableHead>Total Service Fee</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">January 2024</TableCell>
                          <TableCell>$19,500</TableCell>
                          <TableCell>2.5%</TableCell>
                          <TableCell>$487.50</TableCell>
                          <TableCell><Badge className="bg-green-100 text-green-800">Paid</Badge></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">December 2023</TableCell>
                          <TableCell>$22,100</TableCell>
                          <TableCell>2.5%</TableCell>
                          <TableCell>$552.50</TableCell>
                          <TableCell><Badge className="bg-green-100 text-green-800">Paid</Badge></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">November 2023</TableCell>
                          <TableCell>$18,750</TableCell>
                          <TableCell>2.5%</TableCell>
                          <TableCell>$468.75</TableCell>
                          <TableCell><Badge className="bg-green-100 text-green-800">Paid</Badge></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-yellow-900 mb-3">Service Fee Information</h4>
                      <div className="text-sm text-yellow-800 space-y-2">
                        <p>• Service fees are automatically calculated and charged monthly</p>
                        <p>• Fees are based on your total marketplace transaction volume</p>
                        <p>• Service includes comprehensive marketplace management and support</p>
                        <p>• You can discuss service fee adjustments with your account manager</p>
                        <p>• All fees are transparently reported in your billing dashboard</p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Service Management Options */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-blue-900 mb-3">
                    {serviceFeeEnabled ? "Professional Management Included" : "Enable Professional Management"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Vendor onboarding & training
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Customer support management
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Platform maintenance & updates
                      </li>
                    </ul>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Marketing & promotion
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Analytics & reporting
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        24/7 platform monitoring
                      </li>
                    </ul>
                  </div>
                  {!serviceFeeEnabled && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Enable service management for just 2.5% of transaction volume</strong> and let our expert team handle all marketplace operations while you focus on growing your business.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Referral Revenue Tracking
              </CardTitle>
              <CardDescription>
                Track revenue from customers you referred who purchase from other vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">$2,450</div>
                  <div className="text-sm text-gray-600">This Month</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">$18,750</div>
                  <div className="text-sm text-gray-600">Total Earned</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-gray-600">Referred Customers</div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How Referral Revenue Works:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Earn commission when your referred customers buy from other vendors</li>
                  <li>• Automatic tracking across the entire platform ecosystem</li>
                  <li>• Monthly payouts directly to your wallet</li>
                  <li>• Detailed reporting and analytics included</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Billing Management Modal */}
      <Dialog open={isBillingModalOpen} onOpenChange={setIsBillingModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing Management
            </DialogTitle>
            <DialogDescription>
              Manage your payment methods, billing information, and subscription settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Current Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-600">Visa ending in 4242 • Expires 12/26</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billing-name">Full Name</Label>
                    <Input id="billing-name" defaultValue="RealPartnersOS Corp" />
                  </div>
                  <div>
                    <Label htmlFor="billing-email">Email</Label>
                    <Input id="billing-email" type="email" defaultValue="billing@realpartneros.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="billing-address">Address</Label>
                  <Input id="billing-address" defaultValue="123 Business St, Suite 100" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="billing-city">City</Label>
                    <Input id="billing-city" defaultValue="Toronto" />
                  </div>
                  <div>
                    <Label htmlFor="billing-state">Province</Label>
                    <Input id="billing-state" defaultValue="ON" />
                  </div>
                  <div>
                    <Label htmlFor="billing-zip">Postal Code</Label>
                    <Input id="billing-zip" defaultValue="M5V 3A8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Plus className="h-4 w-4" />
                    <span className="font-medium">Add Payment Method</span>
                  </div>
                  <p className="text-sm text-gray-600">Add a new credit card or payment method</p>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Download className="h-4 w-4" />
                    <span className="font-medium">Download Invoices</span>
                  </div>
                  <p className="text-sm text-gray-600">Download all billing history as PDF</p>
                </div>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBillingModalOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              toast.success("Billing information updated successfully!");
              setIsBillingModalOpen(false);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Usage Analytics Modal */}
      <Dialog open={isUsageModalOpen} onOpenChange={setIsUsageModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Platform Usage Analytics
            </DialogTitle>
            <DialogDescription>
              Detailed analytics of your marketplace usage and performance metrics.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Usage Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">45</div>
                  <div className="text-sm text-gray-600">Active Vendors</div>
                  <div className="text-xs text-green-600">+5 this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">1,234</div>
                  <div className="text-sm text-gray-600">Total Customers</div>
                  <div className="text-xs text-green-600">+89 this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">$19,500</div>
                  <div className="text-sm text-gray-600">Monthly Volume</div>
                  <div className="text-xs text-green-600">+12% vs last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">156</div>
                  <div className="text-sm text-gray-600">Transactions</div>
                  <div className="text-xs text-green-600">+23 this month</div>
                </CardContent>
              </Card>
            </div>

            {/* Plan Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Plan Limits & Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Vendors (45 / 200)</span>
                      <span>22.5% used</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '22.5%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Monthly Transactions (156 / Unlimited)</span>
                      <span>Unlimited</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Storage Used (2.3 GB / 50 GB)</span>
                      <span>4.6% used</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '4.6%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Revenue:</span>
                      <span className="font-semibold">$19,500.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform Fee (5%):</span>
                      <span className="font-semibold text-red-600">-$975.00</span>
                    </div>
                    {serviceFeeEnabled && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Fee (2.5%):</span>
                        <span className="font-semibold text-blue-600">-$487.50</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Commission:</span>
                      <span className="font-semibold text-green-600">
                        ${serviceFeeEnabled ? '1,803.70' : '1,852.50'}
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold">
                      <span>Vendor Payments:</span>
                      <span className="text-green-600">
                        ${serviceFeeEnabled ? '16,233.80' : '16,672.50'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Performing Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Kitchen Renovation</p>
                        <p className="text-sm text-gray-600">Elite Kitchen Designs</p>
                      </div>
                      <span className="font-semibold text-green-600">$4,200</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Smart Home Installation</p>
                        <p className="text-sm text-gray-600">TechHome Solutions</p>
                      </div>
                      <span className="font-semibold text-green-600">$3,150</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Deep House Cleaning</p>
                        <p className="text-sm text-gray-600">Sparkling Spaces</p>
                      </div>
                      <span className="font-semibold text-green-600">$2,800</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUsageModalOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              toast.success("Usage report exported successfully!");
              setIsUsageModalOpen(false);
            }}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientSubscriptionPage;
