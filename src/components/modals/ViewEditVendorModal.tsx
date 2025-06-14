import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Star, 
  Edit, 
  Eye, 
  DollarSign,
  Calendar,
  ShoppingBag
} from "lucide-react";

interface ViewEditVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: any;
  mode: 'view' | 'edit';
  onUpdate?: (vendor: any) => void;
}

export const ViewEditVendorModal: React.FC<ViewEditVendorModalProps> = ({ 
  isOpen, 
  onClose, 
  vendor, 
  mode, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    client: '',
    status: '',
    services: '',
    description: ''
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        location: vendor.location || '',
        client: vendor.client || '',
        status: vendor.status || '',
        services: vendor.services || '',
        description: vendor.description || ''
      });
    }
  }, [vendor]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.client) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedVendor = {
        ...vendor,
        ...formData
      };

      if (onUpdate) {
        onUpdate(updatedVendor);
      }
      
      toast.success(`Vendor "${formData.name}" has been updated successfully!`);
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update vendor. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Pending":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "Suspended":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  if (!vendor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            {isEditing ? <Edit className="h-5 w-5 text-purple-600" /> : <Eye className="h-5 w-5 text-purple-600" />}
            {isEditing ? 'Edit Vendor' : 'Vendor Details'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isEditing ? 'Update vendor information and settings' : 'View detailed vendor information and performance'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Vendor Details</TabsTrigger>
            <TabsTrigger value="stats">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vendor Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Vendor Name *
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{vendor.name}</p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  {isEditing ? (
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusColor(vendor.status)}>{vendor.status}</Badge>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{vendor.email}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{vendor.phone}</span>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Service Location
                  </Label>
                  {isEditing ? (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{vendor.location}</span>
                    </div>
                  )}
                </div>

                {/* Client */}
                <div className="space-y-2">
                  <Label htmlFor="client" className="text-sm font-medium text-gray-700">
                    Client Marketplace
                  </Label>
                  {isEditing ? (
                    <Select value={formData.client} onValueChange={(value) => handleInputChange('client', value)}>
                      <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TechCorp Solutions">TechCorp Solutions</SelectItem>
                        <SelectItem value="HomeServices Pro">HomeServices Pro</SelectItem>
                        <SelectItem value="Local Connect">Local Connect</SelectItem>
                        <SelectItem value="ServiceHub Inc">ServiceHub Inc</SelectItem>
                        <SelectItem value="QuickFix Network">QuickFix Network</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{vendor.client}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Services */}
              <div className="space-y-2">
                <Label htmlFor="services" className="text-sm font-medium text-gray-700">
                  Services Offered
                </Label>
                {isEditing ? (
                  <Input
                    id="services"
                    value={formData.services}
                    onChange={(e) => handleInputChange('services', e.target.value)}
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900">{vendor.services}</p>
                )}
              </div>

              {!isEditing && (
                <DialogFooter className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button type="button" onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Vendor
                  </Button>
                </DialogFooter>
              )}

              {isEditing && (
                <DialogFooter className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isSubmitting ? "Updating..." : "Update Vendor"}
                  </Button>
                </DialogFooter>
              )}
            </form>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    Rating
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-2xl font-bold text-gray-900">{vendor.rating}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-blue-600" />
                    Total Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-2xl font-bold text-gray-900">{vendor.totalJobs}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-2xl font-bold text-gray-900">{vendor.revenue}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    Join Date
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm font-medium text-gray-900">{vendor.joinDate}</p>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button type="button" onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Vendor
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
