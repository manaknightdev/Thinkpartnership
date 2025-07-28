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
  phone: z.string().optional(),
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
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

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

      // Use client ID directly instead of clientSlug
      const clientIdentifier = client?.id?.toString() || clientSlug;

      console.log('🚀 Registering customer with client context:', {
        client: client?.company_name,
        clientId: client?.id,
        clientSlug: clientSlug,
        clientIdentifier: clientIdentifier,
        hasInviteCode: !!referralInfo.inviteCode,
        hasReferralCode: !!referralInfo.referralCode
      });

      const response = await MarketplaceAuthAPI.register(registerData, clientIdentifier);

      if (response.error) {
        setError(response.message);
        return;
      }

      // Store auth data
      MarketplaceAuthAPI.storeAuthData(response);

      const clientName = client?.company_name || 'the marketplace';
      showSuccess(`Welcome to ${clientName}! Your account has been created successfully. Please login to continue.`);

      // Redirect to login page (no client parameter needed - auto-detection will work)
      navigate('/marketplace/login');
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
            {client?.company_name || 'ThinkPartnership'}
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Referral Info Display */}
              {referralInfo.isReferral && (
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
              )}

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
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="pl-10"
                    {...register('phone')}
                  />
                </div>
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
                    defaultValue={false}
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
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox
                        id="newsletter"
                        checked={field.value}
                        onCheckedChange={field.onChange}
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
