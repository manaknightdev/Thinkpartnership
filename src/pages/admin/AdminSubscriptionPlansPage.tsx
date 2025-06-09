import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { DollarSign, PlusCircle, Edit, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  description: string;
}

const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan-basic",
    name: "Basic Listing",
    price: "$19/month",
    features: ["Standard listing", "5 service listings", "Basic analytics"],
    description: "Ideal for new vendors looking to get started."
  },
  {
    id: "plan-premium",
    name: "Premium Placement",
    price: "$49/month",
    features: ["Featured listing (rotating)", "Unlimited service listings", "Advanced analytics", "Priority support"],
    description: "Boost visibility and access deeper insights."
  },
  {
    id: "plan-elite",
    name: "Elite Partner",
    price: "$99/month",
    features: ["Top placement (fixed)", "Unlimited service listings", "Full analytics suite", "Dedicated account manager", "API access"],
    description: "Maximize your reach and integrate seamlessly."
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

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Vendor Subscription Plans</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Define and manage the different subscription tiers available for vendors in your marketplace.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> Current Subscription Plans
          </CardTitle>
          <CardDescription>Overview of all active and draft subscription plans.</CardDescription>
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
          <CardDescription>Create a new tier for vendors to subscribe to.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="plan-name">Plan Name</Label>
            <Input
              id="plan-name"
              type="text"
              placeholder="e.g., Premium Listing"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="plan-price">Price (e.g., $49/month)</Label>
            <Input
              id="plan-price"
              type="text"
              placeholder="$XX/month or $YYY/year"
              value={newPlan.price}
              onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="plan-features">Features (comma-separated)</Label>
            <Input
              id="plan-features"
              type="text"
              placeholder="e.g., Featured listing, Advanced analytics"
              value={newPlan.features.join(", ")}
              onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value.split(',').map(f => f.trim()) })}
            />
          </div>
          <div>
            <Label htmlFor="plan-description">Description</Label>
            <Input
              id="plan-description"
              type="text"
              placeholder="A brief description of the plan benefits."
              value={newPlan.description}
              onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
            />
          </div>
          <Button onClick={handleAddPlan} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubscriptionPlansPage;