import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Crown,
  Upload,
  X,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import VendorServiceTiersAPI from "@/services/VendorServiceTiersAPI";
import API_CONFIG from "@/config/api";
import vendorApiClient from "@/config/vendorAxios";

interface ServiceTier {
  id: number;
  tier_name: string;
  price: number;
  base_price: number;
  referral_percentage?: number;
  unit_type: string;
  min_quantity: number;
  max_quantity?: number;
  description: string;
  tier_description?: string;
  features: string[];
  is_popular?: boolean;
  images: string[];
  revisions_included?: number;
  sort_order?: number;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

const VendorServiceTiersPage = () => {
  const [serviceTiers, setServiceTiers] = useState<ServiceTier[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<ServiceTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [newTier, setNewTier] = useState<ServiceTier>({
    id: 0,
    tier_name: "",
    price: 0,
    base_price: 0,
    referral_percentage: 0,
    unit_type: "service",
    min_quantity: 1,
    max_quantity: undefined,
    description: "",
    features: [""],
    images: [],
    revisions_included: 0,
    is_popular: false
  });

  // Utility function to get full image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_CONFIG.BASE_URL}${imagePath}`;
  };

  // Placeholder image for services without images
  const getPlaceholderImage = () => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1VjEyNUgxMjVWNzVaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIxNDAiIGN5PSI5MCIgcj0iNSIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTMwIDExMEwxNDAgMTAwTDE2MCA5MFYxMjBIMTMwVjExMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
  };

  // Load service tiers from API
  const loadServiceTiers = async () => {
    try {
      setLoading(true);
      const response = await VendorServiceTiersAPI.getServiceTiers();
      
      if (!response.error && (response as any).service_tiers) {
        setServiceTiers((response as any).service_tiers);
      } else {
        toast.error(response.message || 'Failed to load service tiers');
      }
    } catch (error) {
      console.error('Error loading service tiers:', error);
      toast.error('Failed to load service tiers');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadServiceTiers();
  }, []);

  // Handle image upload
  const handleImageUpload = async (file: File, isEditing = false) => {
    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await vendorApiClient.post(
        API_CONFIG.ENDPOINTS.VENDOR_SERVICES.UPLOAD_IMAGE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const result = response.data;

      if (!result.error && result.url) {
        const imageUrl = result.url;
        
        if (isEditing && editingTier) {
          setEditingTier({
            ...editingTier,
            images: [...(editingTier.images || []), imageUrl]
          });
        } else {
          setNewTier({
            ...newTier,
            images: [...(newTier.images || []), imageUrl]
          });
        }
        
        toast.success('Image uploaded successfully');
      } else {
        toast.error(result.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddTier = async () => {
    if (!newTier.tier_name || !newTier.description || (newTier.base_price || newTier.price) <= 0) {
      toast.error("Please fill in service name, description, and base price");
      return;
    }

    if (!newTier.unit_type) {
      toast.error("Please specify the unit type (e.g., room, hour, service)");
      return;
    }

    if (!newTier.images || newTier.images.length === 0) {
      toast.error("Please upload at least one image for your service");
      return;
    }

    try {
      setIsCreating(true);
      
      const tierData = {
        service_id: 0, // Custom service tier (not tied to specific service)
        tier_name: newTier.tier_name,
        tier_description: newTier.description,
        description: newTier.description,
        price: newTier.base_price || newTier.price,
        base_price: newTier.base_price || newTier.price,
        referral_percentage: newTier.referral_percentage || 0,
        unit_type: newTier.unit_type,
        min_quantity: newTier.min_quantity,
        max_quantity: newTier.max_quantity,
        features: newTier.features.filter(f => f.trim() !== ""),
        revisions_included: newTier.revisions_included || 0,
        is_popular: newTier.is_popular || false,
        images: newTier.images || []
      };

      const response = await VendorServiceTiersAPI.createServiceTier(tierData);
      
      if (!response.error) {
        toast.success("Custom service created successfully!");
        setIsAddModalOpen(false);
        setNewTier({
          id: 0,
          tier_name: "",
          price: 0,
          base_price: 0,
          referral_percentage: 0,
          unit_type: "service",
          min_quantity: 1,
          max_quantity: undefined,
          description: "",
          features: [""],
          images: [],
          revisions_included: 0,
          is_popular: false
        });
        loadServiceTiers(); // Reload the list
      } else {
        toast.error(response.message || 'Failed to create service tier');
      }
    } catch (error) {
      console.error('Error creating service tier:', error);
      toast.error('Failed to create service tier');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditTier = (tier: ServiceTier) => {
    setEditingTier({
      ...tier,
      features: Array.isArray(tier.features) ? tier.features : 
                typeof tier.features === 'string' ? JSON.parse(tier.features) : [""],
      images: Array.isArray(tier.images) ? tier.images :
              typeof tier.images === 'string' ? JSON.parse(tier.images) : []
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateTier = async () => {
    if (!editingTier) return;

    try {
      setIsUpdating(true);
      
      const updateData = {
        service_id: 0,
        tier_name: editingTier.tier_name,
        tier_description: editingTier.description,
        description: editingTier.description,
        price: editingTier.base_price || editingTier.price,
        base_price: editingTier.base_price || editingTier.price,
        unit_type: editingTier.unit_type,
        min_quantity: editingTier.min_quantity,
        max_quantity: editingTier.max_quantity,
        features: editingTier.features.filter(f => f.trim() !== ""),
        revisions_included: editingTier.revisions_included || 0,
        is_popular: editingTier.is_popular || false,
        images: editingTier.images || []
      };

      const response = await VendorServiceTiersAPI.updateServiceTier(editingTier.id, updateData);
      
      if (!response.error) {
        toast.success("Custom service updated successfully!");
        setIsEditModalOpen(false);
        setEditingTier(null);
        loadServiceTiers(); // Reload the list
      } else {
        toast.error(response.message || 'Failed to update service tier');
      }
    } catch (error) {
      console.error('Error updating service tier:', error);
      toast.error('Failed to update service tier');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTier = async (tierId: number) => {
    if (!confirm('Are you sure you want to delete this service tier?')) {
      return;
    }

    try {
      const response = await VendorServiceTiersAPI.deleteServiceTier(tierId);
      
      if (!response.error) {
        toast.success("Custom service deleted successfully!");
        loadServiceTiers(); // Reload the list
      } else {
        toast.error(response.message || 'Failed to delete service tier');
      }
    } catch (error) {
      console.error('Error deleting service tier:', error);
      toast.error('Failed to delete service tier');
    }
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
      const updatedFeatures = editingTier.features.filter((_, i) => i !== index);
      setEditingTier({
        ...editingTier,
        features: updatedFeatures.length > 0 ? updatedFeatures : [""]
      });
    } else {
      const updatedFeatures = newTier.features.filter((_, i) => i !== index);
      setNewTier({
        ...newTier,
        features: updatedFeatures.length > 0 ? updatedFeatures : [""]
      });
    }
  };

  const removeImage = (index: number, isEditing = false) => {
    if (isEditing && editingTier) {
      const updatedImages = editingTier.images?.filter((_, i) => i !== index) || [];
      setEditingTier({
        ...editingTier,
        images: updatedImages
      });
    } else {
      const updatedImages = newTier.images?.filter((_, i) => i !== index) || [];
      setNewTier({
        ...newTier,
        images: updatedImages
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



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Custom Services</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your custom services with quantity-based pricing. Perfect for services like painting rooms, hourly work, or any service where price varies by quantity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          
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

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading service tiers...</span>
        </div>
      ) : (
        <div>
          {/* Service Tiers Grid */}
          {serviceTiers.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Custom Services Yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first custom service with quantity-based pricing. Perfect for services like painting rooms ($10/room), hourly work ($50/hour), or any service where price varies by quantity.
                </p>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Service
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceTiers.map((tier, index) => {
                // Ensure all fields are properly defined to avoid accidental rendering
                const tierData = {
                  id: tier.id,
                  tier_name: tier.tier_name || '',
                  description: tier.description || tier.tier_description || '',
                  base_price: tier.base_price || tier.price || 0,
                  unit_type: tier.unit_type || 'service',
                  min_quantity: tier.min_quantity || 1,
                  max_quantity: tier.max_quantity,
                  features: Array.isArray(tier.features) ? tier.features :
                           typeof tier.features === 'string' ? JSON.parse(tier.features || '[]') : [],
                  images: Array.isArray(tier.images) ? tier.images :
                         typeof tier.images === 'string' ? JSON.parse(tier.images || '[]') : [],
                  is_popular: tier.is_popular || false
                };

                return (
                  <Card
                    key={`service-tier-${tierData.id}`}
                    className="relative border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
                  >
                    {tierData.is_popular && (
                      <div className="absolute -top-2 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Popular
                      </div>
                    )}
                    <CardContent className="p-4">
                      {/* Header with image and actions */}
                      <div className="flex items-start gap-3 mb-3">
                        {/* Service Image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {tierData.images && tierData.images.length > 0 ? (
                            <img
                              src={getImageUrl(tierData.images[0])}
                              alt={tierData.tier_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = getPlaceholderImage();
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {getTierIcon(index)}
                            </div>
                          )}
                        </div>

                      {/* Service Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{tierData.tier_name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{tierData.description}</p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditTier(tier)} className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteTier(tierData.id)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Price and Unit Info */}
                    <div className="mb-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">${tierData.base_price}</span>
                        <span className="text-gray-600">/{tierData.unit_type}</span>
                      </div>
                      {tierData.min_quantity && tierData.min_quantity > 1 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Min: {tierData.min_quantity} {tierData.unit_type}(s)
                          {tierData.max_quantity && ` • Max: ${tierData.max_quantity}`}
                        </p>
                      )}
                    </div>

                    {/* Features (condensed) */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {tierData.features.slice(0, 3).map((feature: string, featureIndex: number) => (
                          <span key={featureIndex} className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                            <Check className="h-3 w-3" />
                            {feature}
                          </span>
                        ))}
                        {tierData.features.length > 3 && (
                          <span className="text-xs text-gray-500 px-2 py-1">
                            +{tierData.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Active
                      </span>

                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add Tier Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Custom Service</DialogTitle>
            <DialogDescription>
              Create a custom service with quantity-based pricing. Perfect for services like painting rooms, hourly work, or any service where price varies by quantity.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 overflow-y-auto flex-1 pr-2">
            <div>
              <Label htmlFor="tier-name">Service Name</Label>
              <Input
                id="tier-name"
                placeholder="e.g., Room Painting, Electrical Installation"
                value={newTier.tier_name}
                onChange={(e) => setNewTier({...newTier, tier_name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tier-price">Price ($)</Label>
                <Input
                  id="tier-price"
                  type="number"
                  placeholder="0"
                  value={newTier.base_price || ""}
                  onChange={(e) => setNewTier({...newTier, base_price: parseFloat(e.target.value) || 0, price: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="unit-type">Unit Type</Label>
                <Input
                  id="unit-type"
                  placeholder="e.g., room, hour, service"
                  value={newTier.unit_type}
                  onChange={(e) => setNewTier({...newTier, unit_type: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="referral-percentage">Referral Percentage (%)</Label>
              <Input
                id="referral-percentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="0"
                value={newTier.referral_percentage || ""}
                onChange={(e) => setNewTier({...newTier, referral_percentage: parseFloat(e.target.value) || 0})}
              />
              <p className="text-sm text-gray-500 mt-1">
                Percentage of gross revenue you want to share for referrals. Platform takes 10% of this amount, remaining is split 50/50 between client and referring vendor.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-quantity">Min Quantity</Label>
                <Input
                  id="min-quantity"
                  type="number"
                  placeholder="1"
                  value={newTier.min_quantity || ""}
                  onChange={(e) => setNewTier({...newTier, min_quantity: parseInt(e.target.value) || 1})}
                />
              </div>
              <div>
                <Label htmlFor="max-quantity">Max Quantity (Optional)</Label>
                <Input
                  id="max-quantity"
                  type="number"
                  placeholder="No limit"
                  value={newTier.max_quantity || ""}
                  onChange={(e) => setNewTier({...newTier, max_quantity: e.target.value ? parseInt(e.target.value) : undefined})}
                />
              </div>
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

            {/* Image Upload Section */}
            <div>
              <Label>Service Images</Label>
              <p className="text-sm text-gray-500 mb-2">Recommended size: 800x600px or larger for best quality</p>
              <div className="space-y-2">
                {newTier.images && newTier.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {newTier.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={getImageUrl(image)}
                          alt={`Service ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file, false);
                      }
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={isUploadingImage}
                  >
                    {isUploadingImage ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fixed button at bottom */}
          <div className="border-t pt-4 mt-4">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddTier}
                disabled={isCreating || isUploadingImage}
                className="flex-1"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Service"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Tier Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Custom Service</DialogTitle>
            <DialogDescription>
              Update your custom service details and pricing.
            </DialogDescription>
          </DialogHeader>

          {editingTier && (
            <div className="grid gap-4 py-4 overflow-y-auto flex-1 pr-2">
              <div>
                <Label htmlFor="edit-tier-name">Service Name</Label>
                <Input
                  id="edit-tier-name"
                  value={editingTier.tier_name}
                  onChange={(e) => setEditingTier({...editingTier, tier_name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-tier-price">Price ($)</Label>
                  <Input
                    id="edit-tier-price"
                    type="number"
                    value={editingTier.base_price || editingTier.price}
                    onChange={(e) => setEditingTier({...editingTier, base_price: parseFloat(e.target.value) || 0, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-unit-type">Unit Type</Label>
                  <Input
                    id="edit-unit-type"
                    value={editingTier.unit_type || 'service'}
                    onChange={(e) => setEditingTier({...editingTier, unit_type: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-referral-percentage">Referral Percentage (%)</Label>
                <Input
                  id="edit-referral-percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={editingTier.referral_percentage || ""}
                  onChange={(e) => setEditingTier({...editingTier, referral_percentage: parseFloat(e.target.value) || 0})}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Percentage of gross revenue you want to share for referrals. Platform takes 10% of this amount, remaining is split 50/50 between client and referring vendor.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-min-quantity">Min Quantity</Label>
                  <Input
                    id="edit-min-quantity"
                    type="number"
                    value={editingTier.min_quantity || 1}
                    onChange={(e) => setEditingTier({...editingTier, min_quantity: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-max-quantity">Max Quantity (Optional)</Label>
                  <Input
                    id="edit-max-quantity"
                    type="number"
                    value={editingTier.max_quantity || ""}
                    onChange={(e) => setEditingTier({...editingTier, max_quantity: e.target.value ? parseInt(e.target.value) : undefined})}
                  />
                </div>
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
                        placeholder="Feature description"
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

              {/* Image Upload Section for Edit */}
              <div>
                <Label>Service Images</Label>
                <p className="text-sm text-gray-500 mb-2">Recommended size: 800x600px or larger for best quality</p>
                <div className="space-y-2">
                  {editingTier.images && editingTier.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {editingTier.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={getImageUrl(image)}
                            alt={`Service ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.src = getPlaceholderImage();
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeImage(index, true)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, true);
                        }
                      }}
                      className="hidden"
                      id="edit-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('edit-image-upload')?.click()}
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Fixed button at bottom */}
          <div className="border-t pt-4 mt-4">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateTier}
                disabled={isUpdating || isUploadingImage}
                className="flex-1"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Tier"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorServiceTiersPage;
