import React, { useState, useMemo, useEffect } from 'react';
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
import { UserCheck, Mail, Phone, MapPin, Building, Users, Loader2 } from "lucide-react";
import AdminAPI from '@/services/AdminAPI';
import { showError, showSuccess } from '@/utils/toast';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (customer: any) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '',
    client_id: '',
    vendor_id: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [availableClients, setAvailableClients] = useState<any[]>([]);
  const [availableVendors, setAvailableVendors] = useState<any[]>([]);

  // Load available clients when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableClients();
    }
  }, [isOpen]);

  // Load vendors when client changes
  useEffect(() => {
    if (formData.client_id) {
      fetchAvailableVendors(parseInt(formData.client_id));
    } else {
      setAvailableVendors([]);
      setFormData(prev => ({ ...prev, vendor_id: '' }));
    }
  }, [formData.client_id]);

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

  const fetchAvailableVendors = async (clientId: number) => {
    try {
      setIsLoadingVendors(true);
      const response = await AdminAPI.getAvailableVendors(clientId);
      if (response.error) {
        showError(response.message || 'Failed to fetch vendors');
      } else {
        setAvailableVendors(response.vendors || []);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      showError('Failed to load vendors');
    } finally {
      setIsLoadingVendors(false);
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

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.client_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const customerData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        client_id: parseInt(formData.client_id),
        vendor_id: formData.vendor_id && formData.vendor_id !== 'none' ? parseInt(formData.vendor_id) : undefined
      };

      const response = await AdminAPI.createCustomer(customerData);

      if (response.error) {
        showError(response.message || 'Failed to create customer');
        return;
      }

      showSuccess(`Customer "${formData.first_name} ${formData.last_name}" has been added successfully!`);

      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        location: '',
        client_id: '',
        vendor_id: '',
        notes: ''
      });

      // Notify parent component to refresh data
      onAdd(response.customer);
      onClose();
    } catch (error) {
      console.error('Error creating customer:', error);
      showError("Failed to add customer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        location: '',
        client_id: '',
        vendor_id: '',
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
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                First Name *
              </Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                placeholder="Enter first name"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                Last Name *
              </Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                placeholder="Enter last name"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2 md:col-span-2">
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
              <Label htmlFor="client_id" className="text-sm font-medium text-gray-700">
                Client Marketplace *
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

            {/* Vendor Assignment */}
            <div className="space-y-2">
              <Label htmlFor="vendor_id" className="text-sm font-medium text-gray-700">
                Assign to Vendor (Optional)
              </Label>
              <Select
                value={formData.vendor_id}
                onValueChange={(value) => handleInputChange('vendor_id', value)}
                disabled={!formData.client_id}
              >
                <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    {isLoadingVendors ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SelectValue placeholder={formData.client_id ? "Select vendor (optional)" : "Select client first"} />
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No vendor assignment</SelectItem>
                  {availableVendors.map(vendor => (
                    <SelectItem key={vendor.id} value={vendor.id.toString()}>
                      {vendor.name || vendor.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!formData.client_id && (
                <p className="text-xs text-gray-500">Please select a client first to see available vendors</p>
              )}
            </div>
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
              className="bg-purple-600 hover:bg-purple-700 text-white"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Customer...
                </>
              ) : (
                "Add Customer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
