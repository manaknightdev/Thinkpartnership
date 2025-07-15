import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Search, Eye, Download, Filter, Mail, Phone, MapPin, Calendar, DollarSign, TrendingUp, Star, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import ClientAPI, { ClientCustomer } from '@/services/ClientAPI';
import { showSuccess, showError } from '@/utils/toast';

const ClientCustomersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("total_spent");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterReferral, setFilterReferral] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<ClientCustomer | null>(null);
  const [isViewCustomerOpen, setIsViewCustomerOpen] = useState(false);
  const [customers, setCustomers] = useState<ClientCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await ClientAPI.getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load customers';
      setError(errorMessage);
      showError(errorMessage);
      setCustomers([]); // Ensure customers is always an array
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | string | undefined) => {
    if (amount === undefined || amount === null) {
      return '$0.00';
    }
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericAmount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return 'N/A';
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };



  // Calculate summary stats
  const totalCustomers = (customers || []).length;
  const activeCustomers = (customers || []).filter(c => c?.status === "active").length;
  const totalRevenue = (customers || []).reduce((sum, customer) => {
    const spent = typeof customer?.total_spent === 'string'
      ? parseFloat(customer.total_spent || '0')
      : (customer?.total_spent || 0);
    return sum + spent;
  }, 0);
  const avgSpendPerCustomer = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
  const totalOrders = (customers || []).reduce((sum, customer) => sum + (customer?.completed_orders || 0), 0);

  const filteredCustomers = (customers || []).filter(customer => {
    const fullName = `${customer?.first_name || ''} ${customer?.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         customer?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || customer?.status === filterStatus;
    const matchesReferral = filterReferral === "all" ||
                           (filterReferral === "direct" && !customer?.referred_by) ||
                           (filterReferral !== "direct" && customer?.referred_by === filterReferral);

    return matchesSearch && matchesStatus && matchesReferral;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case "total_spent":
        const spentA = typeof a?.total_spent === 'string' ? parseFloat(a.total_spent || '0') : (a?.total_spent || 0);
        const spentB = typeof b?.total_spent === 'string' ? parseFloat(b.total_spent || '0') : (b?.total_spent || 0);
        return spentB - spentA;
      case "orders_count":
        return (b?.completed_orders || 0) - (a?.completed_orders || 0);
      case "created_at":
        return new Date(b?.created_at || 0).getTime() - new Date(a?.created_at || 0).getTime();
      case "name":
        const aName = `${a?.first_name || ''} ${a?.last_name || ''}`;
        const bName = `${b?.first_name || ''} ${b?.last_name || ''}`;
        return aName.localeCompare(bName);
      default:
        return 0;
    }
  });

  const handleViewCustomer = (customer: ClientCustomer) => {
    setSelectedCustomer(customer);
    setIsViewCustomerOpen(true);
  };

  const handleExportCustomers = () => {
    toast.info("Exporting customer data...");
  };

  const handleInviteCustomer = () => {
    navigate("/client-portal/invites");
  };

  const uniqueReferrers = [...new Set(customers.map(c => c.referred_by).filter(Boolean))];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading customers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg p-6 border border-primary/20">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Customers</h1>
        <p className="text-lg text-gray-700 mb-4">
          Manage and track all customers in your marketplace ecosystem.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-primary hover:bg-primary/90" onClick={handleInviteCustomer}>
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
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">${totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-primary">${avgSpendPerCustomer.toFixed(0)} avg per customer</p>
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
                  {totalCustomers > 0 ? Math.round((customers.filter(c => c.referred_by).length / totalCustomers) * 100) : 0}%
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
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="h-8 w-8 text-purple-600" />
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {`${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown User'}
                          </h3>
                          <Badge variant={customer.status === "active" ? "default" : "secondary"}
                                 className={customer.status === "active" ? "bg-primary/10 text-primary" : ""}>
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
                            <p className="font-semibold text-primary">{formatCurrency(customer.total_spent)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Orders</p>
                            <p className="font-semibold text-blue-600">{customer.completed_orders || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="font-semibold text-purple-600">{customer.phone || "N/A"}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-3">
                          <div>
                            <p className="text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Join Date
                            </p>
                            <p className="font-medium">{formatDate(customer.join_date)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Last Order</p>
                            <p className="font-medium">{formatDate(customer.last_order_date)}</p>
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
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-10 w-10 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">
                    {`${selectedCustomer.first_name || ''} ${selectedCustomer.last_name || ''}`.trim() || 'Unknown User'}
                  </h3>
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
                        {selectedCustomer.phone || 'N/A'}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        Address not available
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Account Information</Label>
                    <div className="space-y-2 mt-2">
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        Joined: {formatDate(selectedCustomer.join_date)}
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        Last Order: {formatDate(selectedCustomer.last_order_date)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Referral Information</Label>
                    <div className="mt-2">
                      <Badge className="bg-purple-100 text-purple-800">
                        Direct Customer
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(selectedCustomer.total_spent)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedCustomer.completed_orders || 0}</p>
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
