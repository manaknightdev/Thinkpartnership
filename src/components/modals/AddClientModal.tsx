import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Building, Mail, Phone, Eye, EyeOff } from "lucide-react";
import ClientAPI, { ClientRegisterData } from "@/services/ClientAPI";
import adminApiClient from '@/config/adminAxios';
import { showError, showSuccess } from "@/utils/toast";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (client: any) => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signupSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    company_name: z.string().optional(),
    contact_name: z.string().optional(),
    phone: z.string().optional(),
    business_type: z.string().optional(),
  });

  type SignupFormData = z.infer<typeof signupSchema>;

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      const invitationData = {
        email: data.email,
        company_name: data.company_name || null,
        contact_name: data.contact_name || null,
        phone: data.phone || null,
        business_type: data.business_type || null,
      };

      // Use admin client invitation endpoint
      const response = await adminApiClient.post('/api/marketplace/admin/client/invite', invitationData);
      const result = response.data;
      if (result.error) {
        showError(result.message || 'Failed to send invitation');
        return;
      }

      showSuccess('Client invitation sent successfully! The client will receive an email to complete their registration.');
      onAdd({ email: data.email, company_name: data.company_name || '(Invitation)' });
      reset();
      onClose();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Building className="h-5 w-5 text-purple-600" />
            Invite New Client
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Send an invitation for a client to complete their registration
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Business Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input id="email" type="email" placeholder="Enter business email" {...register('email')} className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500" />
            </div>
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">Company Name (Optional)</Label>
              <Input id="company_name" placeholder="Enter company name" {...register('company_name')} className="border-gray-200 focus:border-purple-500 focus:ring-purple-500" />
              {errors.company_name && <p className="text-sm text-red-600">{errors.company_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_name" className="text-sm font-medium text-gray-700">Contact Name (Optional)</Label>
              <Input id="contact_name" placeholder="Enter contact person name" {...register('contact_name')} className="border-gray-200 focus:border-purple-500 focus:ring-purple-500" />
              {errors.contact_name && <p className="text-sm text-red-600">{errors.contact_name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="phone" placeholder="Enter phone number" {...register('phone')} className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500" />
              </div>
              {errors.phone && <p className="text-sm text-red-600">{errors.phone.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_type" className="text-sm font-medium text-gray-700">Business Type (Optional)</Label>
              <Select onValueChange={(value) => setValue('business_type', value)}>
                <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corporation">Corporation</SelectItem>
                  <SelectItem value="llc">LLC</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                  <SelectItem value="nonprofit">Non-Profit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.business_type && <p className="text-sm text-red-600">{errors.business_type.message}</p>}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Client Registration Process</h4>
                <p className="text-sm text-blue-700 mt-1">
                  The client will receive an email invitation to complete their registration with their own password, address, and additional details.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">{isSubmitting ? 'Sending Invitation...' : 'Send Invitation'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
