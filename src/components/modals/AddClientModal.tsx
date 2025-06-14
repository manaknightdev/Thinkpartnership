import React, { useState } from 'react';
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
import { Building, Mail, Phone, Globe, CreditCard } from "lucide-react";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (client: any) => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    plan: '',
    contactPerson: '',
    address: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.plan) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newClient = {
        id: `c${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        website: formData.website || 'Not provided',
        status: 'Active',
        plan: formData.plan,
        vendors: 0,
        customers: 0,
        totalRevenue: '$0',
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        contactPerson: formData.contactPerson,
        address: formData.address,
        description: formData.description
      };

      onAdd(newClient);
      toast.success(`Client "${formData.name}" has been added successfully!`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        website: '',
        plan: '',
        contactPerson: '',
        address: '',
        description: ''
      });
      
      onClose();
    } catch (error) {
      toast.error("Failed to add client. Please try again.");
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
        website: '',
        plan: '',
        contactPerson: '',
        address: '',
        description: ''
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Building className="h-5 w-5 text-purple-600" />
            Add New Client
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Create a new client organization for the marketplace platform
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Client Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter client organization name"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            {/* Contact Person */}
            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="text-sm font-medium text-gray-700">
                Contact Person
              </Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                placeholder="Primary contact name"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
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
                  placeholder="contact@company.com"
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

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                Website
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="www.company.com"
                  className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Plan */}
            <div className="space-y-2">
              <Label htmlFor="plan" className="text-sm font-medium text-gray-700">
                Subscription Plan *
              </Label>
              <Select value={formData.plan} onValueChange={(value) => handleInputChange('plan', value)}>
                <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Select a plan" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trial">Trial (30 days)</SelectItem>
                  <SelectItem value="Basic">Basic ($99/month)</SelectItem>
                  <SelectItem value="Professional">Professional ($299/month)</SelectItem>
                  <SelectItem value="Enterprise">Enterprise ($999/month)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Business Address
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="123 Business St, City, State, ZIP"
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of the client's business..."
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
              {isSubmitting ? "Adding Client..." : "Add Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
