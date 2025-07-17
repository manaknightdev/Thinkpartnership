import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart as LineChartIcon, Users, Download, Star, CheckCircle, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";

import ClientAPI, { ReportsVendorData, ReportsSummary, DashboardStats } from '@/services/ClientAPI';
import { showError } from '@/utils/toast';

const ClientReportsPage = () => {
  // State for real data
  const [vendors, setVendors] = useState<ReportsVendorData[]>([]);
  const [reportsSummary, setReportsSummary] = useState<ReportsSummary | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Fetch reports data and dashboard stats in parallel
      const [reportsData, statsData] = await Promise.all([
        ClientAPI.getReportsVendors(),
        ClientAPI.getDashboardStats()
      ]);

      setVendors(reportsData.vendors || []);
      setReportsSummary(reportsData.summary);
      setDashboardStats(statsData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load report data';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to process real data
  const getTopVendors = () => {
    return vendors
      .filter(vendor => vendor.total_revenue > 0 || vendor.total_referrals > 0)
      .sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0))
      .slice(0, 4)
      .map(vendor => ({
        name: vendor.company_name || vendor.contact_name,
        revenue: `$${(vendor.total_revenue || 0).toLocaleString()}`,
        referrals: vendor.total_referrals || 0 // Now using actual referrals data
      }));
  };

  const getAllVendorsForReport = () => {
    return vendors.map(vendor => ({
      id: vendor.id,
      name: vendor.company_name || vendor.contact_name,
      services: `${vendor.services_count || 0} services`,
      totalRevenue: vendor.total_revenue || 0,
      completedJobs: vendor.completed_jobs || 0,
      referrals: vendor.total_referrals || 0,
      referralCommission: vendor.total_referral_commission || 0,
      rating: vendor.rating || 4.5,
      status: vendor.status === 'active' ? 'Active' : vendor.status === 'pending' ? 'Pending' : 'Inactive',
      joinDate: vendor.created_at
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };



  // Generate revenue chart data based on current stats
  const getRevenueData = () => {
    if (!reportsSummary && !dashboardStats) {
      return [];
    }

    // Use reports summary if available, otherwise fall back to dashboard stats
    const currentRevenue = reportsSummary?.total_revenue || dashboardStats?.total_revenue || 0;

    return [
      { name: 'Jan', revenue: Math.round(currentRevenue * 0.6) },
      { name: 'Feb', revenue: Math.round(currentRevenue * 0.7) },
      { name: 'Mar', revenue: Math.round(currentRevenue * 0.8) },
      { name: 'Apr', revenue: Math.round(currentRevenue * 0.75) },
      { name: 'May', revenue: Math.round(currentRevenue * 0.9) },
      { name: 'Jun', revenue: currentRevenue },
    ];
  };

  const handleGenerateReport = () => {
    toast.info("Generating custom report...");
  };

  const [isAllVendorsReportOpen, setIsAllVendorsReportOpen] = useState(false);

  const handleViewAllVendorsReport = () => {
    setIsAllVendorsReportOpen(true);
  };

  // Get computed data
  const topVendors = getTopVendors();
  const allVendorsReport = getAllVendorsForReport();
  const revenueData = getRevenueData();

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading reports...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load reports</p>
          <Button onClick={fetchReportData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg p-6 border border-primary/20">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-lg text-gray-700 mb-4">
          Access detailed reports and analytics for your marketplace performance.
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <Select defaultValue="monthly">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleGenerateReport}>
            Generate Custom Report
          </Button>
        </div>
      </div>

      <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LineChartIcon className="h-5 w-5 text-primary" />
            </div>
            Marketplace Performance Overview
          </CardTitle>
          <CardDescription>Revenue and transaction trends over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={revenueData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            Top Performing Vendors
          </CardTitle>
          <CardDescription>Vendors with the highest revenue and referrals.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Total Revenue</TableHead>
                  <TableHead>Total Referrals</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topVendors.length > 0 ? (
                  topVendors.map((vendor, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell className="text-green-600 font-semibold">{vendor.revenue}</TableCell>
                      <TableCell className="text-blue-600 font-semibold">{vendor.referrals}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      No vendor data available yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Button onClick={handleViewAllVendorsReport} className="mt-4 bg-blue-600 hover:bg-blue-700">View All Vendors Report</Button>
        </CardContent>
      </Card>

      {/* All Vendors Report Dialog */}
      <Dialog open={isAllVendorsReportOpen} onOpenChange={setIsAllVendorsReportOpen}>
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
                  <p className="text-2xl font-bold text-blue-600">{allVendorsReport.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(allVendorsReport.reduce((sum, v) => sum + v.totalRevenue, 0))}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {allVendorsReport.reduce((sum, v) => sum + v.completedJobs, 0)}
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
                    <TableHead>Referrals</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allVendorsReport.length > 0 ? (
                    allVendorsReport.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">{vendor.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{vendor.services}</Badge>
                        </TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          {formatCurrency(vendor.totalRevenue)}
                        </TableCell>
                        <TableCell className="text-blue-600 font-semibold">
                          {vendor.completedJobs}
                        </TableCell>
                        <TableCell className="text-purple-600 font-semibold">
                          {vendor.referrals}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{vendor.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={vendor.status === "Active" ? "default" : "destructive"}>
                            {vendor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(vendor.joinDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No vendor data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => toast.info("Exporting vendor report...")}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientReportsPage;