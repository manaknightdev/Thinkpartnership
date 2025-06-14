import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  CreditCard, 
  Check, 
  Star, 
  Zap, 
  Crown,
  Shield,
  Users,
  Calendar,
  DollarSign
} from "lucide-react";

interface VendorSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor?: any;
  onUpdateSubscription?: (vendorId: string, planId: string) => void;
}

const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: "$29",
    period: "month",
    icon: Shield,
    color: "blue",
    features: [
      "Up to 10 service listings",
      "Basic customer messaging",
      "Standard support",
      "5% commission rate",
      "Monthly analytics"
    ],
    limits: {
      listings: 10,
      customers: 50,
      support: "Standard"
    }
  },
  {
    id: "professional",
    name: "Professional",
    price: "$79",
    period: "month",
    icon: Star,
    color: "purple",
    popular: true,
    features: [
      "Up to 50 service listings",
      "Advanced customer messaging",
      "Priority support",
      "3% commission rate",
      "Weekly analytics",
      "Featured listing placement"
    ],
    limits: {
      listings: 50,
      customers: 200,
      support: "Priority"
    }
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$199",
    period: "month",
    icon: Crown,
    color: "gold",
    features: [
      "Unlimited service listings",
      "Premium customer messaging",
      "24/7 dedicated support",
      "1% commission rate",
      "Real-time analytics",
      "Premium listing placement",
      "Custom branding",
      "API access"
    ],
    limits: {
      listings: "Unlimited",
      customers: "Unlimited",
      support: "24/7 Dedicated"
    }
  }
];

export const VendorSubscriptionModal: React.FC<VendorSubscriptionModalProps> = ({ 
  isOpen, 
  onClose, 
  vendor,
  onUpdateSubscription
}) => {
  const [selectedPlan, setSelectedPlan] = useState(vendor?.currentPlan || "basic");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateSubscription = async () => {
    if (!vendor || !onUpdateSubscription) return;

    setIsUpdating(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      onUpdateSubscription(vendor.id, selectedPlan);
      
      const plan = subscriptionPlans.find(p => p.id === selectedPlan);
      toast.success(`Successfully updated ${vendor.name}'s subscription to ${plan?.name} plan`);
      
      onClose();
    } catch (error) {
      toast.error("Failed to update subscription. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getPlanIcon = (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) return Shield;
    return plan.icon;
  };

  const getPlanColor = (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    switch (plan?.color) {
      case "purple":
        return "text-purple-600 bg-purple-100";
      case "gold":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            Vendor Subscription Plans
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {vendor ? `Manage subscription plan for ${vendor.name}` : "Choose the right subscription plan for vendors"}
          </DialogDescription>
        </DialogHeader>

        {vendor && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{vendor.name}</h3>
                <p className="text-sm text-gray-600">{vendor.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Current Plan</p>
                <div className="flex items-center gap-2">
                  {React.createElement(getPlanIcon(vendor.currentPlan || "basic"), {
                    className: `h-4 w-4 ${getPlanColor(vendor.currentPlan || "basic").split(' ')[0]}`
                  })}
                  <span className="font-medium text-gray-900">
                    {subscriptionPlans.find(p => p.id === (vendor.currentPlan || "basic"))?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;
              const isCurrent = vendor?.currentPlan === plan.id;
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'ring-2 ring-purple-500 border-purple-200 shadow-lg' 
                      : 'border-gray-200 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-600 text-white hover:bg-purple-600">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  {isCurrent && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-green-600 text-white hover:bg-green-600">
                        Current Plan
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center ${
                      plan.color === 'purple' ? 'bg-purple-100' :
                      plan.color === 'gold' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        plan.color === 'purple' ? 'text-purple-600' :
                        plan.color === 'gold' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Plan Limits</h4>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Service Listings:</span>
                          <span className="font-medium">{plan.limits.listings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Customers:</span>
                          <span className="font-medium">{plan.limits.customers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Support:</span>
                          <span className="font-medium">{plan.limits.support}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {vendor && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Plan Change Information</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {selectedPlan === vendor.currentPlan 
                      ? "This vendor is already on the selected plan."
                      : "The subscription will be updated immediately. Billing will be prorated for the current period."
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          {vendor && onUpdateSubscription && (
            <Button
              onClick={handleUpdateSubscription}
              disabled={selectedPlan === vendor.currentPlan || isUpdating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isUpdating ? "Updating..." : "Update Subscription"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
