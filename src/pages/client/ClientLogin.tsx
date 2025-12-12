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
import { Eye, EyeOff, Building2, ArrowLeft } from 'lucide-react';

import ClientAPI, { ClientLoginData } from '@/services/ClientAPI';
import { showSuccess, showError } from '@/utils/toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const ClientLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('🚀 Form submitted with data:', data);
    setIsLoading(true);
    setError('');

    try {
      const loginData: ClientLoginData = {
        email: data.email,
        password: data.password,
        is_refresh: data.remember,
      };

      console.log('📤 Sending login request:', loginData);
      const response = await ClientAPI.login(loginData);
      console.log('📥 Login response:', response);

      if (response.error) {
        setError(response.message);
        return;
      }

      // Store auth data
      ClientAPI.storeAuthData(response);
      console.log('🔐 Auth data stored, checking if authenticated:', ClientAPI.isAuthenticated());
      console.log('🔑 Stored token:', localStorage.getItem('client_token'));

      showSuccess('Welcome back! You have been successfully logged in to your client portal.');

      // Redirect to client portal
      console.log('🔄 Navigating to /client-portal');
      navigate('/client-portal');
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
              Client Portal
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to manage your marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={(e) => {
                console.log('📝 Form onSubmit triggered');
                handleSubmit(onSubmit)(e);
              }}
              className="space-y-4"
            >
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your business email"
                  {...register('email')}
                  className="h-11 sm:h-12 lg:h-14 text-sm sm:text-base"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password')}
                    className="h-11 sm:h-12 lg:h-14 pr-10 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Controller
                    name="remember"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="remember"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="remember" className="ml-2 text-sm sm:text-base text-gray-600">
                    Keep me signed in
                  </Label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/client/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 lg:h-14 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium text-sm sm:text-base lg:text-lg"
                disabled={isLoading}
                onClick={() => console.log('🔘 Button clicked!')}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm sm:text-base text-gray-600">
                Don't have a client account?{' '}
                <Link to="/client/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up here
                </Link>
              </p>
            </div>

            {/* Other Portal Links */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-500 text-center mb-3">
                Looking for a different portal?
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <Link to="/marketplace/login" className="text-blue-600 hover:underline px-2 py-1">
                  Customer Portal
                </Link>
                <Link to="/vendor/login" className="text-blue-600 hover:underline px-2 py-1">
                  Vendor Portal
                </Link>
                <Link to="/admin/login" className="text-blue-600 hover:underline px-2 py-1">
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

export default ClientLogin;
