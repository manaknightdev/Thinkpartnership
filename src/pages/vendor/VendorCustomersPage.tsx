import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Search,
  Filter,
  Download,
  TrendingUp,
  DollarSign,
  Calendar,
  Eye,
  UserPlus,
  Star,
  ShoppingBag,
  ArrowUpRight,
  Share,
  Mail,
  Phone,
  MapPin,
  Clock,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import VendorCustomersAPI, { VendorCustomer } from "@/services/VendorCustomersAPI";
import { showSuccess, showError } from "@/utils/toast";

const VendorCustomersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("total_spent");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<VendorCustomer | null>(null);
  const [customers, setCustomers] = useState<VendorCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Load customers on component mount
  useEffect(() => {
    loadCustomers();
  }, [pagination.page, sortBy, filterStatus]);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      setError("");

      const filters = {
        page: pagination.page,
        limit: pagination.limit,
        sort_by: sortBy,
        status: filterStatus !== "all" ? (filterStatus === "active" ? 1 : 0) : undefined,
      };

      const response = await VendorCustomersAPI.getCustomers(filters);

      if (response.error) {
        setError(response.message || "Failed to load customers");
        return;
      }

      setCustomers(response.customers);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate summary stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 1).length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.total_spent, 0);
  const avgSpendPerCustomer = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" ||
                         (filterStatus === "active" && customer.status === 1) ||
                         (filterStatus === "inactive" && customer.status === 0);

    return matchesSearch && matchesStatus;
  });

  const handleInviteCustomers = () => {
    navigate('/vendor-portal/invite');
  };

  const handleViewDetails = (customer: VendorCustomer) => {
    setSelectedCustomer(customer);
  };

  const handleExport = () => {
    try {
      setIsExporting(true);

      if (!filteredCustomers || filteredCustomers.length === 0) {
        toast.info('No customers to export');
        return;
      }

      const headers = [
        'Customer ID',
        'Name',
        'Email',
        'Phone',
        'Total Spent',
        'Orders Count',
        'Status',
        'Joined',
        'Last Order',
        'Relationship Type',
        'Invite Code',
        'Referral Date',
      ];

      const csvContent = [
        headers.join(','),
        ...filteredCustomers.map(c => [
          `"${c.id}"`,
          `"${(c.customer_name || '').replace(/"/g, '""')}"`,
          `"${(c.customer_email || '').replace(/"/g, '""')}"`,
          `"${(c.customer_phone || '').replace(/"/g, '""')}"`,
          `"${Number(c.total_spent || 0).toFixed(2)}"`,
          `"${c.orders_count ?? 0}"`,
          `"${c.status === 1 ? 'Active' : 'Inactive'}"`,
          `"${c.created_at ? new Date(c.created_at).toISOString() : ''}"`,
          `"${c.last_order_date ? new Date(c.last_order_date).toISOString() : ''}"`,
          `"${(c.relationship_type || '').replace(/"/g, '""')}"`,
          `"${(c.invite_code || '').replace(/"/g, '""')}"`,
          `"${c.referral_date ? new Date(c.referral_date).toISOString() : ''}"`,
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `vendor-customers-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccess('Customers exported successfully');
    } catch (error) {
      console.error('Error exporting customers:', error);
      showError('Failed to export customers');
    } finally {
      setIsExporting(false);
    }
  };

  const shareCustomer = (customer: VendorCustomer) => {
    const shareText = `Check out ${customer.customer_name} - one of my valued customers on ThinkPartnership!`;
    if (navigator.share) {
      navigator.share({
        title: "Customer Referral",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Customer info copied to clipboard!");
    }
  };

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Customers</h1>
          <p className="text-gray-600 mt-1">
            Track customers you've brought to the platform and their spending across all vendors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
          <Button onClick={handleInviteCustomers} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Customer
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg per Customer</p>
                <p className="text-2xl font-bold text-gray-900">${avgSpendPerCustomer.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
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
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="space-y-4">
        {filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your filters to see more customers."
                  : "Start inviting customers to build your referral network."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 flex-shrink-0">
                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{customer.customer_name}</h3>
                        <p className="text-sm text-gray-600">{customer.customer_email}</p>
                      </div>

                      <Badge
                        className={cn(
                          "text-xs",
                          customer.status === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        )}
                      >
                        {customer.status === 1 ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Total Spent</p>
                        <p className="font-semibold text-green-600">${customer.total_spent.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Orders</p>
                        <p className="font-semibold text-blue-600">{customer.orders_count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Joined</p>
                        <p className="font-semibold text-gray-700">{new Date(customer.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last Order</p>
                        <p className="font-semibold text-gray-700">
                          {customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : "No orders"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(customer)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Customer Details</DialogTitle>
                            </DialogHeader>
                            {selectedCustomer && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User className="h-8 w-8 text-gray-400" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold">{selectedCustomer.customer_name}</h3>
                                    <p className="text-sm text-gray-600">{selectedCustomer.status === 1 ? "Active" : "Inactive"}</p>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{selectedCustomer.customer_email}</span>
                                  </div>
                                  {selectedCustomer.customer_phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm">{selectedCustomer.customer_phone}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">Joined {new Date(selectedCustomer.created_at).toLocaleDateString()}</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">${selectedCustomer.total_spent.toFixed(2)}</p>
                                    <p className="text-sm text-gray-600">Total Spent</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{selectedCustomer.orders_count}</p>
                                    <p className="text-sm text-gray-600">Total Orders</p>
                                  </div>
                                </div>

                                {selectedCustomer.last_order_date && (
                                  <div className="flex items-center gap-2 pt-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                      Last order: {new Date(selectedCustomer.last_order_date).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => shareCustomer(customer)}
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorCustomersPage;
