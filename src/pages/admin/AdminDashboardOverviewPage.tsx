import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, TrendingUp, CheckCircle, Clock, ArrowUpRight, AlertTriangle, Activity, CheckSquare, Plus, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";
import { ActivityLogModal } from "@/components/modals/ActivityLogModal";
import { SystemStatusModal } from "@/components/modals/SystemStatusModal";
import AdminAPI from '@/services/AdminAPI';
import { showError } from '@/utils/toast';

const mockOverallData = [
  { name: 'Jan', revenue: 12000, vendors: 10, transactions: 50 },
  { name: 'Feb', revenue: 15000, vendors: 12, transactions: 65 },
  { name: 'Mar', revenue: 18000, vendors: 15, transactions: 80 },
  { name: 'Apr', revenue: 17000, vendors: 16, transactions: 75 },
  { name: 'May', revenue: 20000, vendors: 18, transactions: 90 },
  { name: 'Jun', revenue: 23000, vendors: 20, transactions: 105 },
];

const AdminDashboardOverviewPage = () => {
  const navigate = useNavigate();
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const [isSystemStatusOpen, setIsSystemStatusOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState(null);
  const [chartData, setChartData] = useState(mockOverallData);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch dashboard stats and revenue analytics in parallel
        const [statsResponse, revenueResponse] = await Promise.all([
          AdminAPI.getDashboardStats(),
          AdminAPI.getRevenueAnalytics()
        ]);

        if (statsResponse.error) {
          showError('Failed to fetch dashboard statistics');
        } else {
          setDashboardStats(statsResponse.stats);
        }

        if (revenueResponse.error) {
          showError('Failed to fetch revenue analytics');
        } else {
          setRevenueAnalytics(revenueResponse.revenue_data);
        }

        // Transform revenue analytics data for chart after both API calls complete
        if (!statsResponse.error && !revenueResponse.error &&
          revenueResponse.revenue_data && Array.isArray(revenueResponse.revenue_data)) {
          const transformedData = revenueResponse.revenue_data.map((item, index) => ({
            name: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
            revenue: parseFloat(item.total_revenue || '0'),
            vendors: statsResponse.stats?.total_vendors || (10 + index), // Use actual vendor count or fallback
            transactions: parseInt(item.transactions?.toString() || '0')
          }));
          setChartData(transformedData);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewReports = () => {
    navigate('/admin-portal/reports');
    toast.info("Navigating to detailed reports...");
  };

  const handleExportData = async () => {
    try {
      toast.info("Preparing dashboard data export...");

      // Create comprehensive CSV content with dashboard data
      const headers = ['Metric Type', 'Metric Name', 'Value', 'Period'];
      const csvContent = [
        headers.join(','),
        // Dashboard stats
        ...(dashboardStats ? [
          ['Dashboard Stats', 'Total Clients', dashboardStats.total_clients || 0, 'Current'],
          ['Dashboard Stats', 'Total Vendors', dashboardStats.total_vendors || 0, 'Current'],
          ['Dashboard Stats', 'Total Customers', dashboardStats.total_customers || 0, 'Current'],
          ['Dashboard Stats', 'Total Transactions', dashboardStats.total_transactions || 0, 'Current'],
          ['Dashboard Stats', 'Platform Revenue', `"${dashboardStats.total_platform_revenue || '$0'}"`, 'Total'],
          ['Dashboard Stats', 'Monthly Revenue', `"${dashboardStats.month_revenue || '$0'}"`, 'Current Month'],
          ['Dashboard Stats', 'Active Clients', dashboardStats.active_clients || 0, 'Current'],
          ['Dashboard Stats', 'Active Vendors', dashboardStats.active_vendors || 0, 'Current'],
          ['Dashboard Stats', 'Pending Vendors', dashboardStats.pending_vendors || 0, 'Current'],
          ['Dashboard Stats', 'Pending Clients', dashboardStats.pending_clients || 0, 'Current'],
          ['Dashboard Stats', 'Pending Orders', dashboardStats.pending_orders || 0, 'Current']
        ] : []).map(row => row.join(',')),
        // Revenue analytics
        ...(revenueAnalytics ? revenueAnalytics.map(item => [
          'Revenue Analytics',
          `"${item.month}"`,
          `"${item.total_revenue}"`,
          'Monthly'
        ].join(',')) : []),
        // Chart data
        ...chartData.map(item => [
          'Chart Data',
          `"${item.name}"`,
          `"Revenue: $${item.revenue}, Vendors: ${item.vendors}, Transactions: ${item.transactions}"`,
          'Monthly'
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `admin-dashboard-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Dashboard data exported successfully!');
    } catch (error) {
      console.error('Error exporting dashboard data:', error);
      showError('Failed to export dashboard data. Please try again.');
    }
  };

  const handleReviewAll = () => {
    navigate('/admin-portal/vendor-approvals');
    toast.info("Navigating to vendor approvals...");
  };

  const handleViewActivityLog = () => {
    setIsActivityLogOpen(true);
    toast.info("Opening activity log...");
  };

  const handleSystemStatus = () => {
    setIsSystemStatusOpen(true);
    toast.info("Opening system status dashboard...");
  };

  const handleViewTasks = () => {
    navigate('/admin-portal/tasks');
    toast.info("Navigating to tasks...");
  };

  const handleCreateTask = () => {
    navigate('/admin-portal/tasks');
    toast.info("Navigating to create new task...");
  };

  const handleViewDetails = () => {
    navigate('/admin-portal/reports');
    toast.info("Navigating to detailed performance reports...");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
          <p className="text-gray-600 mt-2">
            Monitor the overall health and performance of your marketplace platform
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          {/* <Button variant="outline" size="sm" onClick={handleViewReports}>
            <Activity className="h-4 w-4 mr-2" />
            View Reports
          </Button> */}
          <Button onClick={handleExportData} className="bg-purple-600 hover:bg-purple-700" size="sm">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-green-700" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <div className="text-2xl font-bold text-gray-400">Loading...</div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-900">
                  ${dashboardStats?.total_platform_revenue ?
                    parseFloat(dashboardStats.total_platform_revenue.toString()).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }) : '0.00'}
                </div>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-700 mr-1" />
                  <p className="text-xs text-green-700 font-medium">
                    +0.0% from last month
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Vendors</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <div className="text-2xl font-bold text-gray-400">Loading...</div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats?.active_vendors || 0}</div>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-700 mr-1" />
                  <p className="text-xs text-green-700 font-medium">+0.0% growth this quarter</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Clients</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <div className="text-2xl font-bold text-gray-400">Loading...</div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats?.total_clients || 0}</div>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-700 mr-1" />
                  <p className="text-xs text-green-700 font-medium">+0.0% growth this quarter</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
            <div className="p-2 bg-pink-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-pink-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <div className="text-2xl font-bold text-gray-400">Loading...</div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats?.total_customers || 0}</div>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-700 mr-1" />
                  <p className="text-xs text-green-700 font-medium">+0.0% from last month</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <div className="text-2xl font-bold text-gray-400">Loading...</div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats?.pending_orders || 0}</div>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-700 mr-1" />
                  <p className="text-xs text-green-700 font-medium">+0.0% order growth</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Platform Performance Trends</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Revenue, vendor growth, and transaction volume over the last 6 months
              </CardDescription>
            </div>
            {/* <Button onClick={handleViewDetails} variant="outline" size="sm">
              View Details
            </Button> */}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-[350px]">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-gray-500">Loading analytics...</span>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  name="Revenue ($)"
                  dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="vendors"
                  stroke="#059669"
                  strokeWidth={3}
                  name="Vendors"
                  dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="transactions"
                  stroke="#dc2626"
                  strokeWidth={3}
                  name="Transactions"
                  dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ActivityLogModal
        isOpen={isActivityLogOpen}
        onClose={() => setIsActivityLogOpen(false)}
      />
      <SystemStatusModal
        isOpen={isSystemStatusOpen}
        onClose={() => setIsSystemStatusOpen(false)}
      />
    </div>
  );
};

export default AdminDashboardOverviewPage;