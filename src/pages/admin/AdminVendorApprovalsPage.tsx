import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle, XCircle, Users, Clock, Search, Filter, Eye, UserCheck, AlertTriangle, SlidersHorizontal, X, CreditCard, Edit } from "lucide-react";
import { VendorDetailsModal } from "@/components/modals/VendorDetailsModal";
import { BulkActionsModal } from "@/components/modals/BulkActionsModal";
import { VendorSubscriptionModal } from "@/components/modals/VendorSubscriptionModal";
import { ViewEditVendorModal } from "@/components/modals/ViewEditVendorModal";

const mockAllVendors = [
  { id: "v001", name: "Rapid Plumbers", email: "rapid@example.com", status: "Active", services: "Plumbing", phone: "(555) 123-4567", location: "New York, NY" },
  { id: "v002", name: "Brush Strokes Pro", email: "brush@example.com", status: "Active", services: "Painting", phone: "(555) 234-5678", location: "Los Angeles, CA" },
  { id: "v003", name: "Certified Inspectors Inc.", email: "inspect@example.com", status: "Active", services: "Inspections", phone: "(555) 345-6789", location: "Chicago, IL" },
  { id: "v004", name: "Green Thumb Landscaping", email: "green@example.com", status: "Active", services: "Landscaping", phone: "(555) 456-7890", location: "Austin, TX" },
  { id: "v005", name: "Sparky Electric", email: "sparky@example.com", status: "Suspended", services: "Electrical", phone: "(555) 567-8901", location: "Miami, FL" },
  { id: "v006", name: "Climate Control Experts", email: "climate@example.com", status: "Active", services: "HVAC", phone: "(555) 678-9012", location: "Phoenix, AZ" },
];

const mockPendingVendorApplications = [
  { id: "p001", name: "Clean Sweep Services", email: "clean@example.com", services: "Cleaning", phone: "(555) 111-2222", location: "Seattle, WA" },
  { id: "p002", name: "Move It Right", email: "move@example.com", services: "Moving", phone: "(555) 222-3333", location: "Denver, CO" },
  { id: "p003", name: "Quick Fix Handyman", email: "fixit@example.com", services: "General Repair", phone: "(555) 333-4444", location: "Boston, MA" },
];

const AdminVendorApprovalsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState("all");

  // Modal states
  const [isVendorDetailsOpen, setIsVendorDetailsOpen] = useState(false);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isEditVendorOpen, setIsEditVendorOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  // Data states
  const [vendors, setVendors] = useState(mockAllVendors);
  const [pendingApplications, setPendingApplications] = useState(mockPendingVendorApplications);

  const handleApproveVendor = (vendorId: string) => {
    const vendor = pendingApplications.find(v => v.id === vendorId);
    if (vendor) {
      // Move from pending to active vendors
      const newVendor = { ...vendor, status: "Active" };
      setVendors(prev => [...prev, newVendor]);
      setPendingApplications(prev => prev.filter(v => v.id !== vendorId));
      toast.success(`Approved ${vendor.name}.`);
    }
  };

  const handleRejectVendor = (vendorId: string) => {
    const vendor = pendingApplications.find(v => v.id === vendorId);
    if (vendor) {
      setPendingApplications(prev => prev.filter(v => v.id !== vendorId));
      toast.error(`Rejected ${vendor.name}.`);
    }
  };

  const handleViewVendorDetails = (vendor: any, isPending = false) => {
    setSelectedVendor(vendor);
    setIsVendorDetailsOpen(true);
  };

  const handleEditVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setModalMode('edit');
    setIsEditVendorOpen(true);
  };

  const handleBulkActions = () => {
    setIsBulkActionsOpen(true);
  };

  const handleSubscriptionPlans = (vendor?: any) => {
    setSelectedVendor(vendor);
    setIsSubscriptionOpen(true);
  };

  const handleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setLocationFilter("all");
    toast.info("All filters cleared");
  };

  const handleBulkAction = (action: string, vendorIds: string[]) => {
    // Update vendor statuses based on action
    setVendors(prev => prev.map(vendor => {
      if (vendorIds.includes(vendor.id)) {
        switch (action) {
          case "approve":
            return { ...vendor, status: "Active" };
          case "suspend":
            return { ...vendor, status: "Suspended" };
          case "activate":
            return { ...vendor, status: "Active" };
          case "delete":
            return null; // Will be filtered out
          default:
            return vendor;
        }
      }
      return vendor;
    }).filter(Boolean) as any[]);

    if (action === "delete") {
      // Remove deleted vendors
      setVendors(prev => prev.filter(vendor => !vendorIds.includes(vendor.id)));
    }
  };

  const handleUpdateSubscription = (_vendorId: string, _planId: string) => {
    // Subscription functionality removed
    toast.info("Subscription management has been removed");
  };

  const handleUpdateVendor = (updatedVendor: any) => {
    setVendors(prev => prev.map(vendor =>
      vendor.id === updatedVendor.id ? updatedVendor : vendor
    ));
  };

  // Filter vendors based on current filters
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = searchTerm === "" ||
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.services.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || vendor.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesLocation = locationFilter === "all" || vendor.location?.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Calculate stats based on filtered data
  const activeVendors = vendors.filter(v => v.status === "Active").length;
  const suspendedVendors = vendors.filter(v => v.status === "Suspended").length;
  const pendingApplicationsCount = pendingApplications.length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600 mt-2">
            Oversee all vendors across the marketplace and manage new applications
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" onClick={handleAdvancedFilters}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSubscriptionPlans()}>
            <CreditCard className="h-4 w-4 mr-2" />
            Subscription Plans
          </Button>
          <Button onClick={handleBulkActions} className="bg-purple-600 hover:bg-purple-700" size="sm">
            <UserCheck className="h-4 w-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                <p className="text-2xl font-bold text-gray-900">{activeVendors}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                <p className="text-2xl font-bold text-gray-900">{pendingApplicationsCount}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-gray-900">{suspendedVendors}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Vendors Table */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" /> All Registered Vendors
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Manage and monitor all vendors currently in the system
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4 mb-6">
            {/* Basic Filters */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex flex-col sm:flex-row w-full lg:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative flex-grow lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                {/* <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    <SelectItem value="TechCorp Solutions">TechCorp Solutions</SelectItem>
                    <SelectItem value="HomeServices Pro">HomeServices Pro</SelectItem>
                    <SelectItem value="Local Connect">Local Connect</SelectItem>
                    <SelectItem value="ServiceHub Inc">ServiceHub Inc</SelectItem>
                    <SelectItem value="QuickFix Network">QuickFix Network</SelectItem>
                  </SelectContent>
                </Select> */}
                {(searchTerm || statusFilter !== "all" || locationFilter !== "all") && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Advanced Filters</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowAdvancedFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Location</label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="new york">New York, NY</SelectItem>
                        <SelectItem value="los angeles">Los Angeles, CA</SelectItem>
                        <SelectItem value="chicago">Chicago, IL</SelectItem>
                        <SelectItem value="austin">Austin, TX</SelectItem>
                        <SelectItem value="miami">Miami, FL</SelectItem>
                        <SelectItem value="phoenix">Phoenix, AZ</SelectItem>
                        <SelectItem value="seattle">Seattle, WA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Vendor Name</TableHead>
                  <TableHead className="font-semibold text-gray-900">Email</TableHead>
                  <TableHead className="font-semibold text-gray-900">Services</TableHead>
                  <TableHead className="font-semibold text-gray-900">Location</TableHead>
                  <TableHead className="font-semibold text-gray-900">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor, index) => (
                  <TableRow
                    key={vendor.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}
                  >
                    <TableCell className="font-medium text-gray-900">{vendor.name}</TableCell>
                    <TableCell className="text-gray-600">{vendor.email}</TableCell>
                    <TableCell className="text-gray-700">{vendor.services}</TableCell>
                    <TableCell className="text-gray-600">{vendor.location}</TableCell>
                    <TableCell>
                      <Badge
                        variant={vendor.status === "Active" ? "default" : "destructive"}
                        className={`${
                          vendor.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                          'bg-red-100 text-red-800 hover:bg-red-100'
                        }`}
                      >
                        {vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          onClick={() => handleViewVendorDetails(vendor)}
                          variant="ghost"
                          size="sm"
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          onClick={() => handleEditVendor(vendor)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleSubscriptionPlans(vendor)}
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          Plan
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pending Applications */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" /> Pending Vendor Applications
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Review and decide on new vendor applications requiring approval
              </CardDescription>
            </div>
            {pendingApplicationsCount > 0 && (
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                {pendingApplicationsCount} pending
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {pendingApplications.length > 0 ? (
            <div className="space-y-4">
              {pendingApplications.map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{vendor.name}</h3>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="font-medium mr-2">Email:</span> {vendor.email}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="font-medium mr-2">Services:</span> {vendor.services}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="font-medium mr-2">Location:</span> {vendor.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-4 lg:mt-0">
                    <Button
                      onClick={() => handleViewVendorDetails(vendor, true)}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Review Details
                    </Button>
                    <Button
                      onClick={() => handleApproveVendor(vendor.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRejectVendor(vendor.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">No pending vendor applications</p>
              <p className="text-gray-500 text-sm mt-1">All vendor applications have been reviewed</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <VendorDetailsModal
        isOpen={isVendorDetailsOpen}
        onClose={() => setIsVendorDetailsOpen(false)}
        vendor={selectedVendor}
        onApprove={handleApproveVendor}
        onReject={handleRejectVendor}
        isPending={selectedVendor && pendingApplications.some(p => p.id === selectedVendor.id)}
      />
      <BulkActionsModal
        isOpen={isBulkActionsOpen}
        onClose={() => setIsBulkActionsOpen(false)}
        vendors={vendors}
        onBulkAction={handleBulkAction}
      />
      <VendorSubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        vendor={selectedVendor}
        onUpdateSubscription={handleUpdateSubscription}
      />
      <ViewEditVendorModal
        isOpen={isEditVendorOpen}
        onClose={() => setIsEditVendorOpen(false)}
        vendor={selectedVendor}
        mode={modalMode}
        onUpdate={handleUpdateVendor}
      />
    </div>
  );
};

export default AdminVendorApprovalsPage;