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

import ClientAPI, { ClientVendor } from '@/services/ClientAPI';
import { showSuccess, showError } from '@/utils/toast';

const ClientVendorManagementPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<ClientVendor | null>(null);
  const [isViewVendorOpen, setIsViewVendorOpen] = useState(false);
  const [isEditVendorOpen, setIsEditVendorOpen] = useState(false);
  const [isAllVendorsOpen, setIsAllVendorsOpen] = useState(false);

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

  // Normalize backend status values to UI values (active | suspended)
  const getUiStatus = (status?: string | number) => {
    const s = (status ?? '').toString().toLowerCase();
    if (s === '1' || s === 'active') return 'active';
    if (s === '2' || s === 'suspended' || s === 'inactive') return 'suspended';
    return 'active';
  };

  const getBadgeVariant = (status?: string | number) => {
    return getUiStatus(status) === 'active' ? 'default' : 'destructive';
  };







  const handleViewVendor = (vendor: ClientVendor) => {
    setSelectedVendor(vendor);
    setIsViewVendorOpen(true);
  };

  const handleEditVendor = (vendor: ClientVendor) => {
    setSelectedVendor(vendor);
    setEditForm({ status: getUiStatus(vendor.status) });
    setIsEditVendorOpen(true);
  };



  const handleViewAllVendors = () => {
    setIsAllVendorsOpen(true);
  };

  const handleSaveVendor = async () => {
    if (!selectedVendor) return;
    try {
      const selectedStatus = (editForm.status as string) || selectedVendor.status || '';
      const normalized = selectedStatus.toLowerCase();
      // Map UI values to backend expected integer strings
      const statusValue = normalized === 'active' ? '1' : normalized === 'suspended' ? '2' : '1';
      await ClientAPI.updateVendorStatus(selectedVendor.id, statusValue);
      showSuccess("Vendor status updated successfully!");
      setIsEditVendorOpen(false);
      fetchVendors();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update vendor status';
      showError(errorMessage);
    }
  };

  const filteredVendors = (vendors || []).filter(vendor =>
    vendor?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor?.contact_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );



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
                        {(vendor.services_count || 0) + ' services'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {formatCurrency(vendor.total_revenue || 0)}
                    </TableCell>
                    <TableCell className="text-blue-600 font-semibold">
                      {vendor.completed_jobs || 0}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={getBadgeVariant(vendor.status)}
                        className={getUiStatus(vendor.status) === 'suspended' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-primary/10 text-primary hover:bg-primary/10'}
                      >
                        {getUiStatus(vendor.status)}
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
                     <p className="text-lg font-semibold">{selectedVendor.company_name || selectedVendor.contact_name}</p>
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
                      N/A
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Services</Label>
                     <Badge className="bg-green-100 text-green-800">{(selectedVendor.services_count || 0) + ' services'}</Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                     <Badge variant={getBadgeVariant(selectedVendor.status)}>
                       {getUiStatus(selectedVendor.status)}
                     </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Join Date</Label>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                       {selectedVendor.join_date ? new Date(selectedVendor.join_date).toLocaleDateString() : (selectedVendor.created_at ? new Date(selectedVendor.created_at).toLocaleDateString() : 'N/A')}
                    </p>
                  </div>

                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Total Revenue</p>
                     <p className="text-xl font-bold text-primary">{typeof selectedVendor.total_revenue === 'number' ? selectedVendor.total_revenue.toLocaleString() : '0'}</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Completed Jobs</p>
                     <p className="text-xl font-bold text-blue-600">{selectedVendor.completed_jobs || 0}</p>
                  </CardContent>
                </Card>

              </div>

              {false && selectedVendor && (selectedVendor as any).description && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Description</Label>
                  <p className="text-gray-700 mt-1">{(selectedVendor as any).description}</p>
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
                <Label htmlFor="edit-name">Vendor</Label>
                <Input id="edit-name" value={selectedVendor?.company_name || selectedVendor?.contact_name || ''} disabled />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" value={selectedVendor?.email || ''} disabled />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input id="edit-phone" value={selectedVendor?.phone || ''} disabled />
              </div>
              <div>
                <Label htmlFor="edit-services">Services</Label>
                <Input id="edit-services" value={`${selectedVendor?.services_count || 0} services`} disabled />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-address">City</Label>
                <Input id="edit-address" value={'N/A'} disabled />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editForm.status || ''} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">active</SelectItem>
                    <SelectItem value="suspended">suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Notes removed per requirement */}
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
                        <Badge variant={getBadgeVariant(vendor?.status)}>
                          {getUiStatus(vendor?.status)}
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


    </div>
  );
};

export default ClientVendorManagementPage;