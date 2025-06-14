import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Building, Mail, Phone, Globe, MapPin, Clock, Award, Users } from "lucide-react";
import { toast } from "sonner";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";

const VendorProfilePage = () => {
  const [profileData, setProfileData] = useState({
    companyName: "Rapid Plumbers",
    companyBio: "Rapid Plumbers provides 24/7 emergency plumbing services, leak detection, drain cleaning, and water heater installations. We are committed to fast, reliable, and high-quality service.",
    contactEmail: "info@rapidplumbers.com",
    contactPhone: "(555) 123-4567",
    website: "https://www.rapidplumbers.com",
    address: "123 Main Street, Anytown, ST 12345",
    businessHours: "24/7 Emergency Service",
    yearsInBusiness: "15",
    teamSize: "12",
    serviceAreas: ["Downtown", "Suburbs", "Industrial District"],
  });


  const handleSaveProfile = () => {
    toast.success("Company profile saved successfully!");
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addServiceArea = () => {
    const newArea = prompt("Enter new service area:");
    if (newArea && !profileData.serviceAreas.includes(newArea)) {
      setProfileData(prev => ({
        ...prev,
        serviceAreas: [...prev.serviceAreas, newArea]
      }));
    }
  };

  const removeServiceArea = (area: string) => {
    setProfileData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter(a => a !== area)
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your business information and how customers see your company.
          </p>
        </div>
        <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Your company's core details that customers will see first.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company-name">Company Name *</Label>
                <Input
                  id="company-name"
                  type="text"
                  placeholder="Your Company Name"
                  value={profileData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="company-bio">Company Description *</Label>
                <Textarea
                  id="company-bio"
                  placeholder="Tell customers about your company and what makes you special..."
                  rows={4}
                  value={profileData.companyBio}
                  onChange={(e) => handleInputChange('companyBio', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                Contact Information
              </CardTitle>
              <CardDescription>
                How customers can reach you for inquiries and bookings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-email">Business Email *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="contact@yourcompany.com"
                    value={profileData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Phone Number *</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={profileData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="company-website">Website URL</Label>
                <Input
                  id="company-website"
                  type="url"
                  placeholder="https://www.yourcompany.com"
                  value={profileData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="business-address">Business Address</Label>
                <Input
                  id="business-address"
                  type="text"
                  placeholder="123 Main Street, City, State, ZIP"
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Business Details
              </CardTitle>
              <CardDescription>
                Additional information that builds trust with customers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business-hours">Business Hours</Label>
                  <Input
                    id="business-hours"
                    type="text"
                    placeholder="Mon-Fri 9AM-5PM"
                    value={profileData.businessHours}
                    onChange={(e) => handleInputChange('businessHours', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="years-in-business">Years in Business</Label>
                  <Input
                    id="years-in-business"
                    type="text"
                    placeholder="5"
                    value={profileData.yearsInBusiness}
                    onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="team-size">Team Size</Label>
                <Input
                  id="team-size"
                  type="text"
                  placeholder="5"
                  value={profileData.teamSize}
                  onChange={(e) => handleInputChange('teamSize', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Profile Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">{profileData.companyName}</h3>
                <p className="text-sm text-gray-600">Professional Service Provider</p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profileData.yearsInBusiness} years in business</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profileData.teamSize} team members</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Multiple service areas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Service Areas
              </CardTitle>
              <CardDescription>
                Areas where you provide services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {profileData.serviceAreas.map((area, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100 hover:text-red-700"
                    onClick={() => removeServiceArea(area)}
                  >
                    {area} ×
                  </Badge>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addServiceArea}
                className="w-full"
              >
                Add Service Area
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/vendor-portal/services">
                  <Building className="mr-2 h-4 w-4" />
                  Manage Services
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/vendor-portal/referrals">
                  <Award className="mr-2 h-4 w-4" />
                  View Referrals
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/vendor-portal/subscription">
                  <Users className="mr-2 h-4 w-4" />
                  Subscription
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorProfilePage;