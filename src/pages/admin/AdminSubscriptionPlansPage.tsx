import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DollarSign, PlusCircle, Edit, Trash2, Percent, Settings, TrendingUp, Building } from "lucide-react";
import React, { useState } from "react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  description: string;
}

interface RevenueSettings {
  platformTransactionFee: number;
  marketplaceServiceFee: number;
  isServiceFeeEnabled: boolean;
}

const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan-starter",
    name: "Starter",
    price: "$99/month",
    features: ["Up to 50 vendors", "Basic marketplace features", "Standard support", "Basic analytics", "Custom subdomain"],
    description: "Perfect for small businesses starting their marketplace journey."
  },
  {
    id: "plan-professional",
    name: "Professional",
    price: "$299/month",
    features: ["Up to 200 vendors", "Advanced marketplace features", "Priority support", "Advanced analytics", "Custom domain", "White-label branding"],
    description: "Ideal for growing businesses with expanding vendor networks."
  },
  {
    id: "plan-enterprise",
    name: "Enterprise",
    price: "$599/month",
    features: ["Unlimited vendors", "Full marketplace suite", "24/7 dedicated support", "Enterprise analytics", "Custom domain", "Full white-label", "API access", "Custom integrations"],
    description: "Complete solution for large-scale marketplace operations."
  },
];

const AdminSubscriptionPlansPage = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockSubscriptionPlans);
  const [newPlan, setNewPlan] = useState<Omit<SubscriptionPlan, 'id'>>({
    name: "",
    price: "",
    features: [],
    description: "",
  });

  const [revenueSettings, setRevenueSettings] = useState<RevenueSettings>({
    platformTransactionFee: 5.0,
    marketplaceServiceFee: 2.5,
    isServiceFeeEnabled: true,
  });

  const handleAddPlan = () => {
    if (newPlan.name && newPlan.price && newPlan.features.length > 0) {
      const planToAdd = { ...newPlan, id: `plan-${Date.now()}` };
      setPlans([...plans, planToAdd]);
      setNewPlan({ name: "", price: "", features: [], description: "" });
      toast.success("Subscription plan added!");
    } else {
      toast.error("Please fill in all required fields for the new plan.");
    }
  };

  const handleEditPlan = (planId: string) => {
    toast.info(`Editing plan ${planId}... (functionality to be implemented)`);
    // In a real app, this would open a form to edit the plan
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter(plan => plan.id !== planId));
    toast.error("Subscription plan deleted!");
  };

  const handleSaveRevenueSettings = () => {
    toast.success("Revenue settings updated successfully!");
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Revenue Management</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Manage subscription plans for clients and configure platform revenue settings.
      </p>

      <Tabs defaultValue="subscription-plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscription-plans">Client Subscription Plans</TabsTrigger>
          <TabsTrigger value="revenue-settings">Revenue Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription-plans" className="space-y-6">

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" /> Current Subscription Plans
              </CardTitle>
              <CardDescription>Overview of all active and draft subscription plans for clients.</CardDescription>
            </CardHeader>
            <CardContent>
              {plans.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plan Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Features</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plans.map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell className="font-medium">{plan.name}</TableCell>
                          <TableCell>{plan.price}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{plan.features.join(", ")}</TableCell>
                          <TableCell className="max-w-[250px] truncate">{plan.description}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button onClick={() => handleEditPlan(plan.id)} variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => handleDeletePlan(plan.id)} variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No subscription plans defined yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" /> Add New Subscription Plan
              </CardTitle>
              <CardDescription>Create a new tier for clients to subscribe to.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input
                  id="plan-name"
                  type="text"
                  placeholder="e.g., Professional"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="plan-price">Price (e.g., $299/month)</Label>
                <Input
                  id="plan-price"
                  type="text"
                  placeholder="$XXX/month or $XXXX/year"
                  value={newPlan.price}
                  onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                />
              </div>
              <div>
            <Label htmlFor="plan-features">Features (comma-separated)</Label>
            <Input
              id="plan-features"
              type="text"
              placeholder="e.g., Up to 200 vendors, Advanced analytics, Custom domain"
              value={newPlan.features.join(", ")}
              onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value.split(',').map(f => f.trim()) })}
            />
          </div>
          <div>
            <Label htmlFor="plan-description">Description</Label>
            <Input
              id="plan-description"
              type="text"
              placeholder="A brief description of the plan benefits for clients."
              value={newPlan.description}
              onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
            />
          </div>
              <Button onClick={handleAddPlan} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Plan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue-settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Platform Transaction Fee */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-blue-600" />
                  Platform Transaction Fee
                </CardTitle>
                <CardDescription>
                  Percentage the platform earns from all marketplace transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="transaction-fee">Transaction Fee (%)</Label>
                  <Input
                    id="transaction-fee"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={revenueSettings.platformTransactionFee}
                    onChange={(e) => setRevenueSettings(prev => ({
                      ...prev,
                      platformTransactionFee: parseFloat(e.target.value) || 0
                    }))}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Current: {revenueSettings.platformTransactionFee}% of all transactions
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Applied to every marketplace transaction</li>
                    <li>• Deducted before client/vendor split</li>
                    <li>• Automatic collection via payment processing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Marketplace Service Fee */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-green-600" />
                  Marketplace Service Fee
                </CardTitle>
                <CardDescription>
                  Optional fee for managing marketplace on behalf of clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enable-service-fee"
                    checked={revenueSettings.isServiceFeeEnabled}
                    onChange={(e) => setRevenueSettings(prev => ({
                      ...prev,
                      isServiceFeeEnabled: e.target.checked
                    }))}
                    className="rounded"
                  />
                  <Label htmlFor="enable-service-fee">Enable Service Fee</Label>
                </div>
                {revenueSettings.isServiceFeeEnabled && (
                  <div>
                    <Label htmlFor="service-fee">Service Fee (%)</Label>
                    <Input
                      id="service-fee"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={revenueSettings.marketplaceServiceFee}
                      onChange={(e) => setRevenueSettings(prev => ({
                        ...prev,
                        marketplaceServiceFee: parseFloat(e.target.value) || 0
                      }))}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Additional {revenueSettings.marketplaceServiceFee}% for marketplace management
                    </p>
                  </div>
                )}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Service includes:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Vendor onboarding & management</li>
                    <li>• Customer support</li>
                    <li>• Platform maintenance & updates</li>
                    <li>• Marketing & promotion</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Revenue Summary
              </CardTitle>
              <CardDescription>
                Overview of platform revenue streams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">
                    {revenueSettings.platformTransactionFee}%
                  </div>
                  <div className="text-sm text-gray-600">Transaction Fee</div>
                  <div className="text-xs text-gray-500">From all marketplace sales</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">
                    {revenueSettings.isServiceFeeEnabled ? revenueSettings.marketplaceServiceFee : 0}%
                  </div>
                  <div className="text-sm text-gray-600">Service Fee</div>
                  <div className="text-xs text-gray-500">Marketplace management</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">
                    ${plans.reduce((sum, plan) => sum + parseInt(plan.price.replace(/[^0-9]/g, '')), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Monthly Subscriptions</div>
                  <div className="text-xs text-gray-500">From client plans</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveRevenueSettings} className="bg-blue-600 hover:bg-blue-700">
              <Settings className="mr-2 h-4 w-4" />
              Save Revenue Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSubscriptionPlansPage;