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
import { Users, Mail, Phone, MapPin, Building, Star } from "lucide-react";

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (vendor: any) => void;
}

export const AddVendorModal: React.FC<AddVendorModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    client: '',
    services: '',
    description: '',
    businessType: '',
    experience: ''
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
    
    if (!formData.name || !formData.email || !formData.client || !formData.services) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newVendor = {
        id: `v${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        location: formData.location || 'Not specified',
        client: formData.client,
        status: 'Pending',
        services: formData.services,

        totalJobs: 0,
        revenue: '$0',
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        description: formData.description,
        businessType: formData.businessType,
        experience: formData.experience
      };

      onAdd(newVendor);
      toast.success(`Vendor "${formData.name}" has been added successfully!`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        client: '',
        services: '',
        description: '',
        businessType: '',
        experience: ''
      });
      
      onClose();
    } catch (error) {
      toast.error("Failed to add vendor. Please try again.");
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
        services: '',
        description: '',
        businessType: '',
        experience: ''
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Add New Vendor
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Register a new service provider to the marketplace platform
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vendor Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Vendor Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter vendor business name"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            {/* Client Assignment */}
            <div className="space-y-2">
              <Label htmlFor="client" className="text-sm font-medium text-gray-700">
                Assign to Client *
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
                  placeholder="vendor@company.com"
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
                Service Location
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

            {/* Business Type */}
            <div className="space-y-2">
              <Label htmlFor="businessType" className="text-sm font-medium text-gray-700">
                Business Type
              </Label>
              <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual Contractor</SelectItem>
                  <SelectItem value="Small Business">Small Business</SelectItem>
                  <SelectItem value="Corporation">Corporation</SelectItem>
                  <SelectItem value="Partnership">Partnership</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-2">
            <Label htmlFor="services" className="text-sm font-medium text-gray-700">
              Services Offered *
            </Label>
            <Input
              id="services"
              value={formData.services}
              onChange={(e) => handleInputChange('services', e.target.value)}
              placeholder="e.g., Plumbing, Emergency Repairs, Installation"
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
              Years of Experience
            </Label>
            <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
              <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Select experience level" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">0-1 years</SelectItem>
                <SelectItem value="2-5">2-5 years</SelectItem>
                <SelectItem value="6-10">6-10 years</SelectItem>
                <SelectItem value="11-15">11-15 years</SelectItem>
                <SelectItem value="15+">15+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Business Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of the vendor's business and specialties..."
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
              {isSubmitting ? "Adding Vendor..." : "Add Vendor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
