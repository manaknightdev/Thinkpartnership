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
import { toast } from "sonner";
import { Users, Mail, Phone, MapPin, Building, Loader2 } from "lucide-react";
import AdminAPI from '@/services/AdminAPI';
import { showError, showSuccess } from '@/utils/toast';

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
    client_id: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [availableClients, setAvailableClients] = useState<any[]>([]);

  // Load available clients when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableClients();
    }
  }, [isOpen]);

  const fetchAvailableClients = async () => {
    try {
      setIsLoadingClients(true);
      const response = await AdminAPI.getAvailableClients();
      if (response.error) {
        showError(response.message || 'Failed to fetch clients');
      } else {
        setAvailableClients(response.clients || []);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      showError('Failed to load clients');
    } finally {
      setIsLoadingClients(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.client_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const vendorData = {
        business_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        client_id: parseInt(formData.client_id),
        description: formData.description
      };

      const response = await AdminAPI.createVendor(vendorData);

      if (response.error) {
        showError(response.message || 'Failed to create vendor');
        return;
      }

      showSuccess(`Vendor "${formData.name}" has been added successfully!`);

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        client_id: '',
        description: ''
      });

      // Notify parent component to refresh data
      onAdd(response.vendor);
      onClose();
    } catch (error) {
      console.error('Error creating vendor:', error);
      showError("Failed to add vendor. Please try again.");
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
        client_id: '',
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
              <Label htmlFor="client_id" className="text-sm font-medium text-gray-700">
                Assign to Client *
              </Label>
              <Select value={formData.client_id} onValueChange={(value) => handleInputChange('client_id', value)}>
                <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    {isLoadingClients ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SelectValue placeholder="Select client" />
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {availableClients.map(client => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.company_name}
                    </SelectItem>
                  ))}
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
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Vendor...
                </>
              ) : (
                "Add Vendor"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
