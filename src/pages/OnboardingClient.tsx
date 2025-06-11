import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlobalNavbar } from "@/components/GlobalNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Building, Palette, Globe, CheckCircle } from "lucide-react";

const OnboardingClient = () => {
  const handleSaveCompanyInfo = () => {
    toast.success("Company information saved!");
  };

  const handleSaveBranding = () => {
    toast.success("Branding settings saved!");
  };

  const handleSaveDomain = () => {
    toast.success("Domain settings saved!");
  };

  const handleCompleteOnboarding = () => {
    toast.success("Onboarding complete! Redirecting to dashboard...");
    // In a real app, this would redirect to the client dashboard
    setTimeout(() => {
      window.location.href = "/client-portal/overview";
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <GlobalNavbar />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 pt-20">
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Client Onboarding: Set Up Your Marketplace
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 text-center">
            Welcome! Let's get your branded sub-marketplace ready. Fill in the details below to get started.
          </p>

          {/* Step 1: Company Information */}
          <Card className="mb-8 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" /> Company Information
              </CardTitle>
              <CardDescription>Tell us about your organization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" type="text" placeholder="Your Company Name" />
              </div>
              <div>
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" type="email" placeholder="contact@yourcompany.com" />
              </div>
              <div>
                <Label htmlFor="contact-phone">Phone Number</Label>
                <Input id="contact-phone" type="tel" placeholder="(123) 456-7890" />
              </div>
              <Button onClick={handleSaveCompanyInfo}>Save Company Info</Button>
            </CardContent>
          </Card>

          {/* Step 2: Marketplace Branding */}
          <Card className="mb-8 animate-fade-in-up animate-delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" /> Marketplace Branding
              </CardTitle>
              <CardDescription>Customize the look and feel of your sub-marketplace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logo-upload">Upload Logo</Label>
                <Input id="logo-upload" type="file" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Max file size 5MB. PNG, JPG, SVG.</p>
              </div>
              <div>
                <Label htmlFor="primary-color">Primary Color</Label>
                <Input id="primary-color" type="color" defaultValue="#22C55E" className="w-24 h-10 p-1" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose your brand's main accent color.</p>
              </div>
              <Button onClick={handleSaveBranding}>Save Branding</Button>
            </CardContent>
          </Card>

          {/* Step 3: Domain Setup */}
          <Card className="mb-8 animate-fade-in-up animate-delay-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" /> Domain Setup
              </CardTitle>
              <CardDescription>Choose your marketplace URL.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subdomain">Your Sub-marketplace URL</Label>
                <div className="flex items-center space-x-2">
                  <Input id="subdomain" type="text" placeholder="yourbrand" className="flex-grow" />
                  <span className="text-gray-600 dark:text-gray-400">.thinkpartnerships.com</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This will be your unique marketplace address.</p>
              </div>
              <Button onClick={handleSaveDomain}>Save Domain</Button>
            </CardContent>
          </Card>

          {/* Completion Button */}
          <div className="text-center mt-10 animate-fade-in-up animate-delay-600">
            <Button size="lg" onClick={handleCompleteOnboarding}>
              <CheckCircle className="mr-2 h-5 w-5" /> Complete Onboarding
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingClient;