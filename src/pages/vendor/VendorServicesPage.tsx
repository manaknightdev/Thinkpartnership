import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, Image as ImageIcon, List, Grid3X3, Percent, Loader2 } from "lucide-react";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import VendorServicesAPI, { VendorService, CreateServiceData, UpdateServiceData } from "@/services/VendorServicesAPI";
import { showSuccess, showError } from "@/utils/toast";

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
  const [newService, setNewService] = useState<CreateServiceData>({
    title: "",
    description: "",
    short_description: "",
    category_id: 0,
    base_price: 0,
    pricing_tiers: [],
    features: [],
    tags: [],
    images: [],
    response_time: "",
    delivery_time: "",
    service_areas: [],
    requirements: "",
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

      const response = await VendorServicesAPI.createService(newService);

      if (response.error) {
        setError(response.message);
        showError(response.message);
        return;
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
        pricing_tiers: newService.pricing_tiers,
        features: newService.features,
        tags: newService.tags,
        images: newService.images,
        response_time: newService.response_time,
        delivery_time: newService.delivery_time,
        service_areas: newService.service_areas,
        requirements: newService.requirements,
      };

      const response = await VendorServicesAPI.updateService(editingService.id, updateData);

      if (response.error) {
        setError(response.message);
        showError(response.message);
        return;
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

  const handleToggleServiceStatus = async (serviceId: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const response = await VendorServicesAPI.toggleServiceStatus(serviceId, newStatus);

      if (response.error) {
        showError(response.message);
        return;
      }

      showSuccess(`Service ${newStatus === 1 ? 'activated' : 'deactivated'} successfully!`);
      await loadServices();
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to update service status");
    }
  };

  const resetNewService = () => {
    setNewService({
      title: "",
      description: "",
      short_description: "",
      category_id: 0,
      base_price: 0,
      pricing_tiers: [],
      features: [],
      tags: [],
      images: [],
      response_time: "",
      delivery_time: "",
      service_areas: [],
      requirements: "",
    });
  };

  const openEditDialog = (service: VendorService) => {
    setEditingService(service);
    setNewService({
      title: service.title,
      description: service.description,
      short_description: service.short_description || "",
      category_id: 0, // You might need to map this from service data
      base_price: service.base_price,
      pricing_tiers: service.pricing_tiers || [],
      features: service.features || [],
      tags: service.tags || [],
      images: service.images || [],
      response_time: service.response_time || "",
      delivery_time: service.delivery_time || "",
      service_areas: service.service_areas || [],
      requirements: service.requirements || "",
    });
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



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
          <p className="text-gray-600 mt-1">
            Manage your service offerings and pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>
                  Create a new service offering for your customers.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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
                  <Label htmlFor="new-base-price">Base Price *</Label>
                  <Input
                    id="new-base-price"
                    type="number"
                    placeholder="150"
                    value={newService.base_price}
                    onChange={(e) => setNewService({ ...newService, base_price: parseFloat(e.target.value) || 0 })}
                  />
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="response-time">Response Time</Label>
                    <Input
                      id="response-time"
                      placeholder="e.g., 24 hours"
                      value={newService.response_time}
                      onChange={(e) => setNewService({ ...newService, response_time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-time">Delivery Time</Label>
                    <Input
                      id="delivery-time"
                      placeholder="e.g., 3-5 days"
                      value={newService.delivery_time}
                      onChange={(e) => setNewService({ ...newService, delivery_time: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <Button
                onClick={handleCreateService}
                disabled={isCreating}
                className="w-full"
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
      {services.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden">
                  {service.images && service.images.length > 0 ? (
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <Badge
                    className={`absolute top-2 right-2 ${
                      service.status === 1
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-500 hover:bg-gray-600"
                    }`}
                  >
                    {service.status === 1 ? "Active" : "Inactive"}
                  </Badge>
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
                      onClick={() => handleToggleServiceStatus(service.id, service.status)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {service.status === 1 ? "Deactivate" : "Activate"}
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
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Service Image */}
                    <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden rounded-lg">
                      {service.images && service.images.length > 0 ? (
                        <img
                          src={service.images[0]}
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

                        {/* Status Badge */}
                        <Badge
                          className={`ml-2 ${
                            service.status === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {service.status === 1 ? "Active" : "Inactive"}
                        </Badge>
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
                            onClick={() => handleToggleServiceStatus(service.id, service.status)}
                            variant="outline"
                            size="sm"
                          >
                            {service.status === 1 ? "Deactivate" : "Activate"}
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
      ) : (
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
      )}

      {/* Edit Service Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update your service details and pricing.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
              <Label htmlFor="edit-base-price">Base Price *</Label>
              <Input
                id="edit-base-price"
                type="number"
                value={newService.base_price}
                onChange={(e) => setNewService({ ...newService, base_price: parseFloat(e.target.value) || 0 })}
              />
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
          </div>
          <Button
            onClick={handleUpdateService}
            disabled={isUpdating}
            className="w-full"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Service"
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorServicesPage;
