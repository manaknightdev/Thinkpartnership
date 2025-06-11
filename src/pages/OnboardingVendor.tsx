import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlobalNavbar } from "@/components/GlobalNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Building, Briefcase, PlusCircle, CheckCircle } from "lucide-react";
import React, { useState } from "react";

interface Service {
  id: number;
  name: string;
  category: string;
  priceRange: string;
  description: string;
}

const OnboardingVendor = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    name: "",
    category: "",
    priceRange: "",
    description: "",
  });

  const handleSaveProfile = () => {
    toast.success("Company profile saved successfully!");
  };

  const handleAddService = () => {
    if (newService.name && newService.category && newService.priceRange) {
      setServices([...services, { ...newService, id: services.length + 1 }]);
      setNewService({ name: "", category: "", priceRange: "", description: "" });
      toast.success("Service added!");
    } else {
      toast.error("Please fill in all service details.");
    }
  };

  const handleCompleteOnboarding = () => {
    toast.success("Onboarding complete! Redirecting to dashboard...");
    // In a real app, this would redirect to the vendor dashboard
    setTimeout(() => {
      window.location.href = "/vendor-portal/profile";
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <GlobalNavbar />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 pt-20">
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Vendor Onboarding: List Your Services
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 text-center">
            Welcome! Set up your profile and list the services you offer to connect with new customers.
          </p>

          {/* Step 1: Company Profile */}
          <Card className="mb-8 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" /> Company Profile
              </CardTitle>
              <CardDescription>Provide your basic business information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vendor-company-name">Company Name</Label>
                <Input id="vendor-company-name" type="text" placeholder="Your Business Name" />
              </div>
              <div>
                <Label htmlFor="vendor-bio">Company Bio</Label>
                <Textarea id="vendor-bio" placeholder="Tell customers about your services and expertise." rows={4} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor-contact-email">Contact Email</Label>
                  <Input id="vendor-contact-email" type="email" placeholder="info@yourbusiness.com" />
                </div>
                <div>
                  <Label htmlFor="vendor-contact-phone">Phone Number</Label>
                  <Input id="vendor-contact-phone" type="tel" placeholder="(123) 456-7890" />
                </div>
              </div>
              <div>
                <Label htmlFor="vendor-website">Website URL (Optional)</Label>
                <Input id="vendor-website" type="url" placeholder="https://www.yourbusiness.com" />
              </div>
              <Button onClick={handleSaveProfile}>Save Profile</Button>
            </CardContent>
          </Card>

          {/* Step 2: Service Listings */}
          <Card className="mb-8 animate-fade-in-up animate-delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" /> Your Services
              </CardTitle>
              <CardDescription>Add the services you offer to your marketplace profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 p-4 border rounded-md dark:border-gray-700">
                <h3 className="text-lg font-semibold">Add New Service</h3>
                <div>
                  <Label htmlFor="service-name">Service Name</Label>
                  <Input
                    id="service-name"
                    type="text"
                    placeholder="e.g., Emergency Plumbing Repair"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="service-category">Category</Label>
                  <Select
                    value={newService.category}
                    onValueChange={(value) => setNewService({ ...newService, category: value })}
                  >
                    <SelectTrigger id="service-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="landscaping">Landscaping</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                      <SelectItem value="moving">Moving</SelectItem>
                      <SelectItem value="inspections">Inspections</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price-range">Price Range (e.g., $100+, $500-$1000)</Label>
                  <Input
                    id="price-range"
                    type="text"
                    placeholder="$XXX+"
                    value={newService.priceRange}
                    onChange={(e) => setNewService({ ...newService, priceRange: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="service-description">Service Description</Label>
                  <Textarea
                    id="service-description"
                    placeholder="Briefly describe this service."
                    rows={3}
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddService} variant="outline" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Service
                </Button>
              </div>

              {services.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Your Listed Services</h3>
                  <ul className="space-y-3">
                    {services.map((service) => (
                      <li key={service.id} className="p-3 border rounded-md dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <p className="font-medium">{service.name} <span className="text-sm text-gray-500 dark:text-gray-400">({service.category})</span></p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{service.priceRange}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{service.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completion Button */}
          <div className="text-center mt-10 animate-fade-in-up animate-delay-400">
            <Button size="lg" onClick={handleCompleteOnboarding}>
              <CheckCircle className="mr-2 h-5 w-5" /> Complete Onboarding
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingVendor;