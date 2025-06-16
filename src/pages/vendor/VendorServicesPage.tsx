import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, Image as ImageIcon, List, Grid3X3, Percent } from "lucide-react";
import { toast } from "sonner";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  discountPercentage?: number;
  hasDiscount: boolean;
  status: "Active" | "Draft";
  description: string;
  imageUrl?: string;
}

const VendorServicesPage = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: "s001",
      name: "Emergency Plumbing Repair",
      category: "Plumbing",
      price: "$120",
      originalPrice: "$150",
      discountPercentage: 20,
      hasDiscount: true,
      status: "Active",
      description: "24/7 emergency plumbing services for leaks, clogs, and burst pipes. Fast response guaranteed.",
      imageUrl: "https://media.istockphoto.com/id/183953925/photo/young-plumber-fixing-a-sink-in-bathroom.jpg?s=612x612&w=0&k=20&c=Ps2U_U4_Z60mIZsuem-BoaHLlCjsT8wYWiXNWR-TCDA="
    },
    {
      id: "s002",
      name: "Interior & Exterior Painting",
      category: "Painting",
      price: "$500",
      hasDiscount: false,
      status: "Active",
      description: "Transform your home with high-quality interior and exterior painting services. Experienced and reliable.",
      imageUrl: "https://t3.ftcdn.net/jpg/00/96/57/12/360_F_96571267_qfpHjHTvH8siby0Cey6rTpfiJczIxX3e.jpg"
    },
    {
      id: "s003",
      name: "Full Home Inspection",
      category: "Inspections",
      price: "$225",
      originalPrice: "$300",
      discountPercentage: 25,
      hasDiscount: true,
      status: "Draft",
      description: "Comprehensive home inspections for buyers and sellers. Detailed reports and expert advice.",
      imageUrl: "https://www.shutterstock.com/image-photo/mid-adult-woman-architect-wearing-600nw-2060102018.jpg"
    },
  ]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [newService, setNewService] = useState<Omit<Service, 'id' | 'status'>>({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    discountPercentage: 0,
    hasDiscount: false,
    description: "",
    imageUrl: "",
  });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServiceData, setEditServiceData] = useState<Omit<Service, 'id' | 'status'> | null>(null);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, isNewService: boolean) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isNewService) {
          setNewService({ ...newService, imageUrl: reader.result as string });
        } else if (editServiceData) {
          setEditServiceData({ ...editServiceData, imageUrl: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateDiscountedPrice = (originalPrice: string, discountPercentage: number): string => {
    const price = parseFloat(originalPrice.replace('$', ''));
    if (isNaN(price)) return originalPrice;
    const discountedPrice = price * (1 - discountPercentage / 100);
    return `$${Math.round(discountedPrice)}`;
  };

  const handleDiscountToggle = (hasDiscount: boolean) => {
    if (hasDiscount) {
      // When enabling discount, set original price to current price if not set
      const originalPrice = newService.originalPrice || newService.price;
      setNewService({
        ...newService,
        hasDiscount: true,
        originalPrice: originalPrice,
        discountPercentage: newService.discountPercentage || 10,
        price: calculateDiscountedPrice(originalPrice, newService.discountPercentage || 10)
      });
    } else {
      // When disabling discount, set price back to original price
      setNewService({
        ...newService,
        hasDiscount: false,
        price: newService.originalPrice || newService.price,
        originalPrice: "",
        discountPercentage: 0
      });
    }
  };

  const handleDiscountPercentageChange = (percentage: number) => {
    if (newService.hasDiscount && newService.originalPrice) {
      const discountedPrice = calculateDiscountedPrice(newService.originalPrice, percentage);
      setNewService({
        ...newService,
        discountPercentage: percentage,
        price: discountedPrice
      });
    }
  };

  const handleAddService = () => {
    if (newService.name && newService.category && newService.price) {
      const serviceToAdd: Service = {
        ...newService,
        id: `s${Date.now()}`,
        status: "Active",
      };
      setServices([...services, serviceToAdd]);
      setNewService({
        name: "",
        category: "",
        price: "",
        originalPrice: "",
        discountPercentage: 0,
        hasDiscount: false,
        description: "",
        imageUrl: ""
      });
      toast.success("Service added successfully!");
      setIsAddServiceModalOpen(false);
    } else {
      toast.error("Please fill in all required fields for the new service.");
    }
  };

  const handleEditService = (serviceId: string) => {
    const serviceToEdit = services.find(s => s.id === serviceId);
    if (serviceToEdit) {
      setEditingServiceId(serviceId);
      setEditServiceData({
        name: serviceToEdit.name,
        category: serviceToEdit.category,
        price: serviceToEdit.price,
        originalPrice: serviceToEdit.originalPrice,
        discountPercentage: serviceToEdit.discountPercentage,
        hasDiscount: serviceToEdit.hasDiscount,
        description: serviceToEdit.description,
        imageUrl: serviceToEdit.imageUrl,
      });
      setIsEditServiceModalOpen(true);
    }
  };

  const handleEditDiscountToggle = (hasDiscount: boolean) => {
    if (!editServiceData) return;

    if (hasDiscount) {
      // When enabling discount, set original price to current price if not set
      const originalPrice = editServiceData.originalPrice || editServiceData.price;
      setEditServiceData({
        ...editServiceData,
        hasDiscount: true,
        originalPrice: originalPrice,
        discountPercentage: editServiceData.discountPercentage || 10,
        price: calculateDiscountedPrice(originalPrice, editServiceData.discountPercentage || 10)
      });
    } else {
      // When disabling discount, set price back to original price
      setEditServiceData({
        ...editServiceData,
        hasDiscount: false,
        price: editServiceData.originalPrice || editServiceData.price,
        originalPrice: "",
        discountPercentage: 0
      });
    }
  };

  const handleEditDiscountPercentageChange = (percentage: number) => {
    if (editServiceData && editServiceData.hasDiscount && editServiceData.originalPrice) {
      const discountedPrice = calculateDiscountedPrice(editServiceData.originalPrice, percentage);
      setEditServiceData({
        ...editServiceData,
        discountPercentage: percentage,
        price: discountedPrice
      });
    }
  };

  const handleSaveEditedService = () => {
    if (editingServiceId && editServiceData && editServiceData.name && editServiceData.category && editServiceData.price) {
      setServices(services.map(s =>
        s.id === editingServiceId
          ? { ...s, ...editServiceData }
          : s
      ));
      toast.success("Service updated successfully!");
      setIsEditServiceModalOpen(false);
      setEditingServiceId(null);
      setEditServiceData(null);
    } else {
      toast.error("Please fill in all required fields for the edited service.");
    }
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(service => service.id !== serviceId));
    toast.error("Service deleted.");
  };

  const toggleServiceStatus = (serviceId: string) => {
    setServices(services.map(service =>
      service.id === serviceId
        ? { ...service, status: service.status === "Active" ? "Draft" : "Active" }
        : service
    ));
    toast.success("Service status updated!");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Listings</h1>
          <p className="text-gray-600 mt-1">
            Manage your service offerings and pricing. These will be visible to customers in the marketplace.
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
          <Dialog open={isAddServiceModalOpen} onOpenChange={setIsAddServiceModalOpen}>
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
                  <Label htmlFor="new-service-name">Service Name *</Label>
                  <Input
                    id="new-service-name"
                    type="text"
                    placeholder="e.g., Emergency Plumbing Repair"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-service-category">Category *</Label>
                  <Select
                    value={newService.category}
                    onValueChange={(value) => setNewService({ ...newService, category: value })}
                  >
                    <SelectTrigger id="new-service-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="inspections">Inspections</SelectItem>
                      <SelectItem value="landscaping">Landscaping</SelectItem>
                      <SelectItem value="moving">Moving</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-price-range">
                    {newService.hasDiscount ? "Original Price *" : "Fixed Price *"}
                  </Label>
                  <Input
                    id="new-price-range"
                    type="text"
                    placeholder="$150"
                    value={newService.hasDiscount ? newService.originalPrice : newService.price}
                    onChange={(e) => {
                      if (newService.hasDiscount) {
                        const originalPrice = e.target.value;
                        setNewService({
                          ...newService,
                          originalPrice,
                          price: calculateDiscountedPrice(originalPrice, newService.discountPercentage || 0)
                        });
                      } else {
                        setNewService({ ...newService, price: e.target.value });
                      }
                    }}
                  />
                </div>

                {/* Discount Toggle */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="discount-toggle"
                      checked={newService.hasDiscount}
                      onChange={(e) => handleDiscountToggle(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="discount-toggle" className="text-sm font-medium">
                      Offer discount on this service
                    </Label>
                  </div>

                  {newService.hasDiscount && (
                    <div className="space-y-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="space-y-2">
                        <Label htmlFor="discount-percentage">Discount Percentage *</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="discount-percentage"
                            type="number"
                            min="1"
                            max="90"
                            placeholder="10"
                            value={newService.discountPercentage || ""}
                            onChange={(e) => handleDiscountPercentageChange(parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-600">%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Final Price:</span>
                        <span className="font-bold text-green-600 text-lg">{newService.price}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">You save customers:</span>
                        <span className="font-medium text-red-600">
                          {newService.originalPrice && newService.price ?
                            `$${parseFloat(newService.originalPrice.replace('$', '')) - parseFloat(newService.price.replace('$', ''))}`
                            : '$0'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-service-description">Service Description</Label>
                  <Textarea
                    id="new-service-description"
                    placeholder="Describe your service offering..."
                    rows={3}
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-service-image">Service Image</Label>
                  <Input
                    id="new-service-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, true)}
                  />
                  {newService.imageUrl && (
                    <img src={newService.imageUrl} alt="Service Preview" className="mt-2 h-24 w-24 object-cover rounded-md" />
                  )}
                </div>
              </div>
              <Button onClick={handleAddService} className="w-full">
                Create Service
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Services Display */}
      {services.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden">
                  {service.imageUrl ? (
                    <img 
                      src={service.imageUrl} 
                      alt={service.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <Badge
                    className={`absolute top-2 right-2 ${
                      service.status === "Active"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-500 hover:bg-gray-600"
                    }`}
                  >
                    {service.status}
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{service.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{service.category}</p>
                    </div>
                    <div className="text-right">
                      {service.hasDiscount ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm text-gray-500 line-through">{service.originalPrice}</span>
                            <Badge className="bg-red-500 text-white text-xs">
                              -{service.discountPercentage}%
                            </Badge>
                          </div>
                          <p className="text-lg font-bold text-green-600">{service.price}</p>
                        </div>
                      ) : (
                        <p className="text-lg font-bold text-blue-600">{service.price}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{service.description}</p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleEditService(service.id)} 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      onClick={() => toggleServiceStatus(service.id)} 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                    >
                      {service.status === "Active" ? "Deactivate" : "Activate"}
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
                      {service.imageUrl ? (
                        <img
                          src={service.imageUrl}
                          alt={service.name}
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
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{service.name}</h3>
                          <p className="text-sm text-gray-600">{service.category}</p>
                        </div>

                        {/* Status Badge */}
                        <Badge
                          className={`ml-2 ${
                            service.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {service.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{service.description}</p>

                      {/* Price and Actions Row */}
                      <div className="flex items-center justify-between">
                        {/* Price Display */}
                        <div className="flex items-center gap-3">
                          {service.hasDiscount ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 line-through">{service.originalPrice}</span>
                              <Badge className="bg-red-500 text-white text-xs">
                                -{service.discountPercentage}%
                              </Badge>
                              <span className="text-lg font-bold text-green-600">{service.price}</span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-blue-600">{service.price}</span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditService(service.id)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => toggleServiceStatus(service.id)}
                            variant="outline"
                            size="sm"
                          >
                            {service.status === "Active" ? "Deactivate" : "Activate"}
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
            <Button onClick={() => setIsAddServiceModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Service
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Service Dialog */}
      <Dialog open={isEditServiceModalOpen} onOpenChange={setIsEditServiceModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update your service details and pricing.
            </DialogDescription>
          </DialogHeader>
          {editServiceData && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-service-name">Service Name *</Label>
                <Input
                  id="edit-service-name"
                  type="text"
                  value={editServiceData.name}
                  onChange={(e) => setEditServiceData({ ...editServiceData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-service-category">Category *</Label>
                <Select
                  value={editServiceData.category}
                  onValueChange={(value) => setEditServiceData({ ...editServiceData, category: value })}
                >
                  <SelectTrigger id="edit-service-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="inspections">Inspections</SelectItem>
                    <SelectItem value="landscaping">Landscaping</SelectItem>
                    <SelectItem value="moving">Moving</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="painting">Painting</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price-range">
                  {editServiceData.hasDiscount ? "Original Price *" : "Fixed Price *"}
                </Label>
                <Input
                  id="edit-price-range"
                  type="text"
                  value={editServiceData.hasDiscount ? editServiceData.originalPrice : editServiceData.price}
                  onChange={(e) => {
                    if (editServiceData.hasDiscount) {
                      const originalPrice = e.target.value;
                      setEditServiceData({
                        ...editServiceData,
                        originalPrice,
                        price: calculateDiscountedPrice(originalPrice, editServiceData.discountPercentage || 0)
                      });
                    } else {
                      setEditServiceData({ ...editServiceData, price: e.target.value });
                    }
                  }}
                />
              </div>

              {/* Edit Discount Toggle */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-discount-toggle"
                    checked={editServiceData.hasDiscount}
                    onChange={(e) => handleEditDiscountToggle(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="edit-discount-toggle" className="text-sm font-medium">
                    Offer discount on this service
                  </Label>
                </div>

                {editServiceData.hasDiscount && (
                  <div className="space-y-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="space-y-2">
                      <Label htmlFor="edit-discount-percentage">Discount Percentage *</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="edit-discount-percentage"
                          type="number"
                          min="1"
                          max="90"
                          placeholder="10"
                          value={editServiceData.discountPercentage || ""}
                          onChange={(e) => handleEditDiscountPercentageChange(parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                        <span className="text-sm text-gray-600">%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Final Price:</span>
                      <span className="font-bold text-green-600 text-lg">{editServiceData.price}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">You save customers:</span>
                      <span className="font-medium text-red-600">
                        {editServiceData.originalPrice && editServiceData.price ?
                          `$${parseFloat(editServiceData.originalPrice.replace('$', '')) - parseFloat(editServiceData.price.replace('$', ''))}`
                          : '$0'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-service-description">Service Description</Label>
                <Textarea
                  id="edit-service-description"
                  placeholder="Describe your service offering..."
                  rows={3}
                  value={editServiceData.description}
                  onChange={(e) => setEditServiceData({ ...editServiceData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-service-image">Service Image</Label>
                <Input
                  id="edit-service-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, false)}
                />
                {editServiceData.imageUrl && (
                  <img src={editServiceData.imageUrl} alt="Service Preview" className="mt-2 h-24 w-24 object-cover rounded-md" />
                )}
              </div>
            </div>
          )}
          <Button onClick={handleSaveEditedService} className="w-full">
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorServicesPage;
