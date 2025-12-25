import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

import MarketplaceAuthAPI, { MarketplaceLoginData } from '@/services/MarketplaceAuthAPI';
import { useClient } from '@/contexts/ClientContext';
import { showSuccess, showError } from '@/utils/toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const CustomerLogin = () => {
  const navigate = useNavigate();
  const { client, clientSlug } = useClient();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Debug: Check URL parameters directly
  const urlParams = new URLSearchParams(window.location.search);
  const clientParam = urlParams.get('client');

  console.log('🔍 Login page debug:', {
    urlClientParam: clientParam,
    clientFromContext: client,
    clientSlugFromContext: clientSlug,
    currentURL: window.location.href
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const loginData: MarketplaceLoginData = {
        email: data.email,
        password: data.password,
        is_refresh: data.remember,
      };

      console.log('🔐 Logging in with auto-detection (no client parameter needed):', {
        email: data.email,
        autoDetectClient: true
      });

      // No client parameter needed - backend will auto-detect from customer email
      const response = await MarketplaceAuthAPI.login(loginData);

      if (response.error) {
        setError(response.message);
        return;
      }

      // Store auth data
      MarketplaceAuthAPI.storeAuthData(response);

      // Use client name from response (auto-detected by backend)
      const detectedClientName = response.client_name || 'the marketplace';
      showSuccess(`Welcome back to ${detectedClientName}!`);

      // Redirect to marketplace
      navigate('/marketplace');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Get the current client context
    const currentClientSlug = clientSlug || clientParam;
    // CHANGE FALLBACK URL HERE: If VITE_BASE_URL is missing, use this URL
    const baseUrl = 'https://baas.mytechpassport.com';

    // Construct the social login URL based on the backend API endpoints
    let socialLoginUrl = '';

    switch (provider) {
      case 'google':
        // Use the customer Google login endpoint from the backend
        socialLoginUrl = `${baseUrl}/v1/api/thinkpartnership/customer/lambda/google/login`;

        // Add client context if available
        if (currentClientSlug) {
          socialLoginUrl += `?client=${encodeURIComponent(currentClientSlug)}`;
        }
        break;

      case 'facebook':
        // Use the customer Facebook login endpoint from the backend
        socialLoginUrl = `${baseUrl}/v1/api/thinkpartnership/customer/lambda/facebook/login`;

        // Add client context if available
        if (currentClientSlug) {
          socialLoginUrl += `?client=${encodeURIComponent(currentClientSlug)}`;
        }
        break;

      case 'microsoft':
        // Use the customer Microsoft login endpoint from the backend
        socialLoginUrl = `${baseUrl}/v1/api/thinkpartnership/customer/lambda/microsoft/login`;

        // Add client context if available
        if (currentClientSlug) {
          socialLoginUrl += `?client=${encodeURIComponent(currentClientSlug)}`;
        }
        break;

      case 'linkedin':
        // Use the customer LinkedIn login endpoint from the backend
        socialLoginUrl = `${baseUrl}/v1/api/thinkpartnership/customer/lambda/linkedin/login`;

        // Add client context if available
        if (currentClientSlug) {
          socialLoginUrl += `?client=${encodeURIComponent(currentClientSlug)}`;
        }
        break;

      default:
        showError('Unsupported social login provider');
        return;
    }

    console.log(`🔗 Redirecting to ${provider} login:`, socialLoginUrl);

    // Redirect to the backend social login endpoint
    window.location.href = socialLoginUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Real PartnersOS</h1>
          <p className="text-gray-600">Welcome backll to the marketplace</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
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

              {/* Remember Me */}
              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Controller
                    name="remember"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox
                        id="remember"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Keep me signed in
                  </Label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/marketplace/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </Link>
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
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Social Login Divider */}
            <div className="mt-6 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 py-2.5 border-gray-300 hover:bg-gray-50"
                onClick={() => handleSocialLogin('google')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
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
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </Button>

              {/* <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 py-2.5 border-gray-300 hover:bg-gray-50"
                onClick={() => handleSocialLogin('microsoft')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z"/>
                  <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                  <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                  <path fill="#FFB900" d="M13 13h10v10H13z"/>
                </svg>
                Continue with Microsoft
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 py-2.5 border-gray-300 hover:bg-gray-50"
                onClick={() => handleSocialLogin('linkedin')}
              >
                <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Continue with LinkedIn
              </Button> */}
            </div>

            {/* Sign Up Link */}
            {/* <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/marketplace/signup"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div> */}

            {/* Other Portal Links */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">
                Looking for a different portal?
              </p>
              <div className="flex justify-center space-x-4 text-xs">
                <Link to="/vendor/login" className="text-blue-600 hover:underline">
                  Vendor Portal
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

export default CustomerLogin;
