import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AddCustomerModal } from "@/components/modals/AddCustomerModal";
import { ViewEditCustomerModal } from "@/components/modals/ViewEditCustomerModal";
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
  ShoppingBag,
  MoreHorizontal,
  Edit,
  Ban,
  UserCheck,


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

// Mock data for available vendors
const mockAvailableVendors = [
  "Rapid Plumbers", "Certified Inspectors Inc.", "Climate Control Experts",
  "Brush Strokes Pro", "Green Thumb Landscaping", "Quick Fix Handyman",
  "Sparky Electric", "Move It Right"
];

const mockCustomers = [
  {
    id: "cu001",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    phone: "+1 (555) 111-1111",
    location: "New York, NY",

    vendor: "Rapid Plumbers",
    status: "Active",
    totalOrders: 12,
    totalSpent: "$3,450",

    joinDate: "2023-03-15",
    lastOrder: "2024-01-08",
    preferredServices: "Plumbing, HVAC"
  },
  {
    id: "cu002",
    name: "Bob Smith",
    email: "bob.smith@email.com",
    phone: "+1 (555) 222-2222",
    location: "Los Angeles, CA",

    vendor: "Brush Strokes Pro",
    status: "Active",
    totalOrders: 8,
    totalSpent: "$2,180",

    joinDate: "2023-05-20",
    lastOrder: "2024-01-10",
    preferredServices: "Painting, Landscaping"
  },
  {
    id: "cu003",
    name: "Carol Davis",
    email: "carol.davis@email.com",
    phone: "+1 (555) 333-3333",
    location: "Chicago, IL",

    vendor: "Certified Inspectors Inc.",
    status: "Active",
    totalOrders: 15,
    totalSpent: "$4,200",

    joinDate: "2023-01-10",
    lastOrder: "2024-01-11",
    preferredServices: "Home Inspection, Electrical"
  },
  {
    id: "cu004",
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+1 (555) 444-4444",
    location: "Austin, TX",

    vendor: "Green Thumb Landscaping",
    status: "Inactive",
    totalOrders: 3,
    totalSpent: "$890",

    joinDate: "2023-08-15",
    lastOrder: "2023-11-20",
    preferredServices: "Landscaping"
  },
  {
    id: "cu005",
    name: "Emma Brown",
    email: "emma.brown@email.com",
    phone: "+1 (555) 555-5555",
    location: "Miami, FL",

    vendor: "Sparky Electric",
    status: "Active",
    totalOrders: 6,
    totalSpent: "$1,650",

    joinDate: "2023-06-30",
    lastOrder: "2024-01-09",
    preferredServices: "Electrical, HVAC"
  },
  {
    id: "cu006",
    name: "Frank Miller",
    email: "frank.miller@email.com",
    phone: "+1 (555) 666-6666",
    location: "Phoenix, AZ",

    vendor: "Climate Control Experts",
    status: "Active",
    totalOrders: 9,
    totalSpent: "$2,750",

    joinDate: "2023-04-12",
    lastOrder: "2024-01-07",
    preferredServices: "HVAC, Plumbing"
  },
  {
    id: "cu007",
    name: "Grace Lee",
    email: "grace.lee@email.com",
    phone: "+1 (555) 777-7777",
    location: "Seattle, WA",

    vendor: "Rapid Plumbers",
    status: "Suspended",
    totalOrders: 2,
    totalSpent: "$420",

    joinDate: "2023-09-05",
    lastOrder: "2023-12-01",
    preferredServices: "Cleaning"
  }
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Active":
      return "default";
    case "Inactive":
      return "secondary";
    case "Suspended":
      return "destructive";
    default:
      return "outline";
  }
};

const AdminAllCustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 20
  });
  const [locationFilter, setLocationFilter] = useState("all");
  const [spendingFilter, setSpendingFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm, statusFilter, vendorFilter, locationFilter, spendingFilter, pagination.current_page]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);

      const params = {
        page: pagination.current_page,
        limit: pagination.per_page,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(vendorFilter !== 'all' && { vendor: vendorFilter }),
        ...(locationFilter !== 'all' && { location: locationFilter }),
        ...(spendingFilter !== 'all' && { spending: spendingFilter })
      };

      const response = await AdminAPI.getAllCustomers(params);

      if (response.error) {
        showError(response.message || 'Failed to fetch customers');
      } else {
        setCustomers(response.customers || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      showError('Failed to load customers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get available vendors
  const availableVendors = mockAvailableVendors;

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setModalMode('view');
    setIsViewEditModalOpen(true);
  };

  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setModalMode('edit');
    setIsViewEditModalOpen(true);
  };

  const handleSuspendCustomer = (customerName: string) => {
    toast.warning(`Suspending ${customerName}...`);
  };

  const handleActivateCustomer = (customerName: string) => {
    toast.success(`Activating ${customerName}...`);
  };

  const handleAddNewCustomer = () => {
    setIsAddModalOpen(true);
  };

  const handleAddCustomer = (newCustomer: any) => {
    setCustomers(prev => [...prev, newCustomer]);
  };

  const handleUpdateCustomer = (updatedCustomer: any) => {
    setCustomers(prev => prev.map(customer =>
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    ));
  };

  const handleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setVendorFilter("all");
    setLocationFilter("all");
    setSpendingFilter("all");
    toast.info("All filters cleared");
  };

  const handleExportData = async () => {
    try {
      toast.info("Preparing customers data export...");

      // Create CSV content
      const headers = ['Customer Name', 'Email', 'Phone', 'Status', 'Total Spent', 'Orders', 'Join Date', 'Last Order'];
      const csvContent = [
        headers.join(','),
        ...filteredCustomers.map(customer => {
          const customerName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'N/A';
          return [
            `"${customerName}"`,
            `"${customer.email}"`,
            `"${customer.phone || 'N/A'}"`,
            `"${customer.status === 0 ? 'Active' : customer.status === 1 ? 'Inactive' : 'Suspended'}"`,
            `"$${customer.total_spent || 0}"`,
            customer.completed_orders || 0,
            `"${customer.join_date ? new Date(customer.join_date).toLocaleDateString() : 'N/A'}"`,
            `"${customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : 'N/A'}"`
          ].join(',');
        })
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `customers-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccess('Customers data exported successfully!');
    } catch (error) {
      console.error('Error exporting customers data:', error);
      showError('Failed to export customers data. Please try again.');
    }
  };

  // Use customers directly since filtering is done server-side via API
  const filteredCustomers = customers.length > 0 ? customers : mockCustomers.filter(customer => {
    const customerName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim();
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ||
                         (statusFilter === "active" && customer.status === 0) ||
                         (statusFilter === "inactive" && customer.status === 1) ||
                         (statusFilter === "suspended" && customer.status === 2);
    const matchesVendor = vendorFilter === "all"; // Simplified for now
    const matchesLocation = locationFilter === "all"; // Simplified for now

    const spentAmount = customer.total_spent || 0;
    const matchesSpending = spendingFilter === "all" ||
                           (spendingFilter === "high" && spentAmount >= 3000) ||
                           (spendingFilter === "medium" && spentAmount >= 1500 && spentAmount < 3000) ||
                           (spendingFilter === "low" && spentAmount < 1500);

    return matchesSearch && matchesStatus && matchesVendor && matchesLocation && matchesSpending;
  });

  // Calculate summary stats based on filtered data
  const totalCustomers = filteredCustomers.length;
  const activeCustomers = filteredCustomers.filter(c => c.status === 0).length;
  const inactiveCustomers = filteredCustomers.filter(c => c.status === 1).length;
  const suspendedCustomers = filteredCustomers.filter(c => c.status === 2).length;
  const totalRevenue = filteredCustomers.reduce((sum, customer) => {
    const spent = typeof customer.total_spent === 'string'
      ? parseFloat(customer.total_spent) || 0
      : customer.total_spent || 0;
    return sum + spent;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Customers</h1>
          <p className="text-gray-600 mt-2">
            Complete overview of all customers in the platform
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" onClick={handleAdvancedFilters}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Users className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={handleAddNewCustomer} className="bg-purple-600 hover:bg-purple-700" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New Customer
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
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
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">{inactiveCustomers}</p>
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
                <p className="text-2xl font-bold text-gray-900">{suspendedCustomers}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Ban className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Customer Directory</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Complete list of all customers across marketplaces
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
                    placeholder="Search customers..."
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
                    <SelectItem value="inactive">Inactive</SelectItem>
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
                <Select
                  value={vendorFilter}
                  onValueChange={setVendorFilter}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    {availableVendors.map(vendor => (
                      <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(searchTerm || statusFilter !== "all" || vendorFilter !== "all" || locationFilter !== "all" || spendingFilter !== "all") && (
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Spending Level</label>
                    <Select value={spendingFilter} onValueChange={setSpendingFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Spending Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Spending Levels</SelectItem>
                        <SelectItem value="high">High Spenders ($3,000+)</SelectItem>
                        <SelectItem value="medium">Medium Spenders ($1,500-$2,999)</SelectItem>
                        <SelectItem value="low">Low Spenders (Under $1,500)</SelectItem>
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
                    <TableHead className="font-semibold text-gray-900">Customer Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Vendor</TableHead>
                    <TableHead className="font-semibold text-gray-900">Contact Info</TableHead>
                    <TableHead className="font-semibold text-gray-900">Orders</TableHead>
                    <TableHead className="font-semibold text-gray-900">Total Spent</TableHead>

                    <TableHead className="font-semibold text-gray-900">Last Order</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                          <span className="text-gray-500">Loading customers...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-gray-500">
                          {searchTerm || statusFilter !== 'all' || vendorFilter !== 'all' || locationFilter !== 'all' || spendingFilter !== 'all'
                            ? 'No customers found matching your filters.'
                            : 'No customers found.'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer, index) => (
                  <TableRow 
                    key={customer.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {`${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown User'}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {customer.email}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-700">Platform Customer</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-3 w-3 mr-1" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="font-medium text-gray-900">{customer.completed_orders || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900 font-semibold">
                      ${typeof customer.total_spent === 'string'
                        ? parseFloat(customer.total_spent || '0').toLocaleString()
                        : (customer.total_spent || 0).toLocaleString()}
                    </TableCell>

                    <TableCell className="text-gray-600">
                      {customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={customer.status === 0 ? "default" : "secondary"}
                        className={`${
                          customer.status === 0 ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                          'bg-orange-100 text-orange-800 hover:bg-orange-100'
                        }`}
                      >
                        {customer.status === 0 ? 'Active' : 'Inactive'}
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
                          <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Customer
                          </DropdownMenuItem>
                          {customer.status === 'Inactive' && (
                            <DropdownMenuItem onClick={() => handleActivateCustomer(customer.name)}>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleSuspendCustomer(customer.name)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend Customer
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
              Showing {filteredCustomers.length} of {pagination.total_count} customers
              {(searchTerm || statusFilter !== "all" || vendorFilter !== "all" || locationFilter !== "all" || spendingFilter !== "all") &&
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
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCustomer}
      />
      <ViewEditCustomerModal
        isOpen={isViewEditModalOpen}
        onClose={() => setIsViewEditModalOpen(false)}
        customer={selectedCustomer}
        mode={modalMode}
        onUpdate={handleUpdateCustomer}
      />
    </div>
  );
};

export default AdminAllCustomersPage;
