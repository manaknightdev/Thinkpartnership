import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building, Mail, User, Phone, MapPin, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { showError, showSuccess } from '@/utils/toast';
import apiClient from '@/config/axios';

interface InvitationDetails {
  email: string;
  company_name?: string;
  contact_name?: string;
  phone?: string;
  business_type?: string;
  expires_at: string;
}

const registrationSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  contact_name: z.string().min(2, 'Contact name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  business_address: z.string().min(5, 'Business address is required'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  postal_code: z.string().min(3, 'Postal code is required'),
  business_type: z.string().min(1, 'Please select a business type'),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const ClientRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get('token');

  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link. Please check your email for the correct link.');
      setIsLoading(false);
      return;
    }

    fetchInvitationDetails();
  }, [token]);

  const fetchInvitationDetails = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/api/marketplace/client/invitation-details?token=${encodeURIComponent(token)}`);
      
      if (response.data.error) {
        setError(response.data.message || 'Invalid or expired invitation');
        return;
      }

      const invitationData = response.data.invitation;
      setInvitation(invitationData);

      // Pre-populate form with invitation data
      if (invitationData.company_name) setValue('company_name', invitationData.company_name);
      if (invitationData.contact_name) setValue('contact_name', invitationData.contact_name);
      if (invitationData.phone) setValue('phone', invitationData.phone);
      if (invitationData.business_type) setValue('business_type', invitationData.business_type);

    } catch (error: any) {
      console.error('Error fetching invitation details:', error);
      setError(error.response?.data?.message || 'Failed to load invitation details');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    try {
      const registrationData = {
        token,
        password: data.password,
        company_name: data.company_name,
        contact_name: data.contact_name,
        phone: data.phone,
        business_address: data.business_address,
        city: data.city,
        province: data.province,
        postal_code: data.postal_code,
        business_type: data.business_type,
      };

      const response = await apiClient.post('/api/marketplace/client/complete-registration', registrationData);
      
      if (response.data.error) {
        showError(response.data.message || 'Registration failed');
        return;
      }

      showSuccess('Registration completed successfully! Welcome to the marketplace.');
      
      // Store auth data if provided
      if (response.data.token && response.data.user) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        localStorage.setItem('client_id', response.data.client_id?.toString());
      }

      // Redirect to client portal
      navigate('/client-portal');

    } catch (error: any) {
      console.error('Error completing registration:', error);
      showError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
              <span className="text-gray-600">Loading invitation details...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Invitation</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => navigate('/')} variant="outline">
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Building className="h-12 w-12 text-purple-600 mx-auto" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Complete Your Registration</h1>
          <p className="mt-2 text-gray-600">
            You've been invited to join our marketplace platform
          </p>
        </div>

        {invitation && (
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-blue-600" />
                Invitation Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="text-gray-600">{invitation.email}</p>
                </div>
                {invitation.company_name && (
                  <div>
                    <span className="font-medium text-gray-700">Company:</span>
                    <p className="text-gray-600">{invitation.company_name}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Expires:</span>
                  <p className="text-gray-600">{new Date(invitation.expires_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Registration Information</CardTitle>
            <CardDescription>
              Please complete all fields to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password *</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Create a password" 
                      {...register('password')} 
                      className="pr-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password" className="text-sm font-medium text-gray-700">Confirm Password *</Label>
                  <div className="relative">
                    <Input 
                      id="confirm_password" 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      placeholder="Confirm password" 
                      {...register('confirm_password')} 
                      className="pr-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirm_password && <p className="text-sm text-red-600">{errors.confirm_password.message}</p>}
                </div>
              </div>

              {/* Company Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">Company Name *</Label>
                  <Input 
                    id="company_name" 
                    placeholder="Enter company name" 
                    {...register('company_name')} 
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500" 
                  />
                  {errors.company_name && <p className="text-sm text-red-600">{errors.company_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_name" className="text-sm font-medium text-gray-700">Contact Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      id="contact_name" 
                      placeholder="Enter contact person name" 
                      {...register('contact_name')} 
                      className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500" 
                    />
                  </div>
                  {errors.contact_name && <p className="text-sm text-red-600">{errors.contact_name.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      id="phone" 
                      placeholder="Enter phone number" 
                      {...register('phone')} 
                      className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500" 
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_type" className="text-sm font-medium text-gray-700">Business Type *</Label>
                  <Select onValueChange={(value) => setValue('business_type', value)} defaultValue={watch('business_type')}>
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

              {/* Address Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business_address" className="text-sm font-medium text-gray-700">Business Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      id="business_address" 
                      placeholder="Enter business address" 
                      {...register('business_address')} 
                      className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500" 
                    />
                  </div>
                  {errors.business_address && <p className="text-sm text-red-600">{errors.business_address.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">City *</Label>
                    <Input 
                      id="city" 
                      placeholder="Enter city" 
                      {...register('city')} 
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500" 
                    />
                    {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="province" className="text-sm font-medium text-gray-700">Province *</Label>
                    <Input 
                      id="province" 
                      placeholder="Enter province" 
                      {...register('province')} 
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500" 
                    />
                    {errors.province && <p className="text-sm text-red-600">{errors.province.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code" className="text-sm font-medium text-gray-700">Postal Code *</Label>
                    <Input 
                      id="postal_code" 
                      placeholder="Enter postal code" 
                      {...register('postal_code')} 
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500" 
                    />
                    {errors.postal_code && <p className="text-sm text-red-600">{errors.postal_code.message}</p>}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing Registration...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete Registration
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            By completing registration, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientRegistrationPage;