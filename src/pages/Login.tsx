import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlobalNavbar } from "@/components/GlobalNavbar";
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Building2,
  Users,
  DollarSign,
  Eye,
  EyeOff,
  Shield,
  Zap
} from "lucide-react";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // In a real application, you would handle authentication here.
    // For now, we'll just simulate a successful login and redirect to onboarding.
    console.log("Simulating login and redirecting to client onboarding...");
    navigate("/onboarding-client");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <GlobalNavbar />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] bg-[length:24px_24px]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-40 left-20 w-16 h-16 bg-indigo-200 rounded-full opacity-40 animate-bounce"></div>
      <div className="absolute bottom-40 right-20 w-12 h-12 bg-cyan-200 rounded-full opacity-50 animate-pulse"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left Side - Marketing Content */}
            <div className="text-center lg:text-left space-y-6 lg:space-y-8">
              <div>
                <span className="inline-flex items-center px-3 py-2 sm:px-4 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4 sm:mb-6">
                  <Shield className="w-4 h-4 mr-2" />
                  Welcome Back
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
                  Continue Building Your
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Success Story
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  Access your marketplace dashboard, manage your vendors,
                  track your earnings, and grow your business empire.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-700">Lightning-fast dashboard access</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Manage multiple marketplaces</span>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-6 h-6 text-purple-500 flex-shrink-0" />
                  <span className="text-gray-700">Real-time revenue tracking</span>
                </div>
              </div>

              {/* Recent Activity Preview */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Marketplace at a Glance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">24</div>
                    <div className="text-xs text-gray-600">Active Vendors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">$12.5K</div>
                    <div className="text-xs text-gray-600">This Month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">156</div>
                    <div className="text-xs text-gray-600">New Customers</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md lg:max-w-lg bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardHeader className="text-center pb-6 px-6 sm:px-8">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
                  <CardDescription className="text-gray-600 text-sm sm:text-base">
                    Sign in to your marketplace dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-6 sm:px-8 pb-6 sm:pb-8">
                  <form className="space-y-5">
                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-medium text-sm sm:text-base">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-11 sm:h-12 text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-gray-700 font-medium text-sm sm:text-base">Password</Label>
                        <Link to="/forgot-password" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 transition-colors">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative mt-1">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10 h-11 sm:h-12 text-sm sm:text-base"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleLogin}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Access Dashboard
                      <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </form>

                  <div className="text-center">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                        Create Account
                      </Link>
                    </p>
                  </div>

                  <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
                    Secure login protected by enterprise-grade encryption
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;