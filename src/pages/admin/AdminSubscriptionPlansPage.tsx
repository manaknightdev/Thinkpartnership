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
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Client Subscription Plans</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Define and manage the different subscription tiers available for clients using your SaaS platform.
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
    </div>
  );
};

export default AdminSubscriptionPlansPage;