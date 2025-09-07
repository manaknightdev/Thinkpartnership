import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AddClientModal } from "@/components/modals/AddClientModal";
import { ViewEditClientModal } from "@/components/modals/ViewEditClientModal";
import AdminAPI from '@/services/AdminAPI';
import ClientAPI from '@/services/ClientAPI';
import { showError, showSuccess } from '@/utils/toast';
import {
  Search,
  Eye,
  Building,
  Users,
  Calendar,
  Mail,
  Phone,
  Globe,
  Settings,
  MoreHorizontal,
  Trash2,
  Plus,
  X,
  LogIn,
  Loader2,
  CheckCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const mockClients = [
  { 
    id: "c001", 
    name: "TechCorp Solutions", 
    email: "admin@techcorp.com", 
    phone: "+1 (555) 123-4567",
    website: "www.techcorp.com",
    status: "Active", 
    plan: "Enterprise",
    vendors: 25, 
    customers: 1200,
    totalRevenue: "$450,000",
    joinDate: "2023-01-15",
    lastActive: "2024-01-10"
  },
  // { 
  //   id: "c002", 
  //   name: "HomeServices Pro", 
  //   email: "contact@homeservices.com", 
  //   phone: "+1 (555) 234-5678",
  //   website: "www.homeservices.com",
  //   status: "Active", 
  //   plan: "Professional",
  //   vendors: 18, 
  //   customers: 850,
  //   totalRevenue: "$320,000",
  //   joinDate: "2023-03-22",
  //   lastActive: "2024-01-09"
  // },
  // { 
  //   id: "c003", 
  //   name: "Local Connect", 
  //   email: "info@localconnect.com", 
  //   phone: "+1 (555) 345-6789",
  //   website: "www.localconnect.com",
  //   status: "Suspended", 
  //   plan: "Basic",
  //   vendors: 8, 
  //   customers: 320,
  //   totalRevenue: "$85,000",
  //   joinDate: "2023-06-10",
  //   lastActive: "2023-12-15"
  // },
  // { 
  //   id: "c004", 
  //   name: "ServiceHub Inc", 
  //   email: "admin@servicehub.com", 
  //   phone: "+1 (555) 456-7890",
  //   website: "www.servicehub.com",
  //   status: "Active", 
  //   plan: "Professional",
  //   vendors: 22, 
  //   customers: 980,
  //   totalRevenue: "$380,000",
  //   joinDate: "2023-02-08",
  //   lastActive: "2024-01-11"
  // },
  // { 
  //   id: "c005", 
  //   name: "QuickFix Network", 
  //   email: "support@quickfix.com", 
  //   phone: "+1 (555) 567-8901",
  //   website: "www.quickfix.com",
  //   status: "Trial", 
  //   plan: "Trial",
  //   vendors: 5, 
  //   customers: 150,
  //   totalRevenue: "$12,000",
  //   joinDate: "2023-12-01",
  //   lastActive: "2024-01-11"
  // }
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Active":
      return "default";
    case "Pending":
      return "secondary";
    case "Invited":
      return "secondary";
    case "Suspended":
      return "destructive";
    case "Terminated":
      return "destructive";
    default:
      return "outline";
  }
};



const AdminAllClientsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [revenueFilter, setRevenueFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [joinDateFilter, setJoinDateFilter] = useState("all");
  const [clientSizeFilter, setClientSizeFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAsClientLoading, setLoginAsClientLoading] = useState<number | null>(null);
  const [suspendLoading, setSuspendLoading] = useState<number | null>(null);
  const [unsuspendLoading, setUnsuspendLoading] = useState<number | null>(null);
  const [terminateLoading, setTerminateLoading] = useState<number | null>(null);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [unsuspendModalOpen, setUnsuspendModalOpen] = useState(false);
  const [terminateModalOpen, setTerminateModalOpen] = useState(false);
  const [selectedClientForAction, setSelectedClientForAction] = useState<any>(null);
  const [actionReason, setActionReason] = useState('');

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 20
  });
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, [searchTerm, statusFilter, locationFilter, joinDateFilter, clientSizeFilter, pagination.current_page]);

  const fetchClients = async () => {
    try {
      setIsLoading(true);

      // Convert status filter to number for API
      const getStatusNumber = (status: string) => {
        switch (status) {
          case 'active': return 1;
          case 'pending': return 0;
          case 'suspended': return 2;
          case 'terminated': return 4;
          case 'invited': return 'invited'; // Special case for invitations
          default: return undefined;
        }
      };

      const params: any = {
        page: pagination.current_page,
        limit: pagination.per_page,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: getStatusNumber(statusFilter) })
      };

      const response = await AdminAPI.getAllClients(params);

      if (response.error) {
        showError('Failed to fetch clients');
      } else {
        // Transform API response to match expected format
        const transformedClients = (response.clients || []).map((client: any) => ({
          id: client.id,
          name: client.company_name || client.contact_name || 'N/A',
          email: client.email,
          phone: client.phone || 'N/A',
          website: client.custom_domain || `${client.marketplace_subdomain}.marketplace.com` || 'N/A',
          status: (() => {
            if (client.status === 99) return 'Invited'; // Special status for invitations
            switch (client.status) {
              case 1: return 'Active';
              case 0: return 'Pending';
              case 2: return 'Suspended';
              case 4: return 'Terminated';
              default: return 'Inactive';
            }
          })(),
          plan: 'Standard', // Remove plan references as requested
          vendors: client.total_vendors || 0,
          customers: client.total_customers || 0,
          totalRevenue: `$${parseFloat(client.total_revenue || 0).toFixed(2)}`,
          joinDate: client.join_date,
          businessType: client.business_type,
          city: client.city,
          province: client.province,
          commissionRate: client.commission_rate,
          subscription_status: client.status, // Keep original status for backend operations
          record_type: client.record_type, // Track whether it's registered or invitation
          invitation_id: client.invitation_id,
          expires_at: client.expires_at
        }));

        setClients(transformedClients);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      showError('Failed to load clients. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClient = (client: any) => {
    setSelectedClient(client);
    setIsViewEditModalOpen(true);
  };



  const handleSuspendClient = (client: any) => {
    setSelectedClientForAction(client);
    setActionReason('');
    setSuspendModalOpen(true);
  };

  const handleTerminateClient = (client: any) => {
    setSelectedClientForAction(client);
    setActionReason('');
    setTerminateModalOpen(true);
  };

  const handleUnsuspendClient = (client: any) => {
    setSelectedClientForAction(client);
    setUnsuspendModalOpen(true);
  };

  const confirmSuspendClient = async () => {
    if (!selectedClientForAction) return;

    try {
      setSuspendLoading(selectedClientForAction.id);
      const response = await AdminAPI.suspendClient(selectedClientForAction.id, actionReason);

      if (response.error) {
        showError(response.message || 'Failed to suspend client');
        return;
      }

      showSuccess(`${selectedClientForAction.company_name} has been suspended successfully`);
      setSuspendModalOpen(false);
      setSelectedClientForAction(null);
      setActionReason('');
      fetchClients(); // Refresh the list
    } catch (error: any) {
      console.error('Error suspending client:', error);
      showError(error.response?.data?.message || 'Failed to suspend client');
    } finally {
      setSuspendLoading(null);
    }
  };

  const confirmTerminateClient = async () => {
    if (!selectedClientForAction) return;

    try {
      setTerminateLoading(selectedClientForAction.id);
      const response = await AdminAPI.terminateClient(selectedClientForAction.id, actionReason);

      if (response.error) {
        showError(response.message || 'Failed to terminate client');
        return;
      }

      showSuccess(`${selectedClientForAction.company_name} has been terminated successfully`);
      setTerminateModalOpen(false);
      setSelectedClientForAction(null);
      setActionReason('');
      fetchClients(); // Refresh the list
    } catch (error: any) {
      console.error('Error terminating client:', error);
      showError(error.response?.data?.message || 'Failed to terminate client');
    } finally {
      setTerminateLoading(null);
    }
  };

  const confirmUnsuspendClient = async () => {
    if (!selectedClientForAction) return;

    try {
      setUnsuspendLoading(selectedClientForAction.id);
      const response = await AdminAPI.unsuspendClient(selectedClientForAction.id);

      if (response.error) {
        showError(response.message || 'Failed to unsuspend client');
        return;
      }

      showSuccess(`${selectedClientForAction.company_name} has been unsuspended successfully`);
      setUnsuspendModalOpen(false);
      setSelectedClientForAction(null);
      fetchClients(); // Refresh the list
    } catch (error: any) {
      console.error('Error unsuspending client:', error);
      showError(error.response?.data?.message || 'Failed to unsuspend client');
    } finally {
      setUnsuspendLoading(null);
    }
  };

  const handleLoginAsClient = async (client: any) => {
    try {
      setLoginAsClientLoading(client.id);
      showSuccess(`Logging in as ${client.name || client.company_name}...`);

      // Call admin API to get client authentication token
      const response = await AdminAPI.loginAsClient(client.id);

      if (response.error) {
        showError(response.message || 'Failed to login as client');
        return;
      }

      // Store client authentication data
      if (response.token && response.user) {
        ClientAPI.storeAuthData({
          error: false,
          message: 'Success',
          token: response.token,
          client_id: response.client_id?.toString(),
          user: response.user
        });
      }

      // Navigate to client portal
      navigate('/client-portal');
      showSuccess(`Successfully logged in as ${client.name || client.company_name}`);

    } catch (error: any) {
      console.error('Error logging in as client:', error);
      showError(error.response?.data?.message || 'Failed to login as client. Please try again.');
    } finally {
      setLoginAsClientLoading(null);
    }
  };

  const handleAddNewClient = () => {
    setIsAddModalOpen(true);
  };

  const handleAddClient = async (_newClient: any) => {
    // After admin creates a client, refresh from server so status reflects 'Pending'
    await fetchClients();
    setIsAddModalOpen(false);
  };

  const handleUpdateClient = (updatedClient: any) => {
    setClients(prev => prev.map(client =>
      client.id === updatedClient.id ? updatedClient : client
    ));
  };



  const handleExportData = async () => {
    try {
      toast.info("Preparing clients data export...");

      // Create CSV content
      const headers = ['Client Name', 'Email', 'Phone', 'Website', 'Status', 'Vendors', 'Customers', 'Revenue', 'Join Date'];
      const csvContent = [
        headers.join(','),
        ...filteredClients.map(client => [
          `"${client.name}"`,
          `"${client.email}"`,
          `"${client.phone}"`,
          `"${client.website}"`,
          `"${client.status}"`,
          client.vendors,
          client.customers,
          `"${client.totalRevenue}"`,
          `"${new Date(client.joinDate).toLocaleDateString()}"`
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `clients-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccess('Clients data exported successfully!');
    } catch (error) {
      console.error('Error exporting clients data:', error);
      showError('Failed to export clients data. Please try again.');
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRevenueFilter("all");
    setLocationFilter("all");
    setJoinDateFilter("all");
    setClientSizeFilter("all");
    toast.info("All filters cleared");
  };

  // Use clients directly since filtering is done server-side via API
  const filteredClients = clients.length > 0 ? clients : mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.website && client.website.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || client.status.toLowerCase() === statusFilter;

    const revenueAmount = client.totalRevenue ? parseFloat(client.totalRevenue.replace('$', '').replace(',', '')) : 0;
    const matchesRevenue = revenueFilter === "all" ||
                          (revenueFilter === "high" && revenueAmount >= 400000) ||
                          (revenueFilter === "medium" && revenueAmount >= 200000 && revenueAmount < 400000) ||
                          (revenueFilter === "low" && revenueAmount < 200000);

    // Additional filters for mock data (in real implementation, these would be handled server-side)
    const matchesLocation = locationFilter === "all"; // Simplified for mock data
    const matchesJoinDate = joinDateFilter === "all"; // Simplified for mock data
    const matchesClientSize = clientSizeFilter === "all" ||
                             (clientSizeFilter === "large" && client.vendors >= 50) ||
                             (clientSizeFilter === "medium" && client.vendors >= 10 && client.vendors < 50) ||
                             (clientSizeFilter === "small" && client.vendors >= 1 && client.vendors < 10) ||
                             (clientSizeFilter === "startup" && client.vendors === 0);

    return matchesSearch && matchesStatus && matchesRevenue && matchesLocation && matchesJoinDate && matchesClientSize;
  });

  // Calculate summary stats based on filtered data
  const totalClients = filteredClients.length;
  const activeClients = filteredClients.filter(c => c.status === "Active").length;
  const pendingClients = filteredClients.filter(c => c.status === "Pending").length;
  const invitedClients = filteredClients.filter(c => c.status === "Invited").length;
  const suspendedClients = filteredClients.filter(c => c.status === "Suspended").length;
  const terminatedClients = filteredClients.filter(c => c.status === "Terminated").length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client</h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor all client organizations across the platform
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          {/* <Button variant="outline" size="sm" onClick={handleAdvancedFilters}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button> */}
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Building className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={handleAddNewClient} className="bg-purple-600 hover:bg-purple-700" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Invite Client
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900">{activeClients}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Invited Clients</p>
                <p className="text-2xl font-bold text-gray-900">{invitedClients}</p>
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
                <p className="text-2xl font-bold text-gray-900">{suspendedClients}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Settings className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terminated</p>
                <p className="text-2xl font-bold text-gray-900">{terminatedClients}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Trash2 className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Clients Table */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Client Directory</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Complete list of all client organizations and their details
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
                    placeholder="Search clients..."
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
                    <SelectItem value="invited">Invited</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
                {(searchTerm || statusFilter !== "all" || revenueFilter !== "all" || locationFilter !== "all" || joinDateFilter !== "all" || clientSizeFilter !== "all") && (
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Revenue Range</label>
                    <Select value={revenueFilter} onValueChange={setRevenueFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Revenue Ranges" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Revenue Ranges</SelectItem>
                        <SelectItem value="high">High Revenue ($400K+)</SelectItem>
                        <SelectItem value="medium">Medium Revenue ($200K-$399K)</SelectItem>
                        <SelectItem value="low">Low Revenue (Under $200K)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Location</label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="new york">New York, NY</SelectItem>
                        <SelectItem value="california">California, CA</SelectItem>
                        <SelectItem value="texas">Texas, TX</SelectItem>
                        <SelectItem value="florida">Florida, FL</SelectItem>
                        <SelectItem value="illinois">Illinois, IL</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Join Date</label>
                    <Select value={joinDateFilter} onValueChange={setJoinDateFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                        <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                        <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                        <SelectItem value="last_year">Last Year</SelectItem>
                        <SelectItem value="older">Older than 1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Client Size</label>
                    <Select value={clientSizeFilter} onValueChange={setClientSizeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Sizes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sizes</SelectItem>
                        <SelectItem value="large">Large (50+ Vendors)</SelectItem>
                        <SelectItem value="medium">Medium (10-49 Vendors)</SelectItem>
                        <SelectItem value="small">Small (1-9 Vendors)</SelectItem>
                        <SelectItem value="startup">Startup (0 Vendors)</SelectItem>
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
                    <TableHead className="font-semibold text-gray-900">Client Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Contact Info</TableHead>
                    <TableHead className="font-semibold text-gray-900">Vendors</TableHead>
                    <TableHead className="font-semibold text-gray-900">Customers</TableHead>
                    <TableHead className="font-semibold text-gray-900">Revenue</TableHead>
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
                          <span className="text-gray-500">Loading clients...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-gray-500">
                          {searchTerm || statusFilter !== 'all' || revenueFilter !== 'all' || locationFilter !== 'all' || joinDateFilter !== 'all' || clientSizeFilter !== 'all'
                            ? 'No clients found matching your filters.'
                            : 'No clients found.'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map((client, index) => (
                  <TableRow 
                    key={client.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Globe className="h-3 w-3 mr-1" />
                          {client.website}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-3 w-3 mr-1" />
                          {client.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          {client.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900 font-medium">{client.vendors}</TableCell>
                    <TableCell className="text-gray-900 font-medium">{client.customers}</TableCell>
                    <TableCell className="text-gray-900 font-semibold">{client.totalRevenue}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusVariant(client.status)}
                        className={`${
                          client.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                          client.status === 'Invited' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                          client.status === 'Pending' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                          client.status === 'Trial' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                          'bg-red-100 text-red-800 hover:bg-red-100'
                        }`}
                      >
                        {client.status}
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
                          {client.record_type !== 'invitation' && (
                            <>
                              <DropdownMenuItem onClick={() => handleViewClient(client)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleLoginAsClient(client)}
                                disabled={loginAsClientLoading === client.id}
                              >
                                {loginAsClientLoading === client.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <LogIn className="mr-2 h-4 w-4" />
                                )}
                                {loginAsClientLoading === client.id ? 'Logging in...' : 'Login as Client'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleSuspendClient(client)}
                                className="text-orange-600 focus:text-orange-600"
                                disabled={client.subscription_status === 2 || client.subscription_status === 4}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Suspend Client
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUnsuspendClient(client)}
                                className="text-green-600 focus:text-green-600"
                                disabled={client.subscription_status !== 2}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Unsuspend Client
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleTerminateClient(client)}
                                className="text-red-600 focus:text-red-600"
                                disabled={client.subscription_status === 4}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Terminate Client
                              </DropdownMenuItem>
                            </>
                          )}
                          {client.record_type === 'invitation' && (
                            <DropdownMenuItem className="text-gray-400" disabled>
                              <Mail className="mr-2 h-4 w-4" />
                              Pending Registration
                            </DropdownMenuItem>
                          )}
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
              Showing {filteredClients.length} of {pagination.total_count || filteredClients.length} clients
              {(searchTerm || statusFilter !== "all" || revenueFilter !== "all" || locationFilter !== "all" || joinDateFilter !== "all" || clientSizeFilter !== "all") &&
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
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddClient}
      />
      <ViewEditClientModal
        isOpen={isViewEditModalOpen}
        onClose={() => setIsViewEditModalOpen(false)}
        client={selectedClient}
        mode="view"
        onUpdate={handleUpdateClient}
      />

      {/* Suspend Client Modal */}
      <Dialog open={suspendModalOpen} onOpenChange={setSuspendModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend {selectedClientForAction?.company_name}?
              This will temporarily block their access to the marketplace, vendors, and customers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="suspend-reason">Reason for suspension (optional)</Label>
              <Textarea
                id="suspend-reason"
                placeholder="Enter reason for suspension..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmSuspendClient}
              disabled={suspendLoading === selectedClientForAction?.id}
            >
              {suspendLoading === selectedClientForAction?.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suspending...
                </>
              ) : (
                'Suspend Client'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unsuspend Client Modal */}
      <Dialog open={unsuspendModalOpen} onOpenChange={setUnsuspendModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsuspend Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to unsuspend {selectedClientForAction?.company_name}?
              This will restore their access to the marketplace, vendors, and customers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnsuspendModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={confirmUnsuspendClient}
              disabled={unsuspendLoading === selectedClientForAction?.id}
            >
              {unsuspendLoading === selectedClientForAction?.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Unsuspending...
                </>
              ) : (
                'Unsuspend Client'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terminate Client Modal */}
      <Dialog open={terminateModalOpen} onOpenChange={setTerminateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminate Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to terminate {selectedClientForAction?.company_name}?
              This will permanently block their access and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="terminate-reason">Reason for termination (optional)</Label>
              <Textarea
                id="terminate-reason"
                placeholder="Enter reason for termination..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTerminateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmTerminateClient}
              disabled={terminateLoading === selectedClientForAction?.id}
            >
              {terminateLoading === selectedClientForAction?.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Terminating...
                </>
              ) : (
                'Terminate Client'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAllClientsPage;
