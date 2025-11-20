import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Building2, ArrowLeft } from 'lucide-react';

import ClientAPI, { ClientRegisterData } from '@/services/ClientAPI';
import { showSuccess, showError } from '@/utils/toast';

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
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  newsletter: z.boolean().optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const ClientSignup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      terms: false,
      newsletter: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError('');

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

      const response = await ClientAPI.register(registerData);

      if (response.error) {
        setError(response.message);
        return;
      }

      // Store auth data
      ClientAPI.storeAuthData(response);

      showSuccess('Welcome to Real PartnersOS! Your client account has been created successfully.');

      // Redirect to client portal
      navigate('/client-portal');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        {/* <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div> */}

        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Create Client Account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Join our marketplace platform and start managing your business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      placeholder="Enter company name"
                      {...register('company_name')}
                      className="h-11"
                    />
                    {errors.company_name && (
                      <p className="text-sm text-red-600">{errors.company_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_name">Contact Name *</Label>
                    <Input
                      id="contact_name"
                      placeholder="Enter contact person name"
                      {...register('contact_name')}
                      className="h-11"
                    />
                    {errors.contact_name && (
                      <p className="text-sm text-red-600">{errors.contact_name.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter business email"
                      {...register('email')}
                      className="h-11"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      {...register('phone')}
                      className="h-11"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_type">Business Type *</Label>
                  <Select onValueChange={(value) => setValue('business_type', value)}>
                    <SelectTrigger className="h-11">
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
                  {errors.business_type && (
                    <p className="text-sm text-red-600">{errors.business_type.message}</p>
                  )}
                </div>
              </div>

              {/* Business Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Business Address</h3>

                <div className="space-y-2">
                  <Label htmlFor="business_address">Street Address *</Label>
                  <Input
                    id="business_address"
                    placeholder="Enter business address"
                    {...register('business_address')}
                    className="h-11"
                  />
                  {errors.business_address && (
                    <p className="text-sm text-red-600">{errors.business_address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      {...register('city')}
                      className="h-11"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="province">Province *</Label>
                    <Input
                      id="province"
                      placeholder="Enter province"
                      {...register('province')}
                      className="h-11"
                    />
                    {errors.province && (
                      <p className="text-sm text-red-600">{errors.province.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code *</Label>
                    <Input
                      id="postal_code"
                      placeholder="Enter postal code"
                      {...register('postal_code')}
                      className="h-11"
                    />
                    {errors.postal_code && (
                      <p className="text-sm text-red-600">{errors.postal_code.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        {...register('password')}
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        {...register('confirm_password')}
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="text-sm text-red-600">{errors.confirm_password.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Controller
                    name="terms"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    )}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-600">{errors.terms.message}</p>
                )}

                <div className="flex items-center space-x-2">
                  <Controller
                    name="newsletter"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="newsletter"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="newsletter" className="text-sm text-gray-600">
                    Send me updates about new features and marketplace opportunities
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Client Account'}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have a client account?{' '}
                <Link to="/client/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Other Portal Links */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">
                Looking for a different portal?
              </p>
              <div className="flex justify-center space-x-4 text-xs">
                <Link to="/marketplace/login" className="text-blue-600 hover:underline">
                  Customer Portal
                </Link>
                <Link to="/vendor/login" className="text-blue-600 hover:underline">
                  Vendor Portal
                </Link>
                <Link to="/admin/login" className="text-blue-600 hover:underline">
                  Admin Portal
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSignup;
