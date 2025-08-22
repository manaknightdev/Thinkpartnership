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
    company_name: z.string().min(2, 'Company name must be at least 2 characters'),
    contact_name: z.string().min(2, 'Contact name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string(),
    business_address: z.string().min(5, 'Business address is required'),
    city: z.string().min(2, 'City is required'),
    province: z.string().min(2, 'Province is required'),
    postal_code: z.string().min(3, 'Postal code is required'),
    business_type: z.string().min(1, 'Please select a business type'),
  }).refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

  type SignupFormData = z.infer<typeof signupSchema>;

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      const registerData: ClientRegisterData = {
        email: data.email,
        password: data.password,
        company_name: data.company_name,
        contact_name: data.contact_name,
        phone: data.phone,
        business_address: data.business_address,
        city: data.city,
        province: data.province,
        postal_code: data.postal_code,
        business_type: data.business_type,
        is_refresh: true,
      };

      // Use admin client creation endpoint instead of regular client registration
      const response = await adminApiClient.post('/api/marketplace/admin/client/register', registerData);
      const result = response.data;
      if (result.error) {
        showError(result.message || 'Failed to create client');
        return;
      }

      showSuccess('Client account created successfully! The client will receive an invitation email to activate their account. They will remain in "Pending" status until they accept the invitation.');
      onAdd(result.user || { email: data.email, company_name: data.company_name });
      reset();
      onClose();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to create client');
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
            Add New Client
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Create a new client organization for the marketplace platform
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">Company Name *</Label>
              <Input id="company_name" placeholder="Enter company name" {...register('company_name')} className="border-gray-200 focus:border-purple-500 focus:ring-purple-500" />
              {errors.company_name && <p className="text-sm text-red-600">{errors.company_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_name" className="text-sm font-medium text-gray-700">Contact Name *</Label>
              <Input id="contact_name" placeholder="Enter contact person name" {...register('contact_name')} className="border-gray-200 focus:border-purple-500 focus:ring-purple-500" />
              {errors.contact_name && <p className="text-sm text-red-600">{errors.contact_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Business Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" placeholder="Enter business email" {...register('email')} className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500" />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="phone" placeholder="Enter phone number" {...register('phone')} className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500" />
              </div>
              {errors.phone && <p className="text-sm text-red-600">{errors.phone.message as string}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_type" className="text-sm font-medium text-gray-700">Business Type *</Label>
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

          <div className="space-y-2">
            <Label htmlFor="business_address" className="text-sm font-medium text-gray-700">Street Address *</Label>
            <Input id="business_address" placeholder="Enter business address" {...register('business_address')} className="border-gray-200 focus:border-purple-500 focus:ring-purple-500" />
            {errors.business_address && <p className="text-sm text-red-600">{errors.business_address.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">City *</Label>
              <Input id="city" placeholder="Enter city" {...register('city')} className="border-gray-200 focus:border-purple-500 focus:ring-purple-500" />
              {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="province" className="text-sm font-medium text-gray-700">Province *</Label>
              <Input id="province" placeholder="Enter province" {...register('province')} className="border-gray-200 focus:border-purple-500 focus:ring-purple-500" />
              {errors.province && <p className="text-sm text-red-600">{errors.province.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code" className="text-sm font-medium text-gray-700">Postal Code *</Label>
              <Input id="postal_code" placeholder="Enter postal code" {...register('postal_code')} className="border-gray-200 focus:border-purple-500 focus:ring-purple-500" />
              {errors.postal_code && <p className="text-sm text-red-600">{errors.postal_code.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password *</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" {...register('password')} className="pr-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password" className="text-sm font-medium text-gray-700">Confirm Password *</Label>
              <div className="relative">
                <Input id="confirm_password" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm password" {...register('confirm_password')} className="pr-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirm_password && <p className="text-sm text-red-600">{errors.confirm_password.message}</p>}
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">{isSubmitting ? 'Creating...' : 'Create Client'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
