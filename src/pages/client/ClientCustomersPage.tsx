import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Search, Eye, Download, Filter, Mail, Phone, MapPin, Calendar, DollarSign, TrendingUp, Star, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  joinDate: string;
  totalSpent: number;
  ordersCount: number;
  lastOrderDate: string;
  status: "active" | "inactive";
  referredBy?: string;
  avatar?: string;
}

const ClientCustomersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("totalSpent");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterReferral, setFilterReferral] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewCustomerOpen, setIsViewCustomerOpen] = useState(false);

  const mockCustomers: Customer[] = [
    {
      id: "c001",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 111-2222",
      address: "123 Customer St, Springfield, IL 62701",
      joinDate: "2024-01-20",
      totalSpent: 2450.00,
      ordersCount: 8,
      lastOrderDate: "2024-01-25",
      status: "active",
      referredBy: "Rapid Plumbers",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "c002",
      name: "Mike Chen",
      email: "mike.chen@email.com",
      phone: "(555) 222-3333",
      address: "456 Client Ave, Springfield, IL 62702",
      joinDate: "2024-02-15",
      totalSpent: 1800.00,
      ordersCount: 5,
      lastOrderDate: "2024-02-20",
      status: "active",
      referredBy: "Brush Strokes Pro",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "c003",
      name: "Lisa Rodriguez",
      email: "lisa.rodriguez@email.com",
      phone: "(555) 333-4444",
      address: "789 Buyer Blvd, Springfield, IL 62703",
      joinDate: "2024-01-30",
      totalSpent: 3200.00,
      ordersCount: 12,
      lastOrderDate: "2024-02-01",
      status: "active",
      referredBy: "Green Thumb Landscaping",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "c004",
      name: "David Wilson",
      email: "david.wilson@email.com",
      phone: "(555) 444-5555",
      address: "321 Patron Place, Springfield, IL 62704",
      joinDate: "2024-03-10",
      totalSpent: 950.00,
      ordersCount: 3,
      lastOrderDate: "2024-03-15",
      status: "active",
      referredBy: "Certified Inspectors Inc."
    },
    {
      id: "c005",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "(555) 555-6666",
      address: "654 Consumer Court, Springfield, IL 62705",
      joinDate: "2024-02-05",
      totalSpent: 1650.00,
      ordersCount: 6,
      lastOrderDate: "2024-02-10",
      status: "inactive"
    },
    {
      id: "c006",
      name: "Robert Brown",
      email: "robert.brown@email.com",
      phone: "(555) 666-7777",
      address: "987 Shopper Street, Springfield, IL 62706",
      joinDate: "2024-01-05",
      totalSpent: 4100.00,
      ordersCount: 15,
      lastOrderDate: "2024-01-10",
      status: "active",
      referredBy: "Rapid Plumbers"
    }
  ];

  // Calculate summary stats
  const totalCustomers = mockCustomers.length;
  const activeCustomers = mockCustomers.filter(c => c.status === "active").length;
  const totalRevenue = mockCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const avgSpendPerCustomer = totalRevenue / totalCustomers;
  const totalOrders = mockCustomers.reduce((sum, customer) => sum + customer.ordersCount, 0);

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || customer.status === filterStatus;
    const matchesReferral = filterReferral === "all" || 
                           (filterReferral === "direct" && !customer.referredBy) ||
                           (filterReferral !== "direct" && customer.referredBy === filterReferral);

    return matchesSearch && matchesStatus && matchesReferral;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case "totalSpent":
        return b.totalSpent - a.totalSpent;
      case "ordersCount":
        return b.ordersCount - a.ordersCount;
      case "joinDate":
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewCustomerOpen(true);
  };

  const handleExportCustomers = () => {
    toast.info("Exporting customer data...");
  };

  const handleInviteCustomer = () => {
    navigate("/client-portal/invites");
  };

  const uniqueReferrers = [...new Set(mockCustomers.map(c => c.referredBy).filter(Boolean))];

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Customers</h1>
        <p className="text-lg text-gray-700 mb-4">
          Manage and track all customers in your marketplace ecosystem.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleInviteCustomer}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Customer
          </Button>
          <Button variant="outline" onClick={handleExportCustomers}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-purple-600">{totalCustomers}</p>
                <p className="text-xs text-purple-600">{activeCustomers} active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">${avgSpendPerCustomer.toFixed(0)} avg per customer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
                <p className="text-xs text-blue-600">{(totalOrders / totalCustomers).toFixed(1)} avg per customer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Referral Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round((mockCustomers.filter(c => c.referredBy).length / totalCustomers) * 100)}%
                </p>
                <p className="text-xs text-orange-600">customers referred by vendors</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Filters and Search */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
          <CardDescription>Filter and search through your customer base.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="totalSpent">Total Spent</SelectItem>
                <SelectItem value="ordersCount">Order Count</SelectItem>
                <SelectItem value="joinDate">Join Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterReferral} onValueChange={setFilterReferral}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by referrer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Referrers</SelectItem>
                <SelectItem value="direct">Direct Customers</SelectItem>
                {uniqueReferrers.map((referrer) => (
                  <SelectItem key={referrer} value={referrer!}>{referrer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer List
              <Badge className="bg-purple-100 text-purple-800">
                {sortedCustomers.length} of {totalCustomers}
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>Complete list of customers in your marketplace.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedCustomers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers found</h3>
                <p className="text-gray-600">
                  {searchTerm || filterStatus !== "all" || filterReferral !== "all"
                    ? "Try adjusting your filters to see more customers."
                    : "Start inviting customers to build your marketplace."}
                </p>
              </div>
            ) : (
              sortedCustomers.map((customer) => (
                <Card key={customer.id} className="hover:shadow-md transition-shadow border-l-4 border-l-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 flex-shrink-0">
                        {customer.avatar ? (
                          <img
                            src={customer.avatar}
                            alt={customer.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="h-8 w-8 text-purple-600" />
                          </div>
                        )}
                      </div>

                      {/* Customer Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{customer.name}</h3>
                          <Badge variant={customer.status === "active" ? "default" : "secondary"}
                                 className={customer.status === "active" ? "bg-green-100 text-green-800" : ""}>
                            {customer.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              Email
                            </p>
                            <p className="font-medium text-gray-900 truncate">{customer.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Total Spent</p>
                            <p className="font-semibold text-green-600">${customer.totalSpent.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Orders</p>
                            <p className="font-semibold text-blue-600">{customer.ordersCount}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Referred By</p>
                            <p className="font-semibold text-purple-600">{customer.referredBy || "Direct"}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-3">
                          <div>
                            <p className="text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Join Date
                            </p>
                            <p className="font-medium">{new Date(customer.joinDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Last Order</p>
                            <p className="font-medium">{new Date(customer.lastOrderDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Customer Dialog */}
      <Dialog open={isViewCustomerOpen} onOpenChange={setIsViewCustomerOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>Complete information about this customer.</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {selectedCustomer.avatar ? (
                  <img
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-10 w-10 text-purple-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-semibold">{selectedCustomer.name}</h3>
                  <p className="text-gray-600">{selectedCustomer.email}</p>
                  <Badge variant={selectedCustomer.status === "active" ? "default" : "secondary"} className="mt-1">
                    {selectedCustomer.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Contact Information</Label>
                    <div className="space-y-2 mt-2">
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {selectedCustomer.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {selectedCustomer.address}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Account Information</Label>
                    <div className="space-y-2 mt-2">
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        Joined: {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        Last Order: {new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Referral Information</Label>
                    <div className="mt-2">
                      <Badge className="bg-purple-100 text-purple-800">
                        {selectedCustomer.referredBy || "Direct Customer"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-green-600">${selectedCustomer.totalSpent.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedCustomer.ordersCount}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientCustomersPage;
