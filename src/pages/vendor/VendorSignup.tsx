import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, MapPin, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

import VendorAuthAPI, { VendorRegisterData } from '@/services/VendorAuthAPI';
import { showSuccess, showError } from '@/utils/toast';

const signupSchema = z.object({
  business_name: z.string().min(2, 'Business name must be at least 2 characters'),
  contact_name: z.string().min(2, 'Contact name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().refine((val) => {
    if (!val || val.trim() === '') return false; // Required field
    // Remove all non-digit characters for validation
    const digitsOnly = val.replace(/\D/g, '');
    // Must be 10-15 digits (international phone numbers)
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  }, 'Please enter a valid phone number (10-15 digits)'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
  business_address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postal_code: z.string().optional(),
  description: z.string().optional(),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  newsletter: z.boolean().optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const VendorSignup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [referralInfo, setReferralInfo] = useState<{
    referralCode?: string;
    clientId?: string;
    isReferral: boolean;
    referralType?: string;
  }>({ isReferral: false });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      terms: false,
      newsletter: false,
    },
  });

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    if (!value) return value;

    // Remove all non-digit characters
    const phoneNumber = value.replace(/\D/g, '');

    // Limit to 15 digits (international standard)
    const limitedPhoneNumber = phoneNumber.slice(0, 15);

    // Format based on length
    if (limitedPhoneNumber.length <= 3) {
      return limitedPhoneNumber;
    } else if (limitedPhoneNumber.length <= 6) {
      return `(${limitedPhoneNumber.slice(0, 3)}) ${limitedPhoneNumber.slice(3)}`;
    } else if (limitedPhoneNumber.length <= 10) {
      return `(${limitedPhoneNumber.slice(0, 3)}) ${limitedPhoneNumber.slice(3, 6)}-${limitedPhoneNumber.slice(6)}`;
    } else {
      // International format
      return `+${limitedPhoneNumber.slice(0, -10)} (${limitedPhoneNumber.slice(-10, -7)}) ${limitedPhoneNumber.slice(-7, -4)}-${limitedPhoneNumber.slice(-4)}`;
    }
  };

  // Check for referral parameters on component mount
  useEffect(() => {
    const ref = searchParams.get('ref');
    const client = searchParams.get('client');
    const type = searchParams.get('type');

    if (ref || client) {
      setReferralInfo({
        referralCode: ref || undefined,
        clientId: client || undefined,
        referralType: type || undefined,
        isReferral: true,
      });
    }
  }, [searchParams]);

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const registerData: VendorRegisterData = {
        email: data.email,
        password: data.password,
        business_name: data.business_name,
        contact_name: data.contact_name,
        phone: data.phone,
        business_address: data.business_address,
        city: data.city,
        province: data.province,
        postal_code: data.postal_code,
        description: data.description,
        is_refresh: true, // Enable refresh token
        // Include referral information
        ...(referralInfo.referralCode && { referral_code: referralInfo.referralCode }),
        ...(referralInfo.clientId && { client_id: referralInfo.clientId }),
      };

      const response = await VendorAuthAPI.register(registerData);

      if (response.error) {
        setError(response.message);
        return;
      }

      // Store auth data
      VendorAuthAPI.storeAuthData(response);

      showSuccess('Welcome to Real PartnersOS! Your vendor account has been created successfully.');

      // Redirect to vendor portal
      navigate('/vendor-portal');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Join as a Vendor
            </CardTitle>
            <CardDescription className="text-gray-600">
              Register your business and start connecting with customers
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Referral Info Display */}
            {/* {referralInfo.isReferral && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {referralInfo.clientId ? (
                    <>🎉 You're signing up through a client referral! You'll get special benefits and support.</>
                  ) : (
                    <>🎉 You're signing up through a referral link! You'll get special benefits and support.</>
                  )}
                </AlertDescription>
              </Alert>
            )} */}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Business Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name" className="text-sm font-medium text-gray-700">
                    Business Name *
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="business_name"
                      placeholder="Your business name"
                      className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register('business_name')}
                    />
                  </div>
                  {errors.business_name && (
                    <p className="text-sm text-red-600">{errors.business_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_name" className="text-sm font-medium text-gray-700">
                    Contact Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="contact_name"
                      placeholder="Your full name"
                      className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register('contact_name')}
                    />
                  </div>
                  {errors.contact_name && (
                    <p className="text-sm text-red-600">{errors.contact_name.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Business Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="business@example.com"
                      className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          value={field.value || ''}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password" className="text-sm font-medium text-gray-700">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register('confirm_password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-sm text-red-600">{errors.confirm_password.message}</p>
                  )}
                </div>
              </div>

              {/* Business Address */}
              <div className="space-y-2">
                <Label htmlFor="business_address" className="text-sm font-medium text-gray-700">
                  Business Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <Input
                    id="business_address"
                    placeholder="123 Business Street"
                    className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    {...register('business_address')}
                  />
                </div>
              </div>

              {/* City, Province, Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="Toronto"
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    {...register('city')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province" className="text-sm font-medium text-gray-700">
                    Province
                  </Label>
                  <Input
                    id="province"
                    placeholder="Ontario"
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    {...register('province')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal_code" className="text-sm font-medium text-gray-700">
                    Postal Code
                  </Label>
                  <Input
                    id="postal_code"
                    placeholder="M5V 3A8"
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    {...register('postal_code')}
                  />
                </div>
              </div>

              {/* Business Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Business Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Tell customers about your business, services, and experience..."
                  className="min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...register('description')}
                />
              </div>

              {/* Terms and Newsletter */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Controller
                    name="terms"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="terms"
                        checked={field.value || false}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                        }}
                        className="mt-1"
                      />
                    )}
                  />
                  <div className="text-sm">
                    <Label htmlFor="terms" className="text-gray-700 cursor-pointer">
                      I agree to the{' '}
                      <Link to="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                    {errors.terms && (
                      <p className="text-red-600 mt-1">{errors.terms.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Controller
                    name="newsletter"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="newsletter"
                        checked={field.value || false}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                        }}
                      />
                    )}
                  />
                  <Label htmlFor="newsletter" className="text-sm text-gray-700 cursor-pointer">
                    Send me business tips and platform updates
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create Vendor Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have a vendor account?{' '}
                <Link
                  to="/vendor/login"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
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
                <Link to="/client/login" className="text-blue-600 hover:underline">
                  Client Portal
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

export default VendorSignup;
