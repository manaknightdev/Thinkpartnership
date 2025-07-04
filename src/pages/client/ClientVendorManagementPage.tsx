import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Users, UserPlus, Search, Eye, Edit, CheckCircle, XCircle, Download, Filter, Mail, Phone, MapPin, Calendar, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

import ClientAPI, { ClientVendor } from '@/services/ClientAPI';
import { showSuccess, showError } from '@/utils/toast';

const ClientVendorManagementPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<ClientVendor | null>(null);
  const [isViewVendorOpen, setIsViewVendorOpen] = useState(false);
  const [isEditVendorOpen, setIsEditVendorOpen] = useState(false);
  const [isAllVendorsOpen, setIsAllVendorsOpen] = useState(false);
  const [isAllApplicationsOpen, setIsAllApplicationsOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ClientVendor>>({});
  const [vendors, setVendors] = useState<ClientVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const data = await ClientAPI.getVendors();
      setVendors(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load vendors';
      setError(errorMessage);
      showError(errorMessage);
      setVendors([]); // Ensure vendors is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (vendorId: string, newStatus: string) => {
    try {
      await ClientAPI.updateVendorStatus(vendorId, newStatus);
      showSuccess(`Vendor status updated to ${newStatus}`);
      fetchVendors(); // Refresh the list
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update vendor status';
      showError(errorMessage);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };







  const handleViewVendor = (vendor: ClientVendor) => {
    setSelectedVendor(vendor);
    setIsViewVendorOpen(true);
  };

  const handleEditVendor = (vendor: ClientVendor) => {
    setSelectedVendor(vendor);
    setEditForm(vendor);
    setIsEditVendorOpen(true);
  };

  const handleApproveVendor = async (vendorId: string, vendorName: string) => {
    try {
      await handleStatusUpdate(vendorId, 'active');
      toast.success(`Approved ${vendorName}.`);
    } catch (error) {
      toast.error(`Failed to approve ${vendorName}.`);
    }
  };

  const handleRejectVendor = async (vendorId: string, vendorName: string) => {
    try {
      await handleStatusUpdate(vendorId, 'rejected');
      toast.error(`Rejected ${vendorName}.`);
    } catch (error) {
      toast.error(`Failed to reject ${vendorName}.`);
    }
  };

  const handleReviewAllApplications = () => {
    setIsAllApplicationsOpen(true);
  };

  const handleViewAllVendors = () => {
    setIsAllVendorsOpen(true);
  };

  const handleSaveVendor = async () => {
    if (!selectedVendor || !editForm) return;

    try {
      await ClientAPI.updateVendor(selectedVendor.id, editForm);
      showSuccess("Vendor updated successfully!");
      setIsEditVendorOpen(false);
      fetchVendors(); // Refresh the list
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update vendor';
      showError(errorMessage);
    }
  };

  const filteredVendors = (vendors || []).filter(vendor =>
    vendor?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor?.contact_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingVendors = (vendors || []).filter(vendor => vendor?.status === 'pending');

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading vendors...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Vendors</h1>
        <p className="text-lg text-gray-700 mb-4">
          Review and manage the service providers in your marketplace.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => navigate("/client-portal/invites")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Vendors
          </Button>
          <Button variant="outline" onClick={handleReviewAllApplications}>
            Review All Applications
          </Button>
        </div>
      </div>

      <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            Vendor List
          </CardTitle>
          <CardDescription>View and search your current vendors.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search vendors by name, email, or services..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleViewAllVendors} variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              View All Vendors Report
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Jobs</TableHead>

                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{vendor.company_name}</TableCell>
                    <TableCell className="text-gray-600">{vendor.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {vendor.business_type || 'Service Provider'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {formatCurrency(vendor.total_revenue || 0)}
                    </TableCell>
                    <TableCell className="text-blue-600 font-semibold">
                      {vendor.completed_jobs || 0}
                    </TableCell>

                    <TableCell>
                      <Badge variant={vendor.status === "active" ? "default" : "destructive"}
                             className={vendor.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                        {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => handleViewVendor(vendor)} variant="ghost" size="sm" className="mr-1">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleEditVendor(vendor)} variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <UserPlus className="h-5 w-5 text-orange-600" />
            </div>
            Pending Approvals
            {pendingVendors.length > 0 && (
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                {pendingVendors.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Review new vendor applications.</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingVendors.length > 0 ? (
            <div className="space-y-4">
              {pendingVendors.map((vendor) => (
                <div key={vendor.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{vendor?.company_name || vendor?.contact_name}</p>
                    <p className="text-sm text-gray-500">{vendor?.email}</p>
                    <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                      {vendor?.services_count || 0} services
                    </Badge>
                  </div>
                  <div className="flex space-x-2 mt-3 sm:mt-0">
                    <Button
                      onClick={() => handleApproveVendor(vendor?.id, vendor?.company_name || vendor?.contact_name)}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRejectVendor(vendor?.id, vendor?.company_name || vendor?.contact_name)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">No pending vendor applications at this time.</p>
              <p className="text-sm text-gray-500 mt-1">New applications will appear here for your review.</p>
            </div>
          )}
        </CardContent>
      </Card>



      {/* View Vendor Dialog */}
      <Dialog open={isViewVendorOpen} onOpenChange={setIsViewVendorOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
            <DialogDescription>Complete information about this vendor.</DialogDescription>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Vendor Name</Label>
                    <p className="text-lg font-semibold">{selectedVendor.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {selectedVendor.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {selectedVendor.phone}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Address</Label>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {selectedVendor.address}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Services</Label>
                    <Badge className="bg-green-100 text-green-800">{selectedVendor.services}</Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <Badge variant={selectedVendor.status === "Active" ? "default" : "destructive"}>
                      {selectedVendor.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Join Date</Label>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(selectedVendor.joinDate).toLocaleDateString()}
                    </p>
                  </div>

                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-xl font-bold text-green-600">${selectedVendor.totalRevenue.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Completed Jobs</p>
                    <p className="text-xl font-bold text-blue-600">{selectedVendor.completedJobs}</p>
                  </CardContent>
                </Card>

              </div>

              {selectedVendor.description && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Description</Label>
                  <p className="text-gray-700 mt-1">{selectedVendor.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Dialog */}
      <Dialog open={isEditVendorOpen} onOpenChange={setIsEditVendorOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
            <DialogDescription>Update vendor information.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Vendor Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name || ""}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email || ""}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editForm.phone || ""}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-services">Services</Label>
                <Select value={editForm.services || ""} onValueChange={(value) => setEditForm({...editForm, services: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Painting">Painting</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Landscaping">Landscaping</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Moving">Moving</SelectItem>
                    <SelectItem value="Inspections">Inspections</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  value={editForm.address || ""}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editForm.status || ""} onValueChange={(value) => setEditForm({...editForm, status: value as "Active" | "Suspended" | "Inactive"})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  placeholder="Brief description of services..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditVendorOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveVendor} className="bg-green-600 hover:bg-green-700">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>





      {/* All Vendors Report Dialog */}
      <Dialog open={isAllVendorsOpen} onOpenChange={setIsAllVendorsOpen}>
        <DialogContent className="sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle>All Vendors Report</DialogTitle>
            <DialogDescription>Comprehensive report of all vendors in your marketplace.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Total Vendors</p>
                  <p className="text-2xl font-bold text-blue-600">{(vendors || []).length}</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${(vendors || []).reduce((sum, v) => sum + (v?.total_revenue || 0), 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {(vendors || []).reduce((sum, v) => sum + (v?.services_count || 0), 0)}
                  </p>
                </CardContent>
              </Card>

            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Jobs</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(vendors || []).map((vendor) => (
                    <TableRow key={vendor?.id}>
                      <TableCell className="font-medium">{vendor?.company_name || vendor?.contact_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{vendor?.services_count || 0} services</Badge>
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        ${(vendor?.total_revenue || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-blue-600 font-semibold">
                        {vendor?.services_count || 0}
                      </TableCell>

                      <TableCell>
                        <Badge variant={vendor?.status === "active" ? "default" : "destructive"}>
                          {vendor?.status || 'unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>{vendor?.created_at ? new Date(vendor.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* All Applications Dialog */}
      <Dialog open={isAllApplicationsOpen} onOpenChange={setIsAllApplicationsOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>All Vendor Applications</DialogTitle>
            <DialogDescription>Review all pending vendor applications.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {pendingVendors.length > 0 ? (
              pendingVendors.map((vendor) => (
                <Card key={vendor.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{vendor?.company_name || vendor?.contact_name}</h3>
                        <p className="text-gray-600 flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4" />
                          {vendor?.email}
                        </p>
                        {vendor?.phone && (
                          <p className="text-gray-600 flex items-center gap-2 mt-1">
                            <Phone className="h-4 w-4" />
                            {vendor.phone}
                          </p>
                        )}
                        <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200">
                          {vendor?.services_count || 0} services
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleApproveVendor(vendor?.id, vendor?.company_name || vendor?.contact_name)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectVendor(vendor?.id, vendor?.company_name || vendor?.contact_name)}
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No pending applications at this time.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientVendorManagementPage;