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
  Package,
  Zap,
  Plus,
  Edit,
  Trash2,
  Crown
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

const VendorServiceTiersPage = () => {
  const [serviceTiers, setServiceTiers] = useState<ServiceTier[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<ServiceTier | null>(null);
  const [newTier, setNewTier] = useState<ServiceTier>({
    id: "",
    name: "",
    price: 0,
    description: "",
    features: [""]
  });

  const handleAddTier = () => {
    if (!newTier.name || !newTier.description || newTier.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    const tierWithId = {
      ...newTier,
      id: `tier-${Date.now()}`,
      features: newTier.features.filter(f => f.trim() !== "")
    };

    setServiceTiers(prev => [...prev, tierWithId]);
    setNewTier({ id: "", name: "", price: 0, description: "", features: [""] });
    setIsAddModalOpen(false);
    toast.success("Service tier added successfully!");
  };

  const handleEditTier = (tier: ServiceTier) => {
    setEditingTier(tier);
    setIsEditModalOpen(true);
  };

  const handleUpdateTier = () => {
    if (!editingTier) return;

    setServiceTiers(prev =>
      prev.map(tier =>
        tier.id === editingTier.id
          ? { ...editingTier, features: editingTier.features.filter(f => f.trim() !== "") }
          : tier
      )
    );
    setEditingTier(null);
    setIsEditModalOpen(false);
    toast.success("Service tier updated successfully!");
  };

  const handleDeleteTier = (tierId: string) => {
    setServiceTiers(prev => prev.filter(tier => tier.id !== tierId));
    toast.success("Service tier deleted successfully!");
  };

  const addFeature = (isEditing = false) => {
    if (isEditing && editingTier) {
      setEditingTier({
        ...editingTier,
        features: [...editingTier.features, ""]
      });
    } else {
      setNewTier({
        ...newTier,
        features: [...newTier.features, ""]
      });
    }
  };

  const updateFeature = (index: number, value: string, isEditing = false) => {
    if (isEditing && editingTier) {
      const updatedFeatures = [...editingTier.features];
      updatedFeatures[index] = value;
      setEditingTier({
        ...editingTier,
        features: updatedFeatures
      });
    } else {
      const updatedFeatures = [...newTier.features];
      updatedFeatures[index] = value;
      setNewTier({
        ...newTier,
        features: updatedFeatures
      });
    }
  };

  const removeFeature = (index: number, isEditing = false) => {
    if (isEditing && editingTier) {
      setEditingTier({
        ...editingTier,
        features: editingTier.features.filter((_, i) => i !== index)
      });
    } else {
      setNewTier({
        ...newTier,
        features: newTier.features.filter((_, i) => i !== index)
      });
    }
  };

  const getTierIcon = (index: number) => {
    const icons = [
      <Package className="h-6 w-6 text-blue-600" />,
      <Star className="h-6 w-6 text-purple-600" />,
      <Crown className="h-6 w-6 text-yellow-600" />
    ];
    return icons[index % icons.length];
  };

  const getTierColor = (index: number) => {
    const colors = [
      "border-blue-200 bg-blue-50",
      "border-purple-200 bg-purple-50",
      "border-yellow-200 bg-yellow-50"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Custom Service</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your custom service. These services will be available when creating new orders for customers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Service
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Service Tiers */}
      {serviceTiers.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first service to start offering custom pricing to your customers.
            </p>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Service
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {serviceTiers.map((tier, index) => (
            <Card
              key={tier.id}
              className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${getTierColor(index)}`}
            >
              {tier.isPopular && (
                <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}

              <CardHeader className={tier.isPopular ? "pt-12" : ""}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center mb-4 mx-auto">
                    {getTierIcon(index)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditTier(tier)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTier(tier.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl text-center">{tier.name}</CardTitle>
                <CardDescription className="text-base text-center">
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
                  <h4 className="font-semibold text-gray-900 text-center">What's included:</h4>
                  <ul className="space-y-2">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
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
                  {tier.isPopular ? "Most Popular" : "Available for Orders"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}


      {/* Add Tier Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Custom Service</DialogTitle>
            <DialogDescription>
              Create a new service tier with custom pricing and features.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="tier-name">Tier Name</Label>
              <Input
                id="tier-name"
                placeholder="e.g., Basic Plumbing, Premium Electrical"
                value={newTier.name}
                onChange={(e) => setNewTier({...newTier, name: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="tier-price">Starting at ($)</Label>
              <Input
                id="tier-price"
                type="number"
                placeholder="0"
                value={newTier.price || ""}
                onChange={(e) => setNewTier({...newTier, price: parseInt(e.target.value) || 0})}
              />
            </div>

            <div>
              <Label htmlFor="tier-description">Description</Label>
              <Textarea
                id="tier-description"
                placeholder="Brief description of this service tier"
                value={newTier.description}
                onChange={(e) => setNewTier({...newTier, description: e.target.value})}
              />
            </div>

            <div>
              <Label>Features</Label>
              <div className="space-y-2">
                {newTier.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Feature description"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                    />
                    {newTier.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addFeature()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTier}>
                Add Service
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Tier Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Service Tier</DialogTitle>
            <DialogDescription>
              Update your service tier details.
            </DialogDescription>
          </DialogHeader>

          {editingTier && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-tier-name">Tier Name</Label>
                <Input
                  id="edit-tier-name"
                  value={editingTier.name}
                  onChange={(e) => setEditingTier({...editingTier, name: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="edit-tier-price">Price ($)</Label>
                <Input
                  id="edit-tier-price"
                  type="number"
                  value={editingTier.price}
                  onChange={(e) => setEditingTier({...editingTier, price: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <Label htmlFor="edit-tier-description">Description</Label>
                <Textarea
                  id="edit-tier-description"
                  value={editingTier.description}
                  onChange={(e) => setEditingTier({...editingTier, description: e.target.value})}
                />
              </div>

              <div>
                <Label>Features</Label>
                <div className="space-y-2">
                  {editingTier.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value, true)}
                      />
                      {editingTier.features.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFeature(index, true)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addFeature(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateTier}>
                  Update Tier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorServiceTiersPage;