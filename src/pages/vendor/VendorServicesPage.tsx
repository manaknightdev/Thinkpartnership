import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, Image as ImageIcon, List, Grid3X3, Loader2, Upload, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import VendorServicesAPI, { VendorService, CreateServiceData, UpdateServiceData } from "@/services/VendorServicesAPI";
import VendorSubscriptionAPI from "@/services/VendorSubscriptionAPI";
import { showSuccess, showError } from "@/utils/toast";
import { toast } from "sonner";
import API_CONFIG from "@/config/api";
import { TaxSettings } from "@/components/TaxSettings";
import { TaxAPI, TaxCalculation } from "@/services/TaxAPI";

const VendorServicesPage = () => {
  const [services, setServices] = useState<VendorService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingService, setEditingService] = useState<VendorService | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tax-related state
  const [taxInclusive, setTaxInclusive] = useState(false);
  const [customTaxRate, setCustomTaxRate] = useState<number | null>(null);
  const [currentTaxCalculation, setCurrentTaxCalculation] = useState<TaxCalculation | null>(null);

  // Utility function to get full image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath; // Already a full URL
    return `${API_CONFIG.BASE_URL}${imagePath}`; // Convert relative path to full URL
  };
  const [newService, setNewService] = useState<CreateServiceData>({
    title: "",
    description: "",
    short_description: "",
    category_id: 0,
    base_price: 0,
    referral_percentage: 0,
    pricing_tiers: [],
    features: [],
    tags: [],
    images: [],
    response_time: "",
    service_areas: [],
    requirements: "",
    tax_inclusive: false,
    custom_tax_rate: undefined,
  });

  // Load services and categories on component mount
  useEffect(() => {
    loadServices();
    loadCategories();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await VendorServicesAPI.getServices();

      if (response.error) {
        setError(response.message || "Failed to load services");
        return;
      }

      setServices(response.services);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load services");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await VendorServicesAPI.getCategories();
      if (!response.error) {
        setCategories(response.categories);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const handleCreateService = async () => {
    try {
      setIsCreating(true);
      setError("");

      // Check subscription limit first
      const limitCheck = await VendorSubscriptionAPI.checkServiceLimit();
      if (limitCheck.error || !limitCheck.data?.can_add) {
        const errorMessage = limitCheck.message || "You've reached your service limit. Please upgrade your subscription plan.";
        setError(errorMessage);
        toast.error(errorMessage, { 
          duration: 8000,
          description: "Please visit the Subscription Plans page to upgrade your plan.",
          position: "top-center"
        });
        setShowCreateDialog(false); // Close the modal
        return;
      }

      // Validate required fields including image
      if (!newService.title || !newService.description || !newService.category_id || !newService.base_price) {
        setError("Please fill in all required fields");
        showError("Please fill in all required fields");
        return;
      }

      if (!selectedImage) {
        setError("Please upload a service image");
        showError("Please upload a service image");
        return;
      }

      // Update newService with current tax settings before creating
      const serviceWithTax = {
        ...newService,
        tax_inclusive: taxInclusive,
        custom_tax_rate: customTaxRate,
      };

      const response = await VendorServicesAPI.createService(serviceWithTax);

      if (response.error) {
        setError(response.message);
        showError(response.message);
        return;
      }

      // Upload image if one is selected
      if (selectedImage && response.service) {
        setIsUploadingImage(true);
        try {
          const imageResponse = await VendorServicesAPI.uploadServiceImage(selectedImage);

          if (imageResponse.error) {
            showError("Service created but failed to upload image: " + imageResponse.message);
          } else if (imageResponse.url) {
            // Update the service with the uploaded image URL
            const updateData = { images: [imageResponse.url] };
            await VendorServicesAPI.updateService(response.service.id, updateData);
          }
        } catch (imageErr: any) {
          showError("Service created but failed to upload image");
        } finally {
          setIsUploadingImage(false);
        }
      }

      showSuccess("Service created successfully!");
      setShowCreateDialog(false);
      resetNewService();
      await loadServices();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create service";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateService = async () => {
    if (!editingService) return;

    try {
      setIsUpdating(true);
      setError("");

      const updateData: UpdateServiceData = {
        title: newService.title,
        description: newService.description,
        short_description: newService.short_description,
        category_id: newService.category_id,
        base_price: newService.base_price,
        referral_percentage: newService.referral_percentage,
        pricing_tiers: newService.pricing_tiers,
        features: newService.features,
        tags: newService.tags,
        images: newService.images,
        response_time: newService.response_time,
        service_areas: newService.service_areas,
        requirements: newService.requirements,
        tax_inclusive: taxInclusive,
        custom_tax_rate: customTaxRate,
      };

      const response = await VendorServicesAPI.updateService(editingService.id, updateData);

      if (response.error) {
        setError(response.message);
        showError(response.message);
        return;
      }

      // Upload new image if one is selected
      if (selectedImage) {
        setIsUploadingImage(true);
        try {
          const imageResponse = await VendorServicesAPI.uploadServiceImage(selectedImage);

          if (imageResponse.error) {
            showError("Service updated but failed to upload new image: " + imageResponse.message);
          } else if (imageResponse.url) {
            // Update the service with the new image URL
            const newImages = [...(newService.images || []), imageResponse.url];
            const finalUpdateData = { ...updateData, images: newImages };
            await VendorServicesAPI.updateService(editingService.id, finalUpdateData);
          }
        } catch (imageErr: any) {
          showError("Service updated but failed to upload new image");
        } finally {
          setIsUploadingImage(false);
        }
      }

      showSuccess("Service updated successfully!");
      setShowEditDialog(false);
      setEditingService(null);
      resetNewService();
      await loadServices();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update service";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const response = await VendorServicesAPI.deleteService(serviceId);

      if (response.error) {
        showError(response.message);
        return;
      }

      showSuccess("Service deleted successfully!");
      await loadServices();
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to delete service");
    }
  };

  // Image handling functions
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const file = files[0]; // Take only the first file
    setSelectedImage(file);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeExistingImage = () => {
    setNewService({ ...newService, images: [] });
  };

  const resetNewService = () => {
    setNewService({
      title: "",
      description: "",
      short_description: "",
      category_id: 0,
      base_price: 0,
      referral_percentage: 0,
      pricing_tiers: [],
      features: [],
      tags: [],
      images: [],
      response_time: "",
      service_areas: [],
      requirements: "",
      tax_inclusive: false,
      custom_tax_rate: undefined,
    });

    // Clean up image states
    setSelectedImage(null);
    setImagePreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Reset tax states
    setTaxInclusive(false);
    setCustomTaxRate(null);
    setCurrentTaxCalculation(null);
  };

  const openEditDialog = (service: VendorService) => {
    setEditingService(service);
    setNewService({
      title: service.title,
      description: service.description,
      short_description: service.short_description || "",
      category_id: 0, // You might need to map this from service data
      base_price: service.base_price,
      referral_percentage: service.referral_percentage || 0,
      pricing_tiers: service.pricing_tiers || [],
      features: service.features || [],
      tags: service.tags || [],
      images: service.images || [],
      response_time: service.response_time || "",
      service_areas: service.service_areas || [],
      requirements: service.requirements || "",
      tax_inclusive: (service as any).tax_inclusive || false,
      custom_tax_rate: (service as any).custom_tax_rate || undefined,
    });

    // Reset image upload states for editing
    setSelectedImage(null);
    setImagePreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Set tax states for editing
    setTaxInclusive((service as any).tax_inclusive || false);
    setCustomTaxRate((service as any).custom_tax_rate || null);

    setShowEditDialog(true);
  };

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }



  // Filter services based on service type
  const filteredServices = services.filter(service => {
    if (serviceTypeFilter === 'all') return true;
    if (serviceTypeFilter === 'flat_fee') return !service.service_type || service.service_type === 'flat_fee';
    if (serviceTypeFilter === 'custom') return service.service_type === 'custom';
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Flat Fee Services</h1>
          <p className="text-gray-600 mt-1">
            Manage your flat fee service offerings and pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Service Type Filter */}
          <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Service Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="flat_fee">Flat Fee</SelectItem>
              <SelectItem value="custom">Custom Pricing</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Add Service Button */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>
                  Create a new service offering for your customers.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 overflow-y-auto flex-1 pr-2">
                <div className="space-y-2">
                  <Label htmlFor="new-service-title">Service Title *</Label>
                  <Input
                    id="new-service-title"
                    type="text"
                    placeholder="e.g., Emergency Plumbing Repair"
                    value={newService.title}
                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-service-category">Category *</Label>
                  <Select
                    value={newService.category_id.toString()}
                    onValueChange={(value) => setNewService({ ...newService, category_id: parseInt(value) })}
                  >
                    <SelectTrigger id="new-service-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-base-price">Price *</Label>
                  <Input
                    id="new-base-price"
                    type="number"
                    placeholder="150"
                    value={newService.base_price}
                    onChange={(e) => setNewService({ ...newService, base_price: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-referral-percentage">Referral Percentage (%)</Label>
                  <Input
                    id="new-referral-percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="0"
                    value={newService.referral_percentage || ""}
                    onChange={(e) => setNewService({ ...newService, referral_percentage: parseFloat(e.target.value) || 0 })}
                  />
                  <p className="text-sm text-gray-500">
                    Percentage of gross revenue you want to share for referrals. Platform takes 10% of this amount, remaining is split 50/50 between client and referring vendor.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-service-description">Service Description *</Label>
                  <Textarea
                    id="new-service-description"
                    placeholder="Describe your service offering in detail..."
                    rows={4}
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-service-short-description">Short Description</Label>
                  <Input
                    id="new-service-short-description"
                    placeholder="Brief summary of your service"
                    value={newService.short_description}
                    onChange={(e) => setNewService({ ...newService, short_description: e.target.value })}
                  />
                </div>

                {/* Image Upload Section */}
                <div className="space-y-2">
                  <Label>Service Image *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="mb-2"
                      >
                        Choose Image
                      </Button>
                      <p className="text-sm text-gray-500">
                        Upload one image (JPG, PNG, GIF)
                      </p>
                      <p className="text-xs text-gray-400">
                        Recommended size: 800x600 pixels or larger
                      </p>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {imagePreviewUrl && (
                    <div className="relative w-32 h-32 mx-auto">
                      <img
                        src={imagePreviewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Tax Settings */}
                <TaxSettings
                  taxInclusive={taxInclusive}
                  setTaxInclusive={setTaxInclusive}
                  customTaxRate={customTaxRate}
                  setCustomTaxRate={setCustomTaxRate}
                  basePrice={newService.base_price}
                  onTaxChange={setCurrentTaxCalculation}
                  className="mt-4"
                />

              </div>

              {/* Fixed button at bottom */}
              <div className="border-t pt-4 mt-4">
                <Button
                  onClick={handleCreateService}
                  disabled={isCreating || isUploadingImage}
                  className="w-full"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : isUploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading Image...
                    </>
                  ) : (
                    "Create Service"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Services Display */}
      {filteredServices.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden">
                  {service.images && service.images.length > 0 ? (
                    <img
                      src={getImageUrl(service.images[0])}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{service.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{service.short_description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">${service.base_price}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{service.description}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openEditDialog(service)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteService(service.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-3">
            {filteredServices.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Service Image */}
                    <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden rounded-lg">
                      {service.images && service.images.length > 0 ? (
                        <img
                          src={getImageUrl(service.images[0])}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Service Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{service.title}</h3>
                          <p className="text-sm text-gray-600">{service.short_description}</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{service.description}</p>

                      {/* Price and Actions Row */}
                      <div className="flex items-center justify-between">
                        {/* Price Display */}
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-blue-600">${service.base_price}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => openEditDialog(service)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteService(service.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : services.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No services yet</h3>
            <p className="text-gray-600 mb-4">Create your first service to start attracting customers.</p>
            <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No services match your filter</h3>
            <p className="text-gray-600 mb-4">Try selecting a different service type or clear the filter.</p>
            <Button variant="outline" onClick={() => setServiceTypeFilter('all')}>
              Clear Filter
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Service Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update your service details and pricing.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 overflow-y-auto flex-1 pr-2">
            <div className="space-y-2">
              <Label htmlFor="edit-service-title">Service Title *</Label>
              <Input
                id="edit-service-title"
                type="text"
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-service-category">Category *</Label>
              <Select
                value={newService.category_id.toString()}
                onValueChange={(value) => setNewService({ ...newService, category_id: parseInt(value) })}
              >
                <SelectTrigger id="edit-service-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-base-price">Price *</Label>
              <Input
                id="edit-base-price"
                type="number"
                value={newService.base_price}
                onChange={(e) => setNewService({ ...newService, base_price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-referral-percentage">Referral Percentage (%)</Label>
              <Input
                id="edit-referral-percentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={newService.referral_percentage || ""}
                onChange={(e) => setNewService({ ...newService, referral_percentage: parseFloat(e.target.value) || 0 })}
              />
              <p className="text-sm text-gray-500">
                Percentage of gross revenue you want to share for referrals. Platform takes 10% of this amount, remaining is split 50/50 between client and referring vendor.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-service-description">Service Description *</Label>
              <Textarea
                id="edit-service-description"
                placeholder="Describe your service offering in detail..."
                rows={4}
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              />
            </div>

            {/* Current Image */}
            {newService.images && newService.images.length > 0 && (
              <div className="space-y-2">
                <Label>Current Image</Label>
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={getImageUrl(newService.images[0])}
                    alt="Current service image"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removeExistingImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Replace Image */}
            <div className="space-y-2">
              <Label>Replace Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-2"
                  >
                    Choose New Image
                  </Button>
                  <p className="text-sm text-gray-500">
                    Upload one image (JPG, PNG, GIF)
                  </p>
                  <p className="text-xs text-gray-400">
                    Recommended size: 800x600 pixels or larger
                  </p>
                </div>
              </div>

              {/* New Image Preview */}
              {imagePreviewUrl && (
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={imagePreviewUrl}
                    alt="New image preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Tax Settings */}
            <TaxSettings
              taxInclusive={taxInclusive}
              setTaxInclusive={setTaxInclusive}
              customTaxRate={customTaxRate}
              setCustomTaxRate={setCustomTaxRate}
              basePrice={newService.base_price}
              onTaxChange={setCurrentTaxCalculation}
              className="mt-4"
            />
          </div>

          {/* Fixed button at bottom */}
          <div className="border-t pt-4 mt-4">
            <Button
              onClick={handleUpdateService}
              disabled={isUpdating || isUploadingImage}
              className="w-full"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : isUploadingImage ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading Image...
                </>
              ) : (
                "Update Service"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorServicesPage;
