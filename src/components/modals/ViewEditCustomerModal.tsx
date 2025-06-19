import React, { useState, useEffect, useMemo } from 'react';
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Users, 
  Edit, 
  Eye, 
  DollarSign,
  Calendar,
  ShoppingBag,
  Star
} from "lucide-react";

interface ViewEditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
  mode: 'view' | 'edit';
  onUpdate?: (customer: any) => void;
}

// Mock data for vendors by client
const mockVendorsByClient = {
  "TechCorp Solutions": ["Rapid Plumbers", "Certified Inspectors Inc.", "Climate Control Experts"],
  "HomeServices Pro": ["Brush Strokes Pro", "Green Thumb Landscaping"],
  "Local Connect": ["Green Thumb Landscaping", "Quick Fix Handyman"],
  "ServiceHub Inc": ["Sparky Electric", "Climate Control Experts"],
  "QuickFix Network": ["Climate Control Experts", "Move It Right"]
};

export const ViewEditCustomerModal: React.FC<ViewEditCustomerModalProps> = ({ 
  isOpen, 
  onClose, 
  customer, 
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
    vendor: '',
    status: '',
    preferredServices: ''
  });

  // Get available vendors based on selected client
  const availableVendors = useMemo(() => {
    if (!formData.client) return [];
    return mockVendorsByClient[formData.client as keyof typeof mockVendorsByClient] || [];
  }, [formData.client]);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        location: customer.location || '',
        client: customer.client || '',
        vendor: customer.vendor || '',
        status: customer.status || '',
        preferredServices: customer.preferredServices || ''
      });
    }
  }, [customer]);

  // Reset vendor when client changes
  React.useEffect(() => {
    if (formData.client && !availableVendors.includes(formData.vendor)) {
      setFormData(prev => ({ ...prev, vendor: '' }));
    }
  }, [formData.client, availableVendors, formData.vendor]);

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

      const updatedCustomer = {
        ...customer,
        ...formData
      };

      if (onUpdate) {
        onUpdate(updatedCustomer);
      }
      
      toast.success(`Customer "${formData.name}" has been updated successfully!`);
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update customer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Inactive":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "Suspended":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            {isEditing ? <Edit className="h-5 w-5 text-purple-600" /> : <Eye className="h-5 w-5 text-purple-600" />}
            {isEditing ? 'Edit Customer' : 'Customer Details'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isEditing ? 'Update customer information and settings' : 'View detailed customer information and activity'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Customer Details</TabsTrigger>
            <TabsTrigger value="stats">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Customer Name *
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
                    <p className="text-gray-900 font-medium">{customer.name}</p>
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
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
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
                      <span className="text-gray-900">{customer.email}</span>
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
                      <span className="text-gray-900">{customer.phone}</span>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Location
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
                      <span className="text-gray-900">{customer.location}</span>
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
                      <span className="text-gray-900">{customer.client}</span>
                    </div>
                  )}
                </div>

                {/* Vendor */}
                <div className="space-y-2">
                  <Label htmlFor="vendor" className="text-sm font-medium text-gray-700">
                    Assigned Vendor
                  </Label>
                  {isEditing ? (
                    <Select 
                      value={formData.vendor} 
                      onValueChange={(value) => handleInputChange('vendor', value)}
                      disabled={!formData.client}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {availableVendors.map(vendor => (
                          <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{customer.vendor}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Preferred Services */}
              <div className="space-y-2">
                <Label htmlFor="preferredServices" className="text-sm font-medium text-gray-700">
                  Preferred Services
                </Label>
                {isEditing ? (
                  <Input
                    id="preferredServices"
                    value={formData.preferredServices}
                    onChange={(e) => handleInputChange('preferredServices', e.target.value)}
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900">{customer.preferredServices}</p>
                )}
              </div>

              {!isEditing && (
                <DialogFooter className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button type="button" onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Customer
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
                    {isSubmitting ? "Updating..." : "Update Customer"}
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
                    <ShoppingBag className="h-4 w-4 text-blue-600" />
                    Total Orders
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-2xl font-bold text-gray-900">{customer.totalOrders}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Total Spent
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-2xl font-bold text-gray-900">{customer.totalSpent}</p>
                </CardContent>
              </Card>



              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    Last Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm font-medium text-gray-900">{customer.lastOrder}</p>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button type="button" onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Customer
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
