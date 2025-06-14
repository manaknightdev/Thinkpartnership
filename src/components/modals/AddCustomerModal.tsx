import React, { useState, useMemo } from 'react';
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
import { toast } from "sonner";
import { UserCheck, Mail, Phone, MapPin, Building, Users } from "lucide-react";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (customer: any) => void;
}

// Mock data for vendors by client (same as in AdminAllCustomersPage)
const mockVendorsByClient = {
  "TechCorp Solutions": ["Rapid Plumbers", "Certified Inspectors Inc.", "Climate Control Experts"],
  "HomeServices Pro": ["Brush Strokes Pro", "Green Thumb Landscaping"],
  "Local Connect": ["Green Thumb Landscaping", "Quick Fix Handyman"],
  "ServiceHub Inc": ["Sparky Electric", "Climate Control Experts"],
  "QuickFix Network": ["Climate Control Experts", "Move It Right"]
};

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    client: '',
    vendor: '',
    preferredServices: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get available vendors based on selected client
  const availableVendors = useMemo(() => {
    if (!formData.client) return [];
    return mockVendorsByClient[formData.client as keyof typeof mockVendorsByClient] || [];
  }, [formData.client]);

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
    
    if (!formData.name || !formData.email || !formData.client || !formData.vendor) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newCustomer = {
        id: `cu${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        location: formData.location || 'Not specified',
        client: formData.client,
        vendor: formData.vendor,
        status: 'Active',
        totalOrders: 0,
        totalSpent: '$0',
        avgRating: 0,
        joinDate: new Date().toISOString().split('T')[0],
        lastOrder: 'Never',
        preferredServices: formData.preferredServices || 'Not specified',
        notes: formData.notes
      };

      onAdd(newCustomer);
      toast.success(`Customer "${formData.name}" has been added successfully!`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        client: '',
        vendor: '',
        preferredServices: '',
        notes: ''
      });
      
      onClose();
    } catch (error) {
      toast.error("Failed to add customer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        client: '',
        vendor: '',
        preferredServices: '',
        notes: ''
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-purple-600" />
            Add New Customer
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Register a new customer to the marketplace platform
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Customer Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter customer full name"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="customer@email.com"
                  className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, State"
                  className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Client Assignment */}
            <div className="space-y-2">
              <Label htmlFor="client" className="text-sm font-medium text-gray-700">
                Client Marketplace *
              </Label>
              <Select value={formData.client} onValueChange={(value) => handleInputChange('client', value)}>
                <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Select client" />
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
            </div>

            {/* Vendor Assignment */}
            <div className="space-y-2">
              <Label htmlFor="vendor" className="text-sm font-medium text-gray-700">
                Assign to Vendor *
              </Label>
              <Select 
                value={formData.vendor} 
                onValueChange={(value) => handleInputChange('vendor', value)}
                disabled={!formData.client}
              >
                <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <SelectValue placeholder={formData.client ? "Select vendor" : "Select client first"} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {availableVendors.map(vendor => (
                    <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!formData.client && (
                <p className="text-xs text-gray-500">Please select a client first to see available vendors</p>
              )}
            </div>
          </div>

          {/* Preferred Services */}
          <div className="space-y-2">
            <Label htmlFor="preferredServices" className="text-sm font-medium text-gray-700">
              Preferred Services
            </Label>
            <Input
              id="preferredServices"
              value={formData.preferredServices}
              onChange={(e) => handleInputChange('preferredServices', e.target.value)}
              placeholder="e.g., Plumbing, HVAC, Electrical"
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional information about the customer..."
              rows={3}
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Adding Customer..." : "Add Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
