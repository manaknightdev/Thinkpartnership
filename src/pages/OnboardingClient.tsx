import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlobalNavbar } from "@/components/GlobalNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Building,
  Palette,
  Globe,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Upload,
  Rocket,
  Users,
  DollarSign
} from "lucide-react";
import { useState } from "react";

const OnboardingClient = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    companyName: "",
    contactEmail: "",
    contactPhone: "",
    primaryColor: "#3B82F6",
    subdomain: ""
  });

  const handleSaveCompanyInfo = () => {
    if (formData.companyName && formData.contactEmail && formData.contactPhone) {
      setCompletedSteps(prev => [...prev.filter(s => s !== 1), 1]);
      toast.success("Company information saved!");
      setCurrentStep(2);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleSaveBranding = () => {
    setCompletedSteps(prev => [...prev.filter(s => s !== 2), 2]);
    toast.success("Branding settings saved!");
    setCurrentStep(3);
  };

  const handleSaveDomain = () => {
    if (formData.subdomain) {
      setCompletedSteps(prev => [...prev.filter(s => s !== 3), 3]);
      toast.success("Domain settings saved!");
    } else {
      toast.error("Please enter a subdomain");
    }
  };

  const handleCompleteOnboarding = () => {
    if (completedSteps.length === 3) {
      toast.success("Onboarding complete! Redirecting to dashboard...");
      setTimeout(() => {
        window.location.href = "/client-portal/overview";
      }, 1500);
    } else {
      toast.error("Please complete all steps before finishing");
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <GlobalNavbar />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] bg-[length:24px_24px]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-indigo-200 rounded-full opacity-40 animate-bounce"></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-cyan-200 rounded-full opacity-50 animate-pulse"></div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 pt-24">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Client Onboarding
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
              Launch Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Branded Marketplace
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Set up your custom marketplace in just a few steps. Connect with vendors,
              serve customers, and start earning revenue today.
            </p>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    completedSteps.includes(step)
                      ? 'bg-green-500 text-white'
                      : currentStep === step
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {completedSteps.includes(step) ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      completedSteps.includes(step) ? 'bg-green-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Company Information */}
          <Card className={`mb-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${
            currentStep === 1 ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
          }`}>
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Building className="h-5 w-5 text-white" />
                </div>
                Company Information
                {completedSteps.includes(1) && (
                  <CheckCircle className="h-6 w-6 text-green-500 ml-auto" />
                )}
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Tell us about your organization and how customers can reach you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="company-name" className="text-gray-700 font-medium">Company Name *</Label>
                <Input
                  id="company-name"
                  type="text"
                  placeholder="Your Company Name"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="contact-email" className="text-gray-700 font-medium">Contact Email *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="contact@yourcompany.com"
                  value={formData.contactEmail}
                  onChange={(e) => updateFormData('contactEmail', e.target.value)}
                  className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="contact-phone" className="text-gray-700 font-medium">Phone Number *</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={formData.contactPhone}
                  onChange={(e) => updateFormData('contactPhone', e.target.value)}
                  className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button
                onClick={handleSaveCompanyInfo}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                disabled={completedSteps.includes(1)}
              >
                {completedSteps.includes(1) ? 'Company Info Saved' : 'Save & Continue'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Marketplace Branding */}
          <Card className={`mb-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${
            currentStep === 2 ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
          } ${currentStep < 2 ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Palette className="h-5 w-5 text-white" />
                </div>
                Marketplace Branding
                {completedSteps.includes(2) && (
                  <CheckCircle className="h-6 w-6 text-green-500 ml-auto" />
                )}
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Customize the look and feel of your branded marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="logo-upload" className="text-gray-700 font-medium">Upload Logo</Label>
                <div className="mt-1 flex items-center space-x-4">
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={currentStep < 2}
                  />
                  <Upload className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mt-1">Max file size 5MB. PNG, JPG, SVG recommended.</p>
              </div>
              <div>
                <Label htmlFor="primary-color" className="text-gray-700 font-medium">Primary Brand Color</Label>
                <div className="mt-1 flex items-center space-x-4">
                  <Input
                    id="primary-color"
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => updateFormData('primaryColor', e.target.value)}
                    className="w-20 h-12 p-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={currentStep < 2}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">Choose your brand's main accent color</p>
                    <p className="text-xs text-gray-500">This will be used for buttons, links, and highlights</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSaveBranding}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                disabled={currentStep < 2 || completedSteps.includes(2)}
              >
                {completedSteps.includes(2) ? 'Branding Saved' : 'Save & Continue'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>

          {/* Step 3: Domain Setup */}
          <Card className={`mb-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${
            currentStep === 3 ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
          } ${currentStep < 3 ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                Domain Setup
                {completedSteps.includes(3) && (
                  <CheckCircle className="h-6 w-6 text-green-500 ml-auto" />
                )}
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Choose your unique marketplace URL that customers will visit.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="subdomain" className="text-gray-700 font-medium">Your Marketplace URL *</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Input
                    id="subdomain"
                    type="text"
                    placeholder="yourbrand"
                    value={formData.subdomain}
                    onChange={(e) => updateFormData('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-grow border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={currentStep < 3}
                  />
                  <span className="text-gray-600 font-medium">.realpartneros.com</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">This will be your unique marketplace address. Only lowercase letters, numbers, and hyphens allowed.</p>
                {formData.subdomain && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>Your marketplace will be available at:</strong><br />
                      <span className="font-mono">https://{formData.subdomain}.realpartneros.com</span>
                    </p>
                  </div>
                )}
              </div>
              <Button
                onClick={handleSaveDomain}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                disabled={currentStep < 3 || completedSteps.includes(3)}
              >
                {completedSteps.includes(3) ? 'Domain Saved' : 'Save Domain'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>

          {/* Completion Section */}
          <div className="text-center mt-12">
            {completedSteps.length === 3 ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Ready to Launch!</h3>
                  <p className="text-green-700 mb-6">
                    Your marketplace is configured and ready to go. Click below to access your dashboard and start inviting vendors.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-700">Invite Vendors</p>
                    </div>
                    <div className="text-center">
                      <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-700">Start Earning</p>
                    </div>
                    <div className="text-center">
                      <Rocket className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-700">Go Live</p>
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={handleCompleteOnboarding}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-4 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Rocket className="mr-3 h-6 w-6" />
                  Launch My Marketplace
                </Button>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                <p className="text-gray-600 text-lg">
                  Complete all steps above to launch your marketplace
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {completedSteps.length} of 3 steps completed
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingClient;