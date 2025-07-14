import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Download, Filter, DollarSign, TrendingUp, Users, Calendar, X, SlidersHorizontal, Loader2 } from "lucide-react";
import AdminAPI from '@/services/AdminAPI';
import { showError, showSuccess } from '@/utils/toast';

const mockTransactions = [
  { id: "TXN001", vendor: "Rapid Plumbers", customer: "Alice Smith", service: "Emergency Plumbing", amount: "$250.00", date: "2024-01-15", status: "Completed", paymentMethod: "Credit Card" },
  { id: "TXN002", vendor: "Brush Strokes Pro", customer: "Bob Johnson", service: "Interior Painting", amount: "$1200.00", date: "2024-01-14", status: "Completed", paymentMethod: "Bank Transfer" },
  { id: "TXN003", vendor: "Certified Inspectors Inc.", customer: "Charlie Brown", service: "Home Inspection", amount: "$350.00", date: "2024-01-13", status: "Pending", paymentMethod: "Credit Card" },
  { id: "TXN004", vendor: "Green Thumb Landscaping", customer: "Diana Prince", service: "Lawn Mowing", amount: "$80.00", date: "2024-01-12", status: "Completed", paymentMethod: "PayPal" },
  { id: "TXN005", vendor: "Sparky Electric", customer: "Eve Adams", service: "Electrical Repair", amount: "$180.00", date: "2024-01-11", status: "Cancelled", paymentMethod: "Credit Card" },
  { id: "TXN006", vendor: "Climate Control Experts", customer: "Frank White", service: "HVAC Tune-up", amount: "$120.00", date: "2024-01-10", status: "Completed", paymentMethod: "Debit Card" },
  { id: "TXN007", vendor: "Rapid Plumbers", customer: "Grace Lee", service: "Drain Cleaning", amount: "$150.00", date: "2024-01-09", status: "Completed", paymentMethod: "Credit Card" },
  { id: "TXN008", vendor: "Climate Control Experts", customer: "Henry Davis", service: "AC Installation", amount: "$2500.00", date: "2024-01-08", status: "Completed", paymentMethod: "Bank Transfer" },
  { id: "TXN009", vendor: "Move It Right", customer: "Ivy Chen", service: "Moving Service", amount: "$450.00", date: "2024-01-07", status: "Pending", paymentMethod: "Credit Card" },
  { id: "TXN010", vendor: "Brush Strokes Pro", customer: "Jack Wilson", service: "Exterior Painting", amount: "$800.00", date: "2024-01-06", status: "Completed", paymentMethod: "PayPal" },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Completed":
      return "default";
    case "Pending":
      return "secondary";
    case "Cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const AdminTransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [amountRangeFilter, setAmountRangeFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 20
  });

  useEffect(() => {
    fetchTransactions();
  }, [searchTerm, statusFilter, vendorFilter, dateRangeFilter, amountRangeFilter, paymentMethodFilter, pagination.current_page]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);

      const params = {
        page: pagination.current_page,
        limit: pagination.per_page,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(vendorFilter !== 'all' && { vendor: vendorFilter }),
        ...(dateRangeFilter !== 'all' && { date_range: dateRangeFilter }),
        ...(amountRangeFilter !== 'all' && { amount_range: amountRangeFilter }),
        ...(paymentMethodFilter !== 'all' && { payment_method: paymentMethodFilter })
      };

      const response = await AdminAPI.getAllTransactions(params);

      if (response.error) {
        showError(response.message || 'Failed to fetch transactions');
      } else {
        setTransactions(response.transactions || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      showError('Failed to load transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      toast.info("Exporting transactions data...");
      const response = await AdminAPI.exportTransactions({
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(vendorFilter !== 'all' && { vendor: vendorFilter }),
        ...(dateRangeFilter !== 'all' && { date_range: dateRangeFilter }),
        ...(amountRangeFilter !== 'all' && { amount_range: amountRangeFilter }),
        ...(paymentMethodFilter !== 'all' && { payment_method: paymentMethodFilter })
      });

      if (response.error) {
        showError(response.message || 'Failed to export transactions');
      } else {
        showSuccess('Transactions exported successfully');
        // Handle file download if needed
        if (response.download_url) {
          window.open(response.download_url, '_blank');
        }
      }
    } catch (error) {
      console.error('Error exporting transactions:', error);
      showError('Failed to export transactions. Please try again.');
    }
  };

  const handleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setVendorFilter("all");
    setDateRangeFilter("all");
    setAmountRangeFilter("all");
    setPaymentMethodFilter("all");
    toast.info("All filters cleared");
  };

  // Use transactions directly since filtering is done server-side via API
  const filteredTransactions = transactions.length > 0 ? transactions : [];

  // Calculate summary stats based on filtered data
  const totalTransactions = filteredTransactions.length;
  const totalRevenue = filteredTransactions
    .filter(txn => txn.status === "Completed")
    .reduce((sum, txn) => sum + parseFloat(txn.amount.replace('$', '').replace(',', '')), 0);
  const completedTransactions = filteredTransactions.filter(txn => txn.status === "Completed").length;
  const pendingTransactions = filteredTransactions.filter(txn => txn.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage all marketplace transactions across vendors
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" onClick={handleAdvancedFilters}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button onClick={handleExport} className="bg-purple-600 hover:bg-purple-700" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedTransactions}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingTransactions}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Transaction History</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Filter and review all completed, pending, and cancelled orders
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
                    placeholder="Search by ID, customer, or vendor..."
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
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
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
                {(searchTerm || statusFilter !== "all" || vendorFilter !== "all" ||
                  dateRangeFilter !== "all" || amountRangeFilter !== "all" || paymentMethodFilter !== "all") && (
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
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Vendor</label>
                    <Select value={vendorFilter} onValueChange={setVendorFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Vendors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Vendors</SelectItem>
                        {/* Dynamic vendor options would be populated from API */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Date Range</label>
                    <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                        <SelectItem value="quarter">Last 90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Amount Range</label>
                    <Select value={amountRangeFilter} onValueChange={setAmountRangeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Amounts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Amounts</SelectItem>
                        <SelectItem value="low">Under $200</SelectItem>
                        <SelectItem value="medium">$200 - $999</SelectItem>
                        <SelectItem value="high">$1,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Payment Method</label>
                    <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Methods" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Debit Card">Debit Card</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="PayPal">PayPal</SelectItem>
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
                  <TableHead className="font-semibold text-gray-900">Transaction ID</TableHead>
                  <TableHead className="font-semibold text-gray-900">Vendor</TableHead>
                  <TableHead className="font-semibold text-gray-900">Customer</TableHead>
                  <TableHead className="font-semibold text-gray-900">Service</TableHead>
                  <TableHead className="font-semibold text-gray-900">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-900">Payment Method</TableHead>
                  <TableHead className="font-semibold text-gray-900">Date</TableHead>
                  <TableHead className="font-semibold text-gray-900">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                        <span className="text-gray-600">Loading transactions...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-gray-500">
                        <p className="text-lg font-medium">No transactions found</p>
                        <p className="text-sm">Try adjusting your filters or search terms</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((txn, index) => (
                  <TableRow
                    key={txn.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}
                  >
                    <TableCell className="font-medium text-purple-600">{txn.id}</TableCell>
                    <TableCell className="text-gray-900">{txn.vendor}</TableCell>
                    <TableCell className="text-gray-900">{txn.customer}</TableCell>
                    <TableCell className="text-gray-700">{txn.service}</TableCell>
                    <TableCell className="font-semibold text-gray-900">{txn.amount}</TableCell>
                    <TableCell className="text-gray-600">{txn.paymentMethod}</TableCell>
                    <TableCell className="text-gray-600">{txn.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(txn.status)}
                        className={`${
                          txn.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                          txn.status === 'Pending' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                          'bg-red-100 text-red-800 hover:bg-red-100'
                        }`}
                      >
                        {txn.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing {filteredTransactions.length} of {pagination.total_count} transactions
              {(searchTerm || statusFilter !== "all" || vendorFilter !== "all" ||
                dateRangeFilter !== "all" || amountRangeFilter !== "all" || paymentMethodFilter !== "all") &&
                <span className="text-purple-600 font-medium"> (filtered)</span>
              }
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page <= 1}
                onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
              >
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-purple-600 text-white hover:bg-purple-700">
                {pagination.current_page}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page >= pagination.total_pages}
                onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactionsPage;