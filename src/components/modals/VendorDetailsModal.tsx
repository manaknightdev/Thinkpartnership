import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Star, 
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from "lucide-react";

interface VendorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: any;
  onApprove?: (vendorId: string) => void;
  onReject?: (vendorId: string) => void;
  isPending?: boolean;
}

export const VendorDetailsModal: React.FC<VendorDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  vendor, 
  onApprove,
  onReject,
  isPending = false
}) => {
  if (!vendor) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Pending":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "Suspended":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Mock additional vendor details for pending applications
  const vendorDetails = {
    businessAddress: "123 Service Street, Business City, BC 12345",
    businessType: "LLC",
    yearsInBusiness: "5",
    licenseNumber: "LIC-2024-001",
    insuranceProvider: "Business Insurance Co.",
    emergencyContact: "Jane Doe - (555) 987-6543",
    serviceAreas: ["Downtown", "Suburbs", "Industrial District"],
    certifications: ["Licensed Plumber", "Emergency Response Certified", "Safety Training Complete"],
    references: [
      { name: "ABC Corp", contact: "(555) 111-2222", relationship: "Previous Client" },
      { name: "XYZ Services", contact: "(555) 333-4444", relationship: "Business Partner" }
    ],
    equipment: ["Professional Tools", "Emergency Equipment", "Safety Gear"],
    availability: "24/7 Emergency Service",
    pricing: "Competitive rates with transparent pricing",
    ...vendor
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            {isPending ? 'Vendor Application Details' : 'Vendor Profile'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isPending ? 'Review vendor application and supporting documentation' : 'Complete vendor information and performance metrics'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="business">Business Details</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{vendorDetails.name}</p>
                      <p className="text-sm text-gray-600">Business Name</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{vendorDetails.email}</p>
                      <p className="text-sm text-gray-600">Primary Email</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{vendorDetails.phone || "(555) 123-4567"}</p>
                      <p className="text-sm text-gray-600">Business Phone</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{vendorDetails.businessAddress}</p>
                      <p className="text-sm text-gray-600">Business Address</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Service Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{vendorDetails.client}</p>
                      <p className="text-sm text-gray-600">Client Marketplace</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{vendorDetails.services}</p>
                      <p className="text-sm text-gray-600">Services Offered</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{vendorDetails.availability}</p>
                      <p className="text-sm text-gray-600">Availability</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{vendorDetails.pricing}</p>
                      <p className="text-sm text-gray-600">Pricing Structure</p>
                    </div>
                  </div>
                  {!isPending && (
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(vendorDetails.status)}>
                        {vendorDetails.status}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Business Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Business Type</p>
                    <p className="text-gray-900">{vendorDetails.businessType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Years in Business</p>
                    <p className="text-gray-900">{vendorDetails.yearsInBusiness} years</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">License Number</p>
                    <p className="text-gray-900">{vendorDetails.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Insurance Provider</p>
                    <p className="text-gray-900">{vendorDetails.insuranceProvider}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Emergency Contact</p>
                    <p className="text-gray-900">{vendorDetails.emergencyContact}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Certifications & Equipment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Service Areas</p>
                    <div className="flex flex-wrap gap-2">
                      {vendorDetails.serviceAreas.map((area: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Certifications</p>
                    <div className="space-y-1">
                      {vendorDetails.certifications.map((cert: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-900">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Equipment</p>
                    <div className="space-y-1">
                      {vendorDetails.equipment.map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-900">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">References</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vendorDetails.references.map((ref: any, index: number) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <p className="font-medium text-gray-900">{ref.name}</p>
                      <p className="text-sm text-gray-600">{ref.contact}</p>
                      <p className="text-xs text-gray-500">{ref.relationship}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {!isPending ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      Rating
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-2xl font-bold text-gray-900">{vendorDetails.rating || "4.8"}</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Total Jobs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-2xl font-bold text-gray-900">{vendorDetails.totalJobs || "127"}</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      Total Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-2xl font-bold text-gray-900">{vendorDetails.revenue || "$45,230"}</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      Join Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm font-medium text-gray-900">{vendorDetails.joinDate || "2023-06-15"}</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium">Performance data not available</p>
                <p className="text-gray-500 text-sm mt-1">Performance metrics will be available after vendor approval</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-3">
          {isPending && onApprove && onReject ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="outline"
                onClick={() => onReject(vendor.id)}
                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => onApprove(vendor.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
