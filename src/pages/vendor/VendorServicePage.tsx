import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Check, 
  Star, 
  Edit, 
  Plus,
  DollarSign,
  Package,
  Crown,
  Zap
} from "lucide-react";
import { toast } from "sonner";

interface ServiceTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const VendorServicePage = () => {
  const [serviceTiers, setServiceTiers] = useState<ServiceTier[]>([
    {
      id: "basic",
      name: "Basic Service",
      price: 150,
      description: "Essential service package for standard needs",
      features: [
        "Initial consultation",
        "Basic service delivery",
        "Email support",
        "1 revision included"
      ]
    },
    {
      id: "standard",
      name: "Standard Service",
      price: 250,
      description: "Comprehensive service package with additional benefits",
      features: [
        "Everything in Basic",
        "Extended consultation",
        "Priority support",
        "3 revisions included",
        "Follow-up service"
      ],
      isPopular: true
    },
    {
      id: "premium",
      name: "Premium Service",
      price: 400,
      description: "Complete service package with premium features",
      features: [
        "Everything in Standard",
        "Dedicated account manager",
        "24/7 phone support",
        "Unlimited revisions",
        "Express delivery",
        "1-year warranty"
      ]
    }
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<ServiceTier | null>(null);

  const handleEditTier = (tier: ServiceTier) => {
    setEditingTier(tier);
    setIsEditModalOpen(true);
  };

  const handleSaveTier = () => {
    if (editingTier) {
      setServiceTiers(tiers => 
        tiers.map(tier => 
          tier.id === editingTier.id ? editingTier : tier
        )
      );
      toast.success("Service tier updated successfully!");
      setIsEditModalOpen(false);
      setEditingTier(null);
    }
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case "basic":
        return <Package className="h-6 w-6 text-blue-600" />;
      case "standard":
        return <Star className="h-6 w-6 text-purple-600" />;
      case "premium":
        return <Crown className="h-6 w-6 text-yellow-600" />;
      default:
        return <Package className="h-6 w-6 text-gray-600" />;
    }
  };

  const getTierColor = (tierId: string) => {
    switch (tierId) {
      case "basic":
        return "border-blue-200 bg-blue-50";
      case "standard":
        return "border-purple-200 bg-purple-50 ring-2 ring-purple-500";
      case "premium":
        return "border-yellow-200 bg-yellow-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Tiers</h1>
          <p className="text-gray-600 mt-1">
            Configure your 3-tier service offerings with different pricing and features.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Tier
          </Button>
        </div>
      </div>

      {/* Service Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {serviceTiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${getTierColor(tier.id)}`}
          >
            {tier.isPopular && (
              <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-2 text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <CardHeader className={tier.isPopular ? "pt-12" : ""}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTierIcon(tier.id)}
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditTier(tier)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-base">
                {tier.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Price */}
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                  <span className="text-gray-600">/service</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">What's included:</h4>
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full" 
                variant={tier.isPopular ? "default" : "outline"}
              >
                {tier.isPopular ? "Recommended" : "Select Plan"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Average Order Value</p>
            <p className="text-2xl font-bold text-gray-900">$267</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Most Popular Tier</p>
            <p className="text-2xl font-bold text-gray-900">Standard</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">47</p>
          </CardContent>
        </Card>
      </div>

      {/* Edit Tier Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Service Tier</DialogTitle>
            <DialogDescription>
              Update the details for your service tier.
            </DialogDescription>
          </DialogHeader>
          
          {editingTier && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="tier-name">Tier Name</Label>
                <Input
                  id="tier-name"
                  value={editingTier.name}
                  onChange={(e) => setEditingTier({...editingTier, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="tier-price">Price ($)</Label>
                <Input
                  id="tier-price"
                  type="number"
                  value={editingTier.price}
                  onChange={(e) => setEditingTier({...editingTier, price: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <Label htmlFor="tier-description">Description</Label>
                <Textarea
                  id="tier-description"
                  value={editingTier.description}
                  onChange={(e) => setEditingTier({...editingTier, description: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTier}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorServicePage;
