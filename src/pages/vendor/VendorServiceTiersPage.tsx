import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  description: string;
  tier_description?: string;
  features: string[];
  is_popular?: boolean;
  images?: string[];
  delivery_time?: string;
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
    description: "",
    features: [""],
    images: [],
    delivery_time: "",
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
    if (!newTier.tier_name || !newTier.description || newTier.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsCreating(true);
      
      const tierData = {
        service_id: 0, // Custom service tier (not tied to specific service)
        tier_name: newTier.tier_name,
        tier_description: newTier.description,
        price: newTier.price,
        features: newTier.features.filter(f => f.trim() !== ""),
        delivery_time: newTier.delivery_time || '',
        revisions_included: newTier.revisions_included || 0,
        is_popular: newTier.is_popular || false,
        images: newTier.images || []
      };

      const response = await VendorServiceTiersAPI.createServiceTier(tierData);
      
      if (!response.error) {
        toast.success("Service tier created successfully!");
        setIsAddModalOpen(false);
        setNewTier({
          id: 0,
          tier_name: "",
          price: 0,
          description: "",
          features: [""],
          images: [],
          delivery_time: "",
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
        price: editingTier.price,
        features: editingTier.features.filter(f => f.trim() !== ""),
        delivery_time: editingTier.delivery_time || '',
        revisions_included: editingTier.revisions_included || 0,
        is_popular: editingTier.is_popular || false,
        images: editingTier.images || []
      };

      const response = await VendorServiceTiersAPI.updateServiceTier(editingTier.id, updateData);
      
      if (!response.error) {
        toast.success("Service tier updated successfully!");
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
        toast.success("Service tier deleted successfully!");
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first service to start offering custom pricing to your customers.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceTiers.map((tier, index) => (
                <Card
                  key={tier.id}
                  className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${getTierColor(index)} h-fit`}
                >
                  {tier.is_popular && (
                    <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                  )}

                  <CardHeader className={tier.is_popular ? "pt-12" : ""}>
                    {/* Service Image */}
                    <div className="relative mb-4">
                      {tier.images && tier.images.length > 0 ? (
                        <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={getImageUrl(tier.images[0])}
                            alt={tier.tier_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = getPlaceholderImage();
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center">
                          <div className="text-center">
                            {getTierIcon(index)}
                            <p className="text-sm text-gray-500 mt-2">No image</p>
                          </div>
                        </div>
                      )}

                      {/* Action buttons overlay */}
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => handleEditTier(tier)} className="bg-white/90 hover:bg-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleDeleteTier(tier.id)} className="bg-white/90 hover:bg-white text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <CardTitle className="text-xl text-center">{tier.tier_name}</CardTitle>
                    <CardDescription className="text-base text-center">
                      {tier.description || tier.tier_description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-4">
                    {/* Price */}
                    <div className="text-center">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold text-gray-900">${tier.price}</span>
                        <span className="text-gray-600">/service</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">What's included:</h4>
                      <ul className="space-y-1">
                        {(Array.isArray(tier.features) ? tier.features :
                          typeof tier.features === 'string' ? JSON.parse(tier.features) : []
                        ).slice(0, 4).map((feature: string, featureIndex: number) => (
                          <li key={featureIndex} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                        {(Array.isArray(tier.features) ? tier.features :
                          typeof tier.features === 'string' ? JSON.parse(tier.features) : []
                        ).length > 4 && (
                          <li className="text-sm text-gray-500 ml-6">
                            +{(Array.isArray(tier.features) ? tier.features :
                              typeof tier.features === 'string' ? JSON.parse(tier.features) : []
                            ).length - 4} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full"
                      variant={tier.is_popular ? "default" : "outline"}
                    >
                      {tier.is_popular ? "Most Popular" : "Available for Orders"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
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
              Create a new service tier with custom pricing and features.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 overflow-y-auto flex-1 pr-2">
            <div>
              <Label htmlFor="tier-name">Tier Name</Label>
              <Input
                id="tier-name"
                placeholder="e.g., Basic Plumbing, Premium Electrical"
                value={newTier.tier_name}
                onChange={(e) => setNewTier({...newTier, tier_name: e.target.value})}
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

            {/* Image Upload Section */}
            <div>
              <Label>Service Images</Label>
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
            <DialogTitle>Edit Service Tier</DialogTitle>
            <DialogDescription>
              Update your service tier details.
            </DialogDescription>
          </DialogHeader>

          {editingTier && (
            <div className="grid gap-4 py-4 overflow-y-auto flex-1 pr-2">
              <div>
                <Label htmlFor="edit-tier-name">Tier Name</Label>
                <Input
                  id="edit-tier-name"
                  value={editingTier.tier_name}
                  onChange={(e) => setEditingTier({...editingTier, tier_name: e.target.value})}
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
