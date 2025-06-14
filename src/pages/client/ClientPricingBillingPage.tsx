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
  DollarSign, 
  CreditCard,
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Crown,
  TrendingUp,
  Calendar,
  AlertCircle,
  Info,
  Building,
  Percent,
  Calculator
} from "lucide-react";
import { toast } from "sonner";

interface VendorPricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyFee: number;
  features: string[];
  isActive: boolean;
  vendorCount: number;
}

interface VendorFee {
  id: string;
  type: "subscription" | "commission";
  name: string;
  amount: number;
  isPercentage: boolean;
  isActive: boolean;
  description: string;
}

const ClientPricingBillingPage = () => {
  const [chargeVendors, setChargeVendors] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [isEditFeeOpen, setIsEditFeeOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<VendorFee | null>(null);
  const [editingPlan, setEditingPlan] = useState<VendorPricingPlan | null>(null);
  const [planForm, setPlanForm] = useState({
    name: "",
    description: "",
    monthlyFee: 0,
    features: [""]
  });
  const [calculatorData, setCalculatorData] = useState({
    basicVendors: 0,
    professionalVendors: 0,
    premiumVendors: 0,
    monthlyTransactions: 0,
    avgTransactionValue: 0,
    commissionRate: 8.0
  });

  const [vendorPricingPlans, setVendorPricingPlans] = useState<VendorPricingPlan[]>([
    {
      id: "basic",
      name: "Basic Vendor Plan",
      description: "Entry-level plan for new vendors joining your marketplace",
      monthlyFee: 29.99,
      features: ["List up to 5 services", "Basic profile", "Customer messaging", "Payment processing"],
      isActive: false,
      vendorCount: 12
    },
    {
      id: "professional",
      name: "Professional Vendor Plan",
      description: "Most popular plan for established vendors",
      monthlyFee: 79.99,
      features: ["List up to 20 services", "Enhanced profile", "Priority support", "Analytics dashboard", "Promotional tools"],
      isActive: true,
      vendorCount: 28
    },
    {
      id: "premium",
      name: "Premium Vendor Plan",
      description: "Advanced plan for high-volume vendors",
      monthlyFee: 149.99,
      features: ["Unlimited service listings", "Premium profile badge", "24/7 support", "Advanced analytics", "Custom branding", "API access"],
      isActive: false,
      vendorCount: 5
    }
  ]);

  const [vendorFees, setVendorFees] = useState<VendorFee[]>([
    {
      id: "commission_fee",
      type: "commission",
      name: "Commission Fee",
      amount: 8.0,
      isPercentage: true,
      isActive: true,
      description: "Percentage taken from each completed transaction"
    }
  ]);

  const activePlan = vendorPricingPlans.find(plan => plan.isActive);
  const totalVendors = vendorPricingPlans.reduce((sum, plan) => sum + plan.vendorCount, 0);
  const totalMonthlyRevenue = vendorPricingPlans.reduce((sum, plan) => sum + (plan.monthlyFee * plan.vendorCount), 0);

  const handleSwitchPlan = (planId: string) => {
    setSelectedPlan(planId);
    toast.success("Plan updated successfully!");
  };

  const handleToggleVendorCharging = (enabled: boolean) => {
    setChargeVendors(enabled);
    if (enabled) {
      toast.success("Vendor charging enabled. You can now collect fees from vendors.");
    } else {
      toast.info("Vendor charging disabled. All vendor fees have been paused.");
    }
  };

  const handleToggleFee = (feeId: string) => {
    setVendorFees(prev => 
      prev.map(fee => 
        fee.id === feeId ? { ...fee, isActive: !fee.isActive } : fee
      )
    );
    toast.success("Fee setting updated!");
  };

  const handleEditFee = (fee: VendorFee) => {
    setSelectedFee(fee);
    setIsEditFeeOpen(true);
  };

  const handleDeleteFee = (feeId: string) => {
    setVendorFees(prev => prev.filter(fee => fee.id !== feeId));
    toast.success("Fee deleted successfully!");
  };

  const handleEditPlan = (plan: VendorPricingPlan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      description: plan.description,
      monthlyFee: plan.monthlyFee,
      features: [...plan.features]
    });
    setIsEditPlanOpen(true);
  };

  const handleSavePlan = () => {
    if (!editingPlan || !planForm.name || !planForm.description || planForm.monthlyFee <= 0) {
      toast.error("Please fill in all required fields with valid values.");
      return;
    }

    setVendorPricingPlans(prev =>
      prev.map(plan =>
        plan.id === editingPlan.id
          ? {
              ...plan,
              name: planForm.name,
              description: planForm.description,
              monthlyFee: planForm.monthlyFee,
              features: planForm.features.filter(f => f.trim() !== "")
            }
          : plan
      )
    );

    toast.success("Vendor plan updated successfully!");
    setIsEditPlanOpen(false);
    setEditingPlan(null);
    setPlanForm({ name: "", description: "", monthlyFee: 0, features: [""] });
  };

  const handleAddFeature = () => {
    setPlanForm(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setPlanForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setPlanForm(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const handleOpenCalculator = () => {
    // Pre-populate with current data
    setCalculatorData({
      basicVendors: vendorPricingPlans.find(p => p.id === "basic")?.vendorCount || 0,
      professionalVendors: vendorPricingPlans.find(p => p.id === "professional")?.vendorCount || 0,
      premiumVendors: vendorPricingPlans.find(p => p.id === "premium")?.vendorCount || 0,
      monthlyTransactions: 150,
      avgTransactionValue: 250,
      commissionRate: vendorFees[0]?.amount || 8.0
    });
    setIsCalculatorOpen(true);
  };

  const calculateRevenue = () => {
    const basicPlan = vendorPricingPlans.find(p => p.id === "basic");
    const professionalPlan = vendorPricingPlans.find(p => p.id === "professional");
    const premiumPlan = vendorPricingPlans.find(p => p.id === "premium");

    const subscriptionRevenue =
      (calculatorData.basicVendors * (basicPlan?.monthlyFee || 0)) +
      (calculatorData.professionalVendors * (professionalPlan?.monthlyFee || 0)) +
      (calculatorData.premiumVendors * (premiumPlan?.monthlyFee || 0));

    const totalTransactionValue = calculatorData.monthlyTransactions * calculatorData.avgTransactionValue;
    const commissionRevenue = (totalTransactionValue * calculatorData.commissionRate) / 100;

    const totalRevenue = subscriptionRevenue + commissionRevenue;

    return {
      subscriptionRevenue,
      commissionRevenue,
      totalTransactionValue,
      totalRevenue,
      totalVendors: calculatorData.basicVendors + calculatorData.professionalVendors + calculatorData.premiumVendors
    };
  };

  const getFeeTypeIcon = (type: string) => {
    switch (type) {
      case "commission": return <Percent className="h-4 w-4 text-green-600" />;
      default: return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getFeeTypeColor = (type: string) => {
    switch (type) {
      case "commission": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Pricing & Billing</h1>
        <p className="text-lg text-gray-700 mb-4">
          Set pricing plans and fees that your vendors will pay to use your marketplace.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsCreatePlanOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Vendor Plan
          </Button>
          <Button variant="outline" onClick={handleOpenCalculator}>
            <Calculator className="mr-2 h-4 w-4" />
            Revenue Calculator
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Crown className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Most Popular Plan</p>
                <p className="text-xl font-bold text-blue-600">{activePlan?.name}</p>
                <p className="text-xs text-gray-500">${activePlan?.monthlyFee}/month per vendor</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-xl font-bold text-green-600">${totalMonthlyRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-500">From vendor subscriptions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Vendors</p>
                <p className="text-xl font-bold text-purple-600">{totalVendors}</p>
                <p className="text-xs text-gray-500">Across all plans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Fees</p>
                <p className="text-xl font-bold text-orange-600">{vendorFees.filter(f => f.isActive).length}</p>
                <p className="text-xs text-gray-500">of {vendorFees.length} total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Charging Toggle */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Vendor Charging Settings
          </CardTitle>
          <CardDescription>Control whether you charge vendors for using your marketplace.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Charge Vendors</h4>
              <p className="text-sm text-gray-600">
                {chargeVendors 
                  ? "You are currently collecting fees from vendors" 
                  : "Vendor charging is disabled - marketplace is free for vendors"
                }
              </p>
            </div>
            <Switch
              checked={chargeVendors}
              onCheckedChange={handleToggleVendorCharging}
            />
          </div>
          
          {!chargeVendors && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-800">
                  When vendor charging is disabled, all vendor fees are paused. You can still configure fees for future use.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Vendor Pricing Management
          </CardTitle>
          <CardDescription>Set the pricing plans and fees that vendors pay to use your marketplace.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="vendor-plans" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vendor-plans">Vendor Plans</TabsTrigger>
              <TabsTrigger value="commission-fees">Commission Fees</TabsTrigger>
              <TabsTrigger value="revenue-tracking">Revenue Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="vendor-plans" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Vendor Subscription Plans</h3>
                  <p className="text-sm text-gray-600">These are the monthly plans vendors choose from</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {vendorPricingPlans.map((plan) => (
                    <Card key={plan.id} className={`relative hover:shadow-lg transition-all duration-200 ${
                      plan.isActive ? 'ring-2 ring-green-500 border-green-200' : ''
                    }`}>
                      {plan.isActive && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-green-600 text-white">Most Popular</Badge>
                        </div>
                      )}
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="mt-4">
                          <span className="text-3xl font-bold">${plan.monthlyFee}</span>
                          <span className="text-gray-500">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p>• {plan.vendorCount} vendors currently subscribed</p>
                          <p>• Monthly revenue: ${(plan.monthlyFee * plan.vendorCount).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleEditPlan(plan)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Plan
                          </Button>
                          <Button
                            variant={plan.isActive ? "outline" : "default"}
                            className="flex-1"
                            onClick={() => toast.success(`${plan.name} ${plan.isActive ? 'deactivated' : 'activated'}!`)}
                          >
                            {plan.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">How Vendor Plans Work</h4>
                    <div className="text-sm text-blue-800 space-y-2">
                      <p>• Vendors choose and pay for these monthly subscription plans</p>
                      <p>• Each plan offers different features and service listing limits</p>
                      <p>• You collect the monthly fees directly from vendors</p>
                      <p>• Plans can be activated/deactivated to control vendor options</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="commission-fees" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Commission Fee Structure</h3>
                  <p className="text-sm text-gray-600">Set the percentage you take from each transaction</p>
                </div>

                {!chargeVendors && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <p className="text-sm text-orange-800">
                        Vendor charging is currently disabled. Enable it in the settings above to start collecting commission fees.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Commission Settings</CardTitle>
                      <CardDescription>Configure the percentage you take from each completed transaction</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {vendorFees.map((fee) => (
                        <div key={fee.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Percent className="h-5 w-5 text-green-600" />
                              <h4 className="font-medium">{fee.name}</h4>
                            </div>
                            <Switch
                              checked={fee.isActive && chargeVendors}
                              onCheckedChange={() => handleToggleFee(fee.id)}
                              disabled={!chargeVendors}
                            />
                          </div>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="commission-rate">Commission Rate</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  id="commission-rate"
                                  type="number"
                                  value={fee.amount}
                                  onChange={(e) => {
                                    const newAmount = parseFloat(e.target.value);
                                    setVendorFees(prev =>
                                      prev.map(f => f.id === fee.id ? { ...f, amount: newAmount } : f)
                                    );
                                  }}
                                  className="w-24"
                                  step="0.1"
                                  min="0"
                                  max="50"
                                />
                                <span className="text-sm text-gray-600">%</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">{fee.description}</p>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Status:</span>
                              <Badge className={fee.isActive && chargeVendors ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                {fee.isActive && chargeVendors ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Commission Calculator</CardTitle>
                      <CardDescription>See how much you'll earn from different transaction amounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="transaction-amount">Transaction Amount</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="transaction-amount"
                              type="number"
                              placeholder="100.00"
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Transaction Amount:</span>
                            <span className="font-medium">$100.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Your Commission ({vendorFees[0]?.amount}%):</span>
                            <span className="font-medium text-green-600">$8.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Vendor Receives:</span>
                            <span className="font-medium">$92.00</span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          <p>• Commission is automatically deducted from each transaction</p>
                          <p>• Vendors see the net amount after commission</p>
                          <p>• Commission rates can be adjusted anytime</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">How Commission Works</h4>
                    <div className="text-sm text-blue-800 space-y-2">
                      <p>• Commission is automatically deducted from each completed transaction</p>
                      <p>• Vendors receive the remaining amount after commission is taken</p>
                      <p>• Commission rates apply to all vendors equally</p>
                      <p>• You can adjust rates anytime, changes apply to new transactions</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue-tracking" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Revenue Tracking</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Current Month Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vendor Subscriptions</span>
                          <span className="font-semibold text-green-600">${totalMonthlyRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Commission Fees</span>
                          <span className="font-semibold text-green-600">$2,450.75</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-semibold">
                          <span>Total Revenue</span>
                          <span className="text-green-600">${(totalMonthlyRevenue + 2450.75).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Revenue Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Subscription Revenue</span>
                            <span>{Math.round((totalMonthlyRevenue / (totalMonthlyRevenue + 2450.75)) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.round((totalMonthlyRevenue / (totalMonthlyRevenue + 2450.75)) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Commission Revenue</span>
                            <span>{Math.round((2450.75 / (totalMonthlyRevenue + 2450.75)) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${Math.round((2450.75 / (totalMonthlyRevenue + 2450.75)) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Revenue by Vendor Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {vendorPricingPlans.map((plan) => (
                        <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{plan.name}</p>
                            <p className="text-sm text-gray-600">{plan.vendorCount} vendors × ${plan.monthlyFee}/month</p>
                          </div>
                          <span className="font-semibold text-green-600">
                            ${(plan.monthlyFee * plan.vendorCount).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recent Revenue Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Professional Plan Subscriptions</p>
                          <p className="text-sm text-gray-600">28 vendors - Jan 2024</p>
                        </div>
                        <span className="font-semibold text-green-600">+$2,239.72</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Commission from Transactions</p>
                          <p className="text-sm text-gray-600">8% commission - Jan 2024</p>
                        </div>
                        <span className="font-semibold text-green-600">+$2,450.75</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Basic Plan Subscriptions</p>
                          <p className="text-sm text-gray-600">12 vendors - Jan 2024</p>
                        </div>
                        <span className="font-semibold text-green-600">+$359.88</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditPlanOpen} onOpenChange={setIsEditPlanOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Vendor Plan</DialogTitle>
            <DialogDescription>
              Modify the pricing plan that vendors can subscribe to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input
                  id="plan-name"
                  value={planForm.name}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Professional Vendor Plan"
                />
              </div>
              <div>
                <Label htmlFor="monthly-fee">Monthly Fee</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="monthly-fee"
                    type="number"
                    value={planForm.monthlyFee}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, monthlyFee: parseFloat(e.target.value) || 0 }))}
                    placeholder="79.99"
                    className="pl-10"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="plan-description">Description</Label>
              <Input
                id="plan-description"
                value={planForm.description}
                onChange={(e) => setPlanForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of what this plan offers"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Plan Features</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddFeature}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </div>
              <div className="space-y-2">
                {planForm.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="e.g., List up to 20 services"
                      className="flex-1"
                    />
                    {planForm.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Plan Preview</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Name:</strong> {planForm.name || "Plan Name"}</p>
                <p><strong>Price:</strong> ${planForm.monthlyFee}/month</p>
                <p><strong>Description:</strong> {planForm.description || "Plan description"}</p>
                <p><strong>Features:</strong> {planForm.features.filter(f => f.trim()).length} features</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPlanOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePlan} className="bg-green-600 hover:bg-green-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revenue Calculator Dialog */}
      <Dialog open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Revenue Calculator
            </DialogTitle>
            <DialogDescription>
              Calculate your potential monthly revenue based on vendor counts and transaction volume.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Vendor Subscriptions</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="basic-vendors">Basic Plan Vendors</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="basic-vendors"
                          type="number"
                          value={calculatorData.basicVendors}
                          onChange={(e) => setCalculatorData(prev => ({ ...prev, basicVendors: parseInt(e.target.value) || 0 }))}
                          min="0"
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500">× ${vendorPricingPlans.find(p => p.id === "basic")?.monthlyFee}</span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="professional-vendors">Professional Plan Vendors</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="professional-vendors"
                          type="number"
                          value={calculatorData.professionalVendors}
                          onChange={(e) => setCalculatorData(prev => ({ ...prev, professionalVendors: parseInt(e.target.value) || 0 }))}
                          min="0"
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500">× ${vendorPricingPlans.find(p => p.id === "professional")?.monthlyFee}</span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="premium-vendors">Premium Plan Vendors</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="premium-vendors"
                          type="number"
                          value={calculatorData.premiumVendors}
                          onChange={(e) => setCalculatorData(prev => ({ ...prev, premiumVendors: parseInt(e.target.value) || 0 }))}
                          min="0"
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500">× ${vendorPricingPlans.find(p => p.id === "premium")?.monthlyFee}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Transaction Volume</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="monthly-transactions">Monthly Transactions</Label>
                      <Input
                        id="monthly-transactions"
                        type="number"
                        value={calculatorData.monthlyTransactions}
                        onChange={(e) => setCalculatorData(prev => ({ ...prev, monthlyTransactions: parseInt(e.target.value) || 0 }))}
                        min="0"
                        placeholder="150"
                      />
                    </div>
                    <div>
                      <Label htmlFor="avg-transaction-value">Average Transaction Value</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="avg-transaction-value"
                          type="number"
                          value={calculatorData.avgTransactionValue}
                          onChange={(e) => setCalculatorData(prev => ({ ...prev, avgTransactionValue: parseFloat(e.target.value) || 0 }))}
                          min="0"
                          step="0.01"
                          placeholder="250.00"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="commission-rate">Commission Rate</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="commission-rate"
                          type="number"
                          value={calculatorData.commissionRate}
                          onChange={(e) => setCalculatorData(prev => ({ ...prev, commissionRate: parseFloat(e.target.value) || 0 }))}
                          min="0"
                          max="50"
                          step="0.1"
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Revenue Projection</h4>
                  <div className="space-y-4">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Subscription Revenue:</span>
                            <span className="font-semibold text-blue-600">
                              ${calculateRevenue().subscriptionRevenue.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Commission Revenue:</span>
                            <span className="font-semibold text-green-600">
                              ${calculateRevenue().commissionRevenue.toLocaleString()}
                            </span>
                          </div>
                          <hr className="border-blue-300" />
                          <div className="flex justify-between">
                            <span className="font-semibold text-blue-900">Total Monthly Revenue:</span>
                            <span className="font-bold text-xl text-blue-900">
                              ${calculateRevenue().totalRevenue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {calculateRevenue().totalVendors}
                          </div>
                          <div className="text-sm text-gray-600">Total Vendors</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            ${calculateRevenue().totalTransactionValue.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Transaction Volume</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900">Annual Projection</h5>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          ${(calculateRevenue().totalRevenue * 12).toLocaleString()}
                        </div>
                        <div className="text-sm text-green-700">Estimated yearly revenue</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Breakdown</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• {calculatorData.basicVendors} Basic vendors: ${(calculatorData.basicVendors * (vendorPricingPlans.find(p => p.id === "basic")?.monthlyFee || 0)).toLocaleString()}</p>
                    <p>• {calculatorData.professionalVendors} Professional vendors: ${(calculatorData.professionalVendors * (vendorPricingPlans.find(p => p.id === "professional")?.monthlyFee || 0)).toLocaleString()}</p>
                    <p>• {calculatorData.premiumVendors} Premium vendors: ${(calculatorData.premiumVendors * (vendorPricingPlans.find(p => p.id === "premium")?.monthlyFee || 0)).toLocaleString()}</p>
                    <p>• {calculatorData.monthlyTransactions} transactions × ${calculatorData.avgTransactionValue} × {calculatorData.commissionRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCalculatorOpen(false)}>
              Close
            </Button>
            <Button onClick={() => toast.success("Revenue projection saved to your dashboard!")}>
              Save Projection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientPricingBillingPage;
