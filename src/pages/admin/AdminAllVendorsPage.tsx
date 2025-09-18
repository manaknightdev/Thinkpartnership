import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AddVendorModal } from "@/components/modals/AddVendorModal";
import { ViewEditVendorModal } from "@/components/modals/ViewEditVendorModal";
import AdminAPI from '@/services/AdminAPI';
import { showError, showSuccess } from '@/utils/toast';
import {
  Search,
  Filter,
  Eye,
  Users,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  MoreHorizontal,
  Edit,
  Ban,
  CheckCircle,
  AlertTriangle,

  Plus,
  X,
  SlidersHorizontal,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockVendors = [
  {
    id: "v001",
    name: "Rapid Plumbers",
    email: "contact@rapidplumbers.com",
    phone: "+1 (555) 111-2222",
    location: "New York, NY",
    status: "Active",
    services: "Plumbing, Emergency Repairs",

    totalJobs: 245,
    revenue: "$85,000",
    joinDate: "2023-02-15",
    lastActive: "2024-01-11"
  },
  {
    id: "v002",
    name: "Brush Strokes Pro",
    email: "info@brushstrokes.com",
    phone: "+1 (555) 222-3333",
    location: "Los Angeles, CA",
    status: "Active",
    services: "Interior Painting, Exterior Painting",

    totalJobs: 189,
    revenue: "$72,000",
    joinDate: "2023-01-20",
    lastActive: "2024-01-10"
  },
  {
    id: "v003",
    name: "Certified Inspectors Inc.",
    email: "admin@certifiedinspectors.com",
    phone: "+1 (555) 333-4444",
    location: "Chicago, IL",
    status: "Active",
    services: "Home Inspections, Commercial Inspections",
    totalJobs: 156,
    revenue: "$68,000",
    joinDate: "2023-03-10",
    lastActive: "2024-01-09"
  },
  {
    id: "v004",
    name: "Green Thumb Landscaping",
    email: "contact@greenthumb.com",
    phone: "+1 (555) 444-5555",
    location: "Austin, TX",
    status: "Suspended",
    services: "Landscaping, Lawn Care",
    totalJobs: 98,
    revenue: "$45,000",
    joinDate: "2023-04-05",
    lastActive: "2023-12-20"
  },
  {
    id: "v005",
    name: "Sparky Electric",
    email: "service@sparkyelectric.com",
    phone: "+1 (555) 555-6666",
    location: "Miami, FL",
    status: "Pending",
    services: "Electrical Repairs, Installations",
    totalJobs: 67,
    revenue: "$38,000",
    joinDate: "2023-11-15",
    lastActive: "2024-01-08"
  },
  {
    id: "v006",
    name: "Climate Control Experts",
    email: "info@climatecontrol.com",
    phone: "+1 (555) 666-7777",
    location: "Phoenix, AZ",
    status: "Active",
    services: "HVAC, Air Conditioning",
    totalJobs: 134,
    revenue: "$58,000",
    joinDate: "2023-05-22",
    lastActive: "2024-01-11"
  }
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Active":
      return "default";
    case "Pending":
      return "secondary";
    case "Suspended":
      return "destructive";
    default:
      return "outline";
  }
};

const AdminAllVendorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 20
  });

  const [serviceFilter, setServiceFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  useEffect(() => {
    fetchVendors();
  }, [searchTerm, statusFilter, locationFilter, serviceFilter, pagination.current_page]);

  const fetchVendors = async () => {
    try {
      setIsLoading(true);

      const params = {
        page: pagination.current_page,
        limit: pagination.per_page,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(locationFilter !== 'all' && { location: locationFilter }),
        ...(serviceFilter !== 'all' && { service: serviceFilter })
      };

      const response = await AdminAPI.getAllVendors(params);

      if (response.error) {
        showError(response.message || 'Failed to fetch vendors');
      } else {
        setVendors(response.vendors || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      showError('Failed to load vendors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setModalMode('view');
    setIsViewEditModalOpen(true);
  };

  const handleEditVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setModalMode('edit');
    setIsViewEditModalOpen(true);
  };

  const handleSuspendVendor = async (vendor: any) => {
    try {
      const response = await AdminAPI.suspendVendor(vendor.id, 'Suspended by admin');
      if (response.error) {
        showError(response.message || 'Failed to suspend vendor');
      } else {
        showSuccess(`${vendor.name} has been suspended successfully`);
        fetchVendors(); // Refresh the list
      }
    } catch (error: any) {
      console.error('Error suspending vendor:', error);
      showError(error.response?.data?.message || 'Failed to suspend vendor');
    }
  };

  const handleApproveVendor = (vendorName: string) => {
    toast.success(`Approving ${vendorName}...`);
    // In a real app, this would make an API call to approve the vendor
  };

  const handleAddNewVendor = () => {
    setIsAddModalOpen(true);
  };

  const handleAddVendor = (newVendor: any) => {
    setVendors(prev => [...prev, newVendor]);
  };

  const handleUpdateVendor = (updatedVendor: any) => {
    setVendors(prev => prev.map(vendor =>
      vendor.id === updatedVendor.id ? updatedVendor : vendor
    ));
  };

  const handleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setLocationFilter("all");

    setServiceFilter("all");
    toast.info("All filters cleared");
  };

  const handleExportData = async () => {
    try {
      toast.info("Preparing vendors data export...");

      // Create CSV content
      const headers = ['Vendor Name', 'Email', 'Phone', 'Location', 'Services', 'Status', 'Rating', 'Orders', 'Revenue', 'Join Date'];
      const csvContent = [
        headers.join(','),
        ...filteredVendors.map(vendor => [
          `"${vendor.name}"`,
          `"${vendor.email}"`,
          `"${vendor.phone || 'N/A'}"`,
          `"${vendor.location || 'N/A'}"`,
          `"${vendor.services || 'N/A'}"`,
          `"${vendor.status}"`,
          vendor.rating || 'N/A',
          vendor.orders || 0,
          `"${vendor.totalRevenue || '$0'}"`,
          `"${vendor.joinDate ? new Date(vendor.joinDate).toLocaleDateString() : 'N/A'}"`
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `vendors-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccess('Vendors data exported successfully!');
    } catch (error) {
      console.error('Error exporting vendors data:', error);
      showError('Failed to export vendors data. Please try again.');
    }
  };

  // Use vendors directly since filtering is done server-side via API
  const filteredVendors = vendors.length > 0 ? vendors : mockVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vendor.services && vendor.services.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || vendor.status.toLowerCase() === statusFilter;
    const matchesLocation = locationFilter === "all" || (vendor.location && vendor.location.toLowerCase().includes(locationFilter.toLowerCase()));

    const matchesService = serviceFilter === "all" || (vendor.services && vendor.services.toLowerCase().includes(serviceFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesLocation && matchesService;
  });

  // Calculate summary stats based on filtered data
  const totalVendors = filteredVendors.length;
  const activeVendors = filteredVendors.filter(v => v.status === "Active").length;
  const pendingVendors = filteredVendors.filter(v => v.status === "Pending").length;
  const suspendedVendors = filteredVendors.filter(v => v.status === "Suspended").length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Vendors</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive view of all vendors in the platform
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" onClick={handleAdvancedFilters}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Users className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <Button onClick={handleAddNewVendor} className="bg-purple-600 hover:bg-purple-700" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New Vendor
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
                <p className="text-2xl font-bold text-gray-900">{totalVendors}</p>
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
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">{pendingVendors}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
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

      {/* Vendors Table */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Vendor Directory</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Complete list of all vendors across marketplaces
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                {/* <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    <SelectItem value="techcorp">TechCorp Solutions</SelectItem>
                    <SelectItem value="homeservices">HomeServices Pro</SelectItem>
                    <SelectItem value="localconnect">Local Connect</SelectItem>
                    <SelectItem value="servicehub">ServiceHub Inc</SelectItem>
                    <SelectItem value="quickfix">QuickFix Network</SelectItem>
                  </SelectContent>
                </Select> */}
                {(searchTerm || statusFilter !== "all" || locationFilter !== "all" || serviceFilter !== "all") && (
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Service Type</label>
                    <Select value={serviceFilter} onValueChange={setServiceFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Services" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="painting">Painting</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="hvac">HVAC</SelectItem>
                        <SelectItem value="landscaping">Landscaping</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="max-h-[600px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-gray-50 z-10">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-900">Vendor Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Contact Info</TableHead>
                    <TableHead className="font-semibold text-gray-900">Client</TableHead>
                    <TableHead className="font-semibold text-gray-900">Services</TableHead>
                    <TableHead className="font-semibold text-gray-900">Jobs</TableHead>
                    <TableHead className="font-semibold text-gray-900">Revenue</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                          <span className="text-gray-500">Loading vendors...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredVendors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="text-gray-500">
                          {searchTerm || statusFilter !== 'all' || locationFilter !== 'all' || serviceFilter !== 'all'
                            ? 'No vendors found matching your filters.'
                            : 'No vendors found.'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVendors.map((vendor, index) => (
                    <TableRow
                      key={vendor.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      }`}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{vendor.name}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {vendor.location}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-1" />
                            {vendor.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {vendor.phone}
                          </div>
                        </div>
                      </TableCell>

                      {/* Client Column */}
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {vendor.client_name}
                          </p>
                          {vendor.client_email && (
                            <p className="text-xs text-gray-500">{vendor.client_email}</p>
                          )}
                          {!vendor.client_id && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              Independent
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="text-sm text-gray-700 max-w-xs truncate" title={vendor.services}>
                          {vendor.services}
                        </p>
                      </TableCell>
                      <TableCell className="text-gray-900 font-medium">{vendor.totalJobs}</TableCell>
                      <TableCell className="text-gray-900 font-semibold">{vendor.revenue}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(vendor.status)}
                          className={`${
                            vendor.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                            vendor.status === 'Pending' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                            'bg-red-100 text-red-800 hover:bg-red-100'
                          }`}
                        >
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewVendor(vendor)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditVendor(vendor)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Vendor
                            </DropdownMenuItem>
                            {vendor.status === 'Pending' && (
                              <DropdownMenuItem onClick={() => handleApproveVendor(vendor.name)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleSuspendVendor(vendor)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend Vendor
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing {filteredVendors.length} of {pagination.total_count} vendors
              {(searchTerm || statusFilter !== "all" || locationFilter !== "all" || serviceFilter !== "all") &&
                <span className="text-purple-600 font-medium"> (filtered)</span>
              }
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-purple-600 text-white hover:bg-purple-700">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddVendorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddVendor}
      />
      <ViewEditVendorModal
        isOpen={isViewEditModalOpen}
        onClose={() => setIsViewEditModalOpen(false)}
        vendor={selectedVendor}
        mode={modalMode}
        onUpdate={handleUpdateVendor}
      />
    </div>
  );
};

export default AdminAllVendorsPage;
