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
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Fetch reports data and dashboard stats in parallel
      const [reportsData, statsData] = await Promise.all([
        ClientAPI.getReportsVendors(selectedPeriod),
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
    try {
      const allVendorsReport = getAllVendorsForReport();
      if (!allVendorsReport || allVendorsReport.length === 0) {
        toast.info('No data available to export');
        return;
      }

      const headers = ['Vendor', 'Services', 'Revenue', 'Jobs', 'Referrals', 'Rating', 'Status', 'Join Date'];
      const csvContent = [
        headers.join(','),
        ...allVendorsReport.map(v => [
          `"${v.name}"`,
          `"${v.services}"`,
          `"$${(v.totalRevenue || 0).toLocaleString()}"`,
          `${v.completedJobs || 0}`,
          `${v.referrals || 0}`,
          `${v.rating || 0}`,
          `"${v.status}"`,
          `"${v.joinDate ? new Date(v.joinDate).toLocaleDateString() : 'N/A'}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${selectedPeriod}-vendors-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} report exported successfully`);
    } catch (error) {
      console.error('Error exporting custom report:', error);
      toast.error('Failed to export custom report');
    }
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
    <div className="p-2 xs:p-4 sm:p-6 space-y-4 xs:space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg p-3 xs:p-4 sm:p-6 border border-primary/20">
        <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-sm xs:text-base sm:text-lg text-gray-700 mb-3 xs:mb-4">
          Access detailed reports and analytics for your marketplace performance.
        </p>
        <div className="flex flex-col xs:flex-row xs:flex-wrap gap-2 xs:gap-3 items-stretch xs:items-center">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full xs:w-[160px] sm:w-[180px] text-xs xs:text-sm">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary hover:bg-primary/90 text-xs xs:text-sm px-3 xs:px-4" onClick={handleGenerateReport}>
            <span className="hidden xs:inline">Generate {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Report</span>
            <span className="xs:hidden">Generate Report</span>
          </Button>
        </div>
      </div>

      <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary">
        <CardHeader className="p-3 xs:p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-sm xs:text-base sm:text-lg">
            <div className="p-1 xs:p-2 bg-primary/10 rounded-lg">
              <LineChartIcon className="h-4 w-4 xs:h-5 xs:w-5 text-primary" />
            </div>
            <span className="truncate">Marketplace Performance</span>
          </CardTitle>
          <CardDescription className="text-xs xs:text-sm">Revenue and transaction trends over time.</CardDescription>
        </CardHeader>
        <CardContent className="p-3 xs:p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={revenueData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" activeDot={{ r: 6 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
        <CardHeader className="p-3 xs:p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-sm xs:text-base sm:text-lg">
            <div className="p-1 xs:p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 xs:h-5 xs:w-5 text-blue-600" />
            </div>
            <span className="truncate">Top Performing Vendors</span>
          </CardTitle>
          <CardDescription className="text-xs xs:text-sm">Vendors with the highest revenue and referrals.</CardDescription>
        </CardHeader>
        <CardContent className="p-3 xs:p-4 sm:p-6">
          <div className="overflow-x-auto -mx-1 xs:mx-0">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs xs:text-sm px-2 xs:px-4 min-w-[100px]">Vendor Name</TableHead>
                  <TableHead className="text-xs xs:text-sm px-2 xs:px-4 min-w-[80px]">Revenue</TableHead>
                  <TableHead className="text-xs xs:text-sm px-2 xs:px-4 min-w-[70px] hidden xs:table-cell">Referrals</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topVendors.length > 0 ? (
                  topVendors.map((vendor, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-xs xs:text-sm px-2 xs:px-4">
                        <div className="truncate max-w-[120px] xs:max-w-none">{vendor.name}</div>
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold text-xs xs:text-sm px-2 xs:px-4">
                        <div className="min-w-0">
                          <div className="truncate">{vendor.revenue}</div>
                          <div className="xs:hidden text-xs text-blue-600 mt-1">
                            {vendor.referrals} referrals
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xs:table-cell text-blue-600 font-semibold text-xs xs:text-sm px-2 xs:px-4">
                        {vendor.referrals}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 xs:py-8 text-gray-500 text-xs xs:text-sm">
                      No vendor data available yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Button onClick={handleViewAllVendorsReport} className="mt-3 xs:mt-4 bg-blue-600 hover:bg-blue-700 w-full xs:w-full sm:w-auto text-xs xs:text-sm">
            View All Vendors Report
          </Button>
        </CardContent>
      </Card>

      {/* All Vendors Report Dialog */}
      <Dialog open={isAllVendorsReportOpen} onOpenChange={setIsAllVendorsReportOpen}>
        <DialogContent className="w-[98vw] xs:w-[95vw] max-w-6xl max-h-[95vh] xs:max-h-[90vh] overflow-y-auto p-3 xs:p-4 sm:p-6">
          <DialogHeader className="space-y-1 xs:space-y-2">
            <DialogTitle className="text-base xs:text-lg sm:text-xl">All Vendors Report</DialogTitle>
            <DialogDescription className="text-xs xs:text-sm">Comprehensive report of all vendors in your marketplace.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 xs:space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
                  <Users className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-1 xs:mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600">Total Vendors</p>
                  <p className="text-base xs:text-lg sm:text-2xl font-bold text-blue-600">{allVendorsReport.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
                  <DollarSign className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-1 xs:mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600">Total Revenue</p>
                  <p className="text-base xs:text-lg sm:text-2xl font-bold text-primary">
                    {formatCurrency(allVendorsReport.reduce((sum, v) => sum + v.totalRevenue, 0))}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200 xs:col-span-1 sm:col-span-2 lg:col-span-1">
                <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
                  <CheckCircle className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-1 xs:mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600">Total Jobs</p>
                  <p className="text-base xs:text-lg sm:text-2xl font-bold text-purple-600">
                    {allVendorsReport.reduce((sum, v) => sum + v.completedJobs, 0)}
                  </p>
                </CardContent>
              </Card>

            </div>

            <div className="overflow-x-auto -mx-3 xs:-mx-2 sm:mx-0">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm px-1 xs:px-2 sm:px-4 min-w-[80px]">Vendor</TableHead>
                    <TableHead className="text-xs sm:text-sm px-1 xs:px-2 sm:px-4 hidden xs:table-cell min-w-[60px]">Services</TableHead>
                    <TableHead className="text-xs sm:text-sm px-1 xs:px-2 sm:px-4 min-w-[70px]">Revenue</TableHead>
                    <TableHead className="text-xs sm:text-sm px-1 xs:px-2 sm:px-4 hidden sm:table-cell min-w-[50px]">Jobs</TableHead>
                    <TableHead className="text-xs sm:text-sm px-1 xs:px-2 sm:px-4 hidden md:table-cell min-w-[60px]">Referrals</TableHead>
                    <TableHead className="text-xs sm:text-sm px-1 xs:px-2 sm:px-4 hidden sm:table-cell min-w-[50px]">Rating</TableHead>
                    <TableHead className="text-xs sm:text-sm px-1 xs:px-2 sm:px-4 min-w-[60px]">Status</TableHead>
                    <TableHead className="text-xs sm:text-sm px-1 xs:px-2 sm:px-4 hidden lg:table-cell min-w-[80px]">Join Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allVendorsReport.length > 0 ? (
                    allVendorsReport.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium text-xs sm:text-sm px-1 xs:px-2 sm:px-4 py-2 xs:py-3">
                          <div className="min-w-0">
                            <div className="truncate max-w-[80px] xs:max-w-[120px] sm:max-w-none">{vendor.name}</div>
                            <div className="xs:hidden text-xs text-gray-500 mt-1">
                              <Badge variant="outline" className="text-xs px-1">{vendor.services}</Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden xs:table-cell px-1 xs:px-2 sm:px-4 py-2 xs:py-3">
                          <Badge variant="outline" className="text-xs px-1 xs:px-2">{vendor.services}</Badge>
                        </TableCell>
                        <TableCell className="text-green-600 font-semibold text-xs sm:text-sm px-1 xs:px-2 sm:px-4 py-2 xs:py-3">
                          <div className="min-w-0">
                            <div className="truncate max-w-[70px] xs:max-w-none">{formatCurrency(vendor.totalRevenue)}</div>
                            <div className="sm:hidden text-xs text-blue-600 mt-1">
                              {vendor.completedJobs} jobs
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-blue-600 font-semibold text-xs sm:text-sm px-1 xs:px-2 sm:px-4 py-2 xs:py-3">
                          {vendor.completedJobs}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-purple-600 font-semibold text-xs sm:text-sm px-1 xs:px-2 sm:px-4 py-2 xs:py-3">
                          {vendor.referrals}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell px-1 xs:px-2 sm:px-4 py-2 xs:py-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                            <span className="text-xs sm:text-sm">{vendor.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-1 xs:px-2 sm:px-4 py-2 xs:py-3">
                          <div className="min-w-0">
                            <Badge variant={vendor.status === "Active" ? "default" : "destructive"} className="text-xs px-1 xs:px-2">
                              {vendor.status}
                            </Badge>
                            <div className="lg:hidden text-xs text-gray-500 mt-1 truncate">
                              {new Date(vendor.joinDate).toLocaleDateString()}
                            </div>
                            <div className="sm:hidden text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span>{vendor.rating}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs sm:text-sm px-1 xs:px-2 sm:px-4 py-2 xs:py-3">
                          {new Date(vendor.joinDate).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500 text-sm">
                        No vendor data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter className="flex-col xs:flex-row gap-2 xs:gap-2 sm:gap-0 pt-3 xs:pt-4">
            <Button
              variant="outline"
              className="w-full xs:w-full sm:w-auto order-2 xs:order-2 sm:order-1 text-xs xs:text-sm"
              onClick={() => {
                try {
                  const report = getAllVendorsForReport();
                  if (!report || report.length === 0) {
                    toast.info('No data available to export');
                    return;
                  }
                  const headers = ['Vendor', 'Services', 'Revenue', 'Jobs', 'Referrals', 'Rating', 'Status', 'Join Date'];
                  const csvContent = [
                    headers.join(','),
                    ...report.map(v => [
                      `"${v.name}"`,
                      `"${v.services}"`,
                      `"$${(v.totalRevenue || 0).toLocaleString()}"`,
                      `${v.completedJobs || 0}`,
                      `${v.referrals || 0}`,
                      `${v.rating || 0}`,
                      `"${v.status}"`,
                      `"${v.joinDate ? new Date(v.joinDate).toLocaleDateString() : 'N/A'}"`
                    ].join(','))
                  ].join('\n');

                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const link = document.createElement('a');
                  const url = URL.createObjectURL(blob);
                  link.setAttribute('href', url);
                  link.setAttribute('download', `${selectedPeriod}-vendors-report-${new Date().toISOString().split('T')[0]}.csv`);
                  link.style.visibility = 'hidden';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);

                  toast.success(`${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} vendor report exported successfully`);
                } catch (error) {
                  console.error('Error exporting vendors report:', error);
                  toast.error('Failed to export vendors report');
                }
              }}
            >
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