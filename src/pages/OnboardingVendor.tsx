import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlobalNavbar } from "@/components/GlobalNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Building,
  Briefcase,
  PlusCircle,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Rocket,
  Users,
  DollarSign,
  Trash2,
  Edit
} from "lucide-react";
import React, { useState } from "react";

interface Service {
  id: number;
  name: string;
  category: string;
  priceRange: string;
  description: string;
}

const OnboardingVendor = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    name: "",
    category: "",
    priceRange: "",
    description: "",
  });
  const [profileData, setProfileData] = useState({
    companyName: "",
    companyBio: "",
    contactEmail: "",
    contactPhone: "",
    website: ""
  });

  const handleSaveProfile = () => {
    if (profileData.companyName && profileData.companyBio && profileData.contactEmail && profileData.contactPhone) {
      setCompletedSteps(prev => [...prev.filter(s => s !== 1), 1]);
      toast.success("Company profile saved successfully!");
      setCurrentStep(2);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleAddService = () => {
    if (newService.name && newService.category && newService.priceRange) {
      setServices([...services, { ...newService, id: services.length + 1 }]);
      setNewService({ name: "", category: "", priceRange: "", description: "" });
      toast.success("Service added!");
      if (!completedSteps.includes(2)) {
        setCompletedSteps(prev => [...prev.filter(s => s !== 2), 2]);
      }
    } else {
      toast.error("Please fill in all service details.");
    }
  };

  const handleRemoveService = (id: number) => {
    setServices(services.filter(service => service.id !== id));
    toast.success("Service removed");
  };

  const handleCompleteOnboarding = () => {
    if (completedSteps.length === 2 && services.length > 0) {
      toast.success("Onboarding complete! Redirecting to dashboard...");
      setTimeout(() => {
        window.location.href = "/vendor-portal/profile";
      }, 1500);
    } else {
      toast.error("Please complete your profile and add at least one service");
    }
  };

  const updateProfileData = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
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

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 pt-24">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Vendor Onboarding
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
              Start Offering Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Professional Services
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Set up your business profile and showcase your services to connect with customers
              who need your expertise. Start earning today!
            </p>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {[1, 2].map((step) => (
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
                  {step < 2 && (
                    <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      completedSteps.includes(step) ? 'bg-green-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Company Profile */}
          <Card className={`mb-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${
            currentStep === 1 ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
          }`}>
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Building className="h-5 w-5 text-white" />
                </div>
                Company Profile
                {completedSteps.includes(1) && (
                  <CheckCircle className="h-6 w-6 text-green-500 ml-auto" />
                )}
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Tell customers about your business and how they can reach you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="vendor-company-name" className="text-gray-700 font-medium">Company Name *</Label>
                <Input
                  id="vendor-company-name"
                  type="text"
                  placeholder="Your Business Name"
                  value={profileData.companyName}
                  onChange={(e) => updateProfileData('companyName', e.target.value)}
                  className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="vendor-bio" className="text-gray-700 font-medium">Company Bio *</Label>
                <Textarea
                  id="vendor-bio"
                  placeholder="Tell customers about your services, expertise, and what makes you unique..."
                  rows={4}
                  value={profileData.companyBio}
                  onChange={(e) => updateProfileData('companyBio', e.target.value)}
                  className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor-contact-email" className="text-gray-700 font-medium">Contact Email *</Label>
                  <Input
                    id="vendor-contact-email"
                    type="email"
                    placeholder="info@yourbusiness.com"
                    value={profileData.contactEmail}
                    onChange={(e) => updateProfileData('contactEmail', e.target.value)}
                    className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="vendor-contact-phone" className="text-gray-700 font-medium">Phone Number *</Label>
                  <Input
                    id="vendor-contact-phone"
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={profileData.contactPhone}
                    onChange={(e) => updateProfileData('contactPhone', e.target.value)}
                    className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="vendor-website" className="text-gray-700 font-medium">Website URL (Optional)</Label>
                <Input
                  id="vendor-website"
                  type="url"
                  placeholder="https://www.yourbusiness.com"
                  value={profileData.website}
                  onChange={(e) => updateProfileData('website', e.target.value)}
                  className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button
                onClick={handleSaveProfile}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                disabled={completedSteps.includes(1)}
              >
                {completedSteps.includes(1) ? 'Profile Saved' : 'Save & Continue'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Service Listings */}
          <Card className={`mb-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${
            currentStep === 2 ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
          } ${currentStep < 2 ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                Your Services
                {completedSteps.includes(2) && (
                  <CheckCircle className="h-6 w-6 text-green-500 ml-auto" />
                )}
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Add the services you offer to attract customers and start earning.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-blue-600" />
                  Add New Service
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="service-name" className="text-gray-700 font-medium">Service Name *</Label>
                    <Input
                      id="service-name"
                      type="text"
                      placeholder="e.g., Emergency Plumbing Repair"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      disabled={currentStep < 2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="service-category" className="text-gray-700 font-medium">Category *</Label>
                    <Select
                      value={newService.category}
                      onValueChange={(value) => setNewService({ ...newService, category: value })}
                      disabled={currentStep < 2}
                    >
                      <SelectTrigger id="service-category" className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="hvac">HVAC</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="landscaping">Landscaping</SelectItem>
                        <SelectItem value="painting">Painting</SelectItem>
                        <SelectItem value="moving">Moving</SelectItem>
                        <SelectItem value="inspections">Home Inspections</SelectItem>
                        <SelectItem value="roofing">Roofing</SelectItem>
                        <SelectItem value="flooring">Flooring</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mb-4">
                  <Label htmlFor="price-range" className="text-gray-700 font-medium">Price Range *</Label>
                  <Input
                    id="price-range"
                    type="text"
                    placeholder="e.g., $150+, $500-$1000, $2000"
                    value={newService.priceRange}
                    onChange={(e) => setNewService({ ...newService, priceRange: e.target.value })}
                    className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={currentStep < 2}
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="service-description" className="text-gray-700 font-medium">Service Description</Label>
                  <Textarea
                    id="service-description"
                    placeholder="Describe what's included, your expertise, and what makes your service special..."
                    rows={3}
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={currentStep < 2}
                  />
                </div>
                <Button
                  onClick={handleAddService}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  disabled={currentStep < 2}
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> Add Service
                </Button>
              </div>

              {services.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-green-600" />
                    Your Listed Services ({services.length})
                  </h3>
                  <div className="grid gap-4">
                    {services.map((service) => (
                      <div key={service.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{service.name}</h4>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                                {service.category}
                              </span>
                            </div>
                            <p className="text-green-600 font-medium mb-2">{service.priceRange}</p>
                            {service.description && (
                              <p className="text-gray-600 text-sm line-clamp-2">{service.description}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveService(service.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completion Section */}
          <div className="text-center mt-12">
            {completedSteps.length === 2 && services.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Ready to Start Earning!</h3>
                  <p className="text-green-700 mb-6">
                    Your vendor profile is complete with {services.length} service{services.length !== 1 ? 's' : ''}.
                    Access your dashboard to manage bookings and connect with customers.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-700">Connect with Customers</p>
                    </div>
                    <div className="text-center">
                      <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-700">Start Earning</p>
                    </div>
                    <div className="text-center">
                      <Rocket className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-700">Grow Your Business</p>
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={handleCompleteOnboarding}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-4 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Rocket className="mr-3 h-6 w-6" />
                  Launch My Vendor Profile
                </Button>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                <p className="text-gray-600 text-lg">
                  {completedSteps.length < 2
                    ? "Complete your profile and add services to get started"
                    : "Add at least one service to launch your vendor profile"
                  }
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Profile: {completedSteps.includes(1) ? '✓' : '○'} |
                  Services: {services.length > 0 ? `✓ (${services.length})` : '○'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingVendor;