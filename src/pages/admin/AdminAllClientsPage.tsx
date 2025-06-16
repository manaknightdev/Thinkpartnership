import React, { useState } from 'react';
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
import {
  Search,
  Filter,
  Eye,
  Building,
  Users,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  Globe,
  Settings,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  X,
  SlidersHorizontal,
  LogIn
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  { 
    id: "c002", 
    name: "HomeServices Pro", 
    email: "contact@homeservices.com", 
    phone: "+1 (555) 234-5678",
    website: "www.homeservices.com",
    status: "Active", 
    plan: "Professional",
    vendors: 18, 
    customers: 850,
    totalRevenue: "$320,000",
    joinDate: "2023-03-22",
    lastActive: "2024-01-09"
  },
  { 
    id: "c003", 
    name: "Local Connect", 
    email: "info@localconnect.com", 
    phone: "+1 (555) 345-6789",
    website: "www.localconnect.com",
    status: "Suspended", 
    plan: "Basic",
    vendors: 8, 
    customers: 320,
    totalRevenue: "$85,000",
    joinDate: "2023-06-10",
    lastActive: "2023-12-15"
  },
  { 
    id: "c004", 
    name: "ServiceHub Inc", 
    email: "admin@servicehub.com", 
    phone: "+1 (555) 456-7890",
    website: "www.servicehub.com",
    status: "Active", 
    plan: "Professional",
    vendors: 22, 
    customers: 980,
    totalRevenue: "$380,000",
    joinDate: "2023-02-08",
    lastActive: "2024-01-11"
  },
  { 
    id: "c005", 
    name: "QuickFix Network", 
    email: "support@quickfix.com", 
    phone: "+1 (555) 567-8901",
    website: "www.quickfix.com",
    status: "Trial", 
    plan: "Trial",
    vendors: 5, 
    customers: 150,
    totalRevenue: "$12,000",
    joinDate: "2023-12-01",
    lastActive: "2024-01-11"
  }
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Active":
      return "default";
    case "Trial":
      return "secondary";
    case "Suspended":
      return "destructive";
    default:
      return "outline";
  }
};

const getPlanColor = (plan: string) => {
  switch (plan) {
    case "Enterprise":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "Professional":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "Basic":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Trial":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const AdminAllClientsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [revenueFilter, setRevenueFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [clients, setClients] = useState(mockClients);

  const handleViewClient = (client: any) => {
    setSelectedClient(client);
    setModalMode('view');
    setIsViewEditModalOpen(true);
  };

  const handleEditClient = (client: any) => {
    setSelectedClient(client);
    setModalMode('edit');
    setIsViewEditModalOpen(true);
  };

  const handleSuspendClient = (clientName: string) => {
    toast.warning(`Suspending ${clientName}...`);
  };

  const handleLoginAsClient = (client: any) => {
    toast.success(`Logging in as ${client.name}...`);
    // Navigate to client portal
    navigate('/client-portal');
  };

  const handleAddNewClient = () => {
    setIsAddModalOpen(true);
  };

  const handleAddClient = (newClient: any) => {
    setClients(prev => [...prev, newClient]);
  };

  const handleUpdateClient = (updatedClient: any) => {
    setClients(prev => prev.map(client =>
      client.id === updatedClient.id ? updatedClient : client
    ));
  };

  const handleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPlanFilter("all");
    setRevenueFilter("all");
    toast.info("All filters cleared");
  };

  // Filter clients based on current filters
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.website.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status.toLowerCase() === statusFilter;
    const matchesPlan = planFilter === "all" || client.plan.toLowerCase() === planFilter;

    const revenueAmount = parseFloat(client.totalRevenue.replace('$', '').replace(',', ''));
    const matchesRevenue = revenueFilter === "all" ||
                          (revenueFilter === "high" && revenueAmount >= 400000) ||
                          (revenueFilter === "medium" && revenueAmount >= 200000 && revenueAmount < 400000) ||
                          (revenueFilter === "low" && revenueAmount < 200000);

    return matchesSearch && matchesStatus && matchesPlan && matchesRevenue;
  });

  // Calculate summary stats based on filtered data
  const totalClients = filteredClients.length;
  const activeClients = filteredClients.filter(c => c.status === "Active").length;
  const trialClients = filteredClients.filter(c => c.status === "Trial").length;
  const suspendedClients = filteredClients.filter(c => c.status === "Suspended").length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Clients</h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor all client organizations across the platform
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" onClick={handleAdvancedFilters}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline" size="sm">
            <Building className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={handleAddNewClient} className="bg-purple-600 hover:bg-purple-700" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New Client
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-sm font-medium text-gray-600">Trial Clients</p>
                <p className="text-2xl font-bold text-gray-900">{trialClients}</p>
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
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                  </SelectContent>
                </Select>
                {(searchTerm || statusFilter !== "all" || planFilter !== "all" || revenueFilter !== "all") && (
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
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
                    <TableHead className="font-semibold text-gray-900">Plan</TableHead>
                    <TableHead className="font-semibold text-gray-900">Vendors</TableHead>
                    <TableHead className="font-semibold text-gray-900">Customers</TableHead>
                    <TableHead className="font-semibold text-gray-900">Revenue</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client, index) => (
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
                    <TableCell>
                      <Badge className={getPlanColor(client.plan)}>
                        {client.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900 font-medium">{client.vendors}</TableCell>
                    <TableCell className="text-gray-900 font-medium">{client.customers}</TableCell>
                    <TableCell className="text-gray-900 font-semibold">{client.totalRevenue}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusVariant(client.status)}
                        className={`${
                          client.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
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
                          <DropdownMenuItem onClick={() => handleViewClient(client)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClient(client)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleLoginAsClient(client)}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Login as Client
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleSuspendClient(client.name)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Suspend Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing {filteredClients.length} of {clients.length} clients
              {(searchTerm || statusFilter !== "all" || planFilter !== "all" || revenueFilter !== "all") &&
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
        mode={modalMode}
        onUpdate={handleUpdateClient}
      />
    </div>
  );
};

export default AdminAllClientsPage;
