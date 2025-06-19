import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Download, Filter, DollarSign, TrendingUp, Users, Calendar, X, SlidersHorizontal } from "lucide-react";

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

  const handleExport = () => {
    toast.info("Exporting transactions data...");
    // Logic to export data
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

  // Filter transactions based on current filters
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = searchTerm === "" ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.service.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesVendor = vendorFilter === "all" || transaction.vendor === vendorFilter;
    const matchesPaymentMethod = paymentMethodFilter === "all" || transaction.paymentMethod === paymentMethodFilter;

    // Date range filtering
    let matchesDateRange = true;
    if (dateRangeFilter !== "all") {
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));

      switch (dateRangeFilter) {
        case "today":
          matchesDateRange = daysDiff === 0;
          break;
        case "week":
          matchesDateRange = daysDiff <= 7;
          break;
        case "month":
          matchesDateRange = daysDiff <= 30;
          break;
        case "quarter":
          matchesDateRange = daysDiff <= 90;
          break;
      }
    }

    // Amount range filtering
    let matchesAmountRange = true;
    if (amountRangeFilter !== "all") {
      const amount = parseFloat(transaction.amount.replace('$', '').replace(',', ''));
      switch (amountRangeFilter) {
        case "low":
          matchesAmountRange = amount < 200;
          break;
        case "medium":
          matchesAmountRange = amount >= 200 && amount < 1000;
          break;
        case "high":
          matchesAmountRange = amount >= 1000;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesVendor &&
           matchesPaymentMethod && matchesDateRange && matchesAmountRange;
  });

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
                        <SelectItem value="Rapid Plumbers">Rapid Plumbers</SelectItem>
                        <SelectItem value="Brush Strokes Pro">Brush Strokes Pro</SelectItem>
                        <SelectItem value="Certified Inspectors Inc.">Certified Inspectors Inc.</SelectItem>
                        <SelectItem value="Green Thumb Landscaping">Green Thumb Landscaping</SelectItem>
                        <SelectItem value="Sparky Electric">Sparky Electric</SelectItem>
                        <SelectItem value="Climate Control Experts">Climate Control Experts</SelectItem>
                        <SelectItem value="Move It Right">Move It Right</SelectItem>
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
                {filteredTransactions.map((txn, index) => (
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
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing {filteredTransactions.length} of {mockTransactions.length} transactions
              {(searchTerm || statusFilter !== "all" || vendorFilter !== "all" ||
                dateRangeFilter !== "all" || amountRangeFilter !== "all" || paymentMethodFilter !== "all") &&
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
    </div>
  );
};

export default AdminTransactionsPage;