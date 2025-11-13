import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

import AuthAPI, { RegisterData } from '@/services/AuthAPI';
import MarketplaceAuthAPI, { MarketplaceRegisterData } from '@/services/MarketplaceAuthAPI';
import { showSuccess, showError } from '@/utils/toast';
import { useClient } from '@/contexts/ClientContext';

const signupSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().refine((val) => {
    if (!val || val.trim() === '') return true; // Optional field
    // Remove all non-digit characters for validation
    const digitsOnly = val.replace(/\D/g, '');
    // Must be 10-15 digits (international phone numbers)
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  }, 'Please enter a valid phone number (10-15 digits)'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  newsletter: z.boolean().optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const CustomerSignup = () => {
  const navigate = useNavigate();
  const { clientSlug } = useParams();
  const [searchParams] = useSearchParams();
  const { client, isLoading: clientLoading, error: clientError, getInviteCode } = useClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [referralInfo, setReferralInfo] = useState<{
    referralCode?: string;
    vendorId?: string;
    clientId?: string;
    isReferral: boolean;
    referralType?: string;
    inviteCode?: string;
  }>({ isReferral: false });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
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

  // Handle referral codes and invite codes from URL parameters and client context
  useEffect(() => {
    const ref = searchParams.get('ref');
    const vendor = searchParams.get('vendor');
    const clientParam = searchParams.get('client');
    const type = searchParams.get('type');
    const invite = searchParams.get('invite') || searchParams.get('code');

    // Get invite code from client context if available
    const contextInviteCode = getInviteCode();

    if (ref || vendor || clientParam || invite || contextInviteCode) {
      setReferralInfo({
        referralCode: ref || undefined,
        vendorId: vendor || undefined,
        clientId: clientParam || client?.id?.toString() || undefined,
        referralType: type || undefined,
        inviteCode: invite || contextInviteCode || undefined,
        isReferral: true
      });
    }
  }, [searchParams, client, getInviteCode]);

  // Redirect if no client context is available (but allow invite links)
  useEffect(() => {
    if (!clientLoading && !client && !clientSlug) {
      // Check if this is an invite link before redirecting
      const urlParams = new URLSearchParams(window.location.search);
      const hasInviteParams = urlParams.get('ref') || urlParams.get('invite') || urlParams.get('code') || urlParams.get('client');

      if (!hasInviteParams) {
        console.log('❌ No client context and no invite parameters, redirecting to select-client');
        navigate('/select-client');
      } else {
        console.log('✅ Invite parameters found, allowing signup even without client context');
      }
    }
  }, [client, clientLoading, clientSlug, navigate]);

  // Social login handler following the URL pattern from the image
  const handleSocialLogin = (provider: string) => {
    // Get the current client context
    const currentClientSlug = clientSlug || client?.id?.toString();
    const baseUrl = import.meta.env.VITE_BASE_URL;

    // Construct the social login URL based on the backend API endpoints
    let socialLoginUrl = '';

    switch (provider) {
      case 'google':
        // Use the customer Google login endpoint from the backend with referral code
        socialLoginUrl = `${baseUrl}/v1/api/thinkpartnership/customer/lambda/google/login`;
        break;

      case 'facebook':
        // Use the customer Facebook login endpoint from the backend with referral code
        socialLoginUrl = `${baseUrl}/v1/api/thinkpartnership/customer/lambda/facebook/login`;
        break;

      default:
        showError('Unsupported social login provider');
        return;
    }

    // Add referral code if available (following the image pattern)
    if (referralInfo.referralCode) {
      socialLoginUrl += `?referral_code=${encodeURIComponent(referralInfo.referralCode)}`;
    } else if (referralInfo.inviteCode) {
      socialLoginUrl += `?referral_code=${encodeURIComponent(referralInfo.inviteCode)}`;
    }

    // Add client context if available
    if (currentClientSlug) {
      const separator = socialLoginUrl.includes('?') ? '&' : '?';
      socialLoginUrl += `${separator}client=${encodeURIComponent(currentClientSlug)}`;
    }

    console.log(`🔗 Redirecting to ${provider} signup:`, socialLoginUrl);

    // Redirect to the backend social login endpoint
    window.location.href = socialLoginUrl;
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError('');

    try {
      // Check if we have client context or invite parameters
      const urlParams = new URLSearchParams(window.location.search);
      const hasInviteParams = urlParams.get('ref') || urlParams.get('invite') || urlParams.get('code') || urlParams.get('client');

      if (!client && !hasInviteParams) {
        setError('Client context not available. Please access through a valid client marketplace.');
        return;
      }

      // If we don't have client context but have invite params, we'll let the backend handle it
      if (!client && hasInviteParams) {
        console.log('⚠️ No client context but invite params present, proceeding with registration');
      }

      const registerData: MarketplaceRegisterData = {
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        is_refresh: true, // Enable refresh token
        // Include referral data if available
        ...(referralInfo.referralCode && { referral_code: referralInfo.referralCode }),
        ...(referralInfo.vendorId && { vendor_id: referralInfo.vendorId }),
        ...(referralInfo.inviteCode && { invite_code: referralInfo.inviteCode }),
      };

      // Use client ID directly instead of clientSlug; fallback to referral/client URL param
      const urlClientParam = new URLSearchParams(window.location.search).get('client') || undefined;
      const clientIdentifier = client?.id?.toString() || clientSlug || referralInfo.clientId || urlClientParam;

      console.log('🚀 Registering customer with client context:', {
        client: client?.company_name,
        clientId: client?.id,
        clientSlug: clientSlug,
        clientIdentifier: clientIdentifier,
        hasInviteCode: !!referralInfo.inviteCode,
        hasReferralCode: !!referralInfo.referralCode,
        urlClientParam: urlClientParam,
        referralClientId: referralInfo.clientId
      });

      const response = await MarketplaceAuthAPI.register(registerData, clientIdentifier);

      if (response.error) {
        setError(response.message);
        return;
      }

      // Store auth data
      MarketplaceAuthAPI.storeAuthData(response);

      const clientName = client?.company_name || 'the marketplace';
      showSuccess(`Welcome to ${clientName}! Your account has been created successfully.`);

      // Redirect directly to marketplace since we already stored the token
      navigate('/marketplace');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          {client?.logo_url ? (
            <img
              src={client.logo_url}
              alt={client.company_name}
              className="h-12 mx-auto mb-4"
            />
          ) : (
            <div className="h-12 w-12 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-gray-600">
                {client?.company_name?.charAt(0) || 'T'}
              </span>
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {client?.company_name || 'Real PartnersOS'}
          </h1>
          <p className="text-gray-600">Join our marketplace community</p>
          {referralInfo.isReferral && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                🎉 You've been invited to join {client?.company_name || 'our marketplace'}!
              </p>
            </div>
          )}
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Get started with your free account
            </CardDescription>
            {referralInfo.isReferral && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800 font-medium">
                    🎉 You're joining via a special invitation!
                  </span>
                </div>
                <p className="text-xs text-green-600 text-center mt-1">
                  Complete your registration to get connected with your inviting partner
                </p>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {/* Social Login Buttons - Added before the form */}
            <div className="space-y-3 mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 py-2.5 border-gray-300 hover:bg-gray-50"
                onClick={() => handleSocialLogin('google')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 py-2.5 border-gray-300 hover:bg-gray-50"
                onClick={() => handleSocialLogin('facebook')}
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    ) : referralInfo.vendorId ? (
                      <>🎉 You're signing up through a vendor referral! You'll get special benefits and support.</>
                    ) : (
                      <>🎉 You're signing up through a referral link! You'll get special benefits and support.</>
                    )}
                  </AlertDescription>
                </Alert>
              )} */}

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="first_name"
                      placeholder="First name"
                      className="pl-10"
                      {...register('first_name')}
                    />
                  </div>
                  {errors.first_name && (
                    <p className="text-sm text-red-600">{errors.first_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="last_name"
                      placeholder="Last name"
                      className="pl-10"
                      {...register('last_name')}
                    />
                  </div>
                  {errors.last_name && (
                    <p className="text-sm text-red-600">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        className="pl-10"
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

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="pl-10 pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    {...register('confirm_password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="text-sm text-red-600">{errors.confirm_password.message}</p>
                )}
              </div>

              {/* Terms and Newsletter */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Controller
                    name="terms"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="terms"
                        checked={field.value || false}
                        onCheckedChange={(checked) => {
                          field.onChange(checked === true);
                        }}
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
                        checked={field.value || false}
                        onCheckedChange={(checked) => {
                          field.onChange(checked === true);
                        }}
                      />
                    )}
                  />
                  <Label htmlFor="newsletter" className="text-sm text-gray-600">
                    Subscribe to our newsletter for updates and offers
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to={clientSlug ? `/${clientSlug}/marketplace/login` : '/marketplace/login'}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerSignup;
