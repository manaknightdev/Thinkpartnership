import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, TrendingUp, CheckCircle, Clock, ArrowUpRight, AlertTriangle, Activity, CheckSquare, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";
import { ActivityLogModal } from "@/components/modals/ActivityLogModal";
import { SystemStatusModal } from "@/components/modals/SystemStatusModal";

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

  const handleViewReports = () => {
    navigate('/admin-portal/reports');
    toast.info("Navigating to detailed reports...");
  };

  const handleExportData = () => {
    toast.info("Exporting platform data...");
    // In a real app, this would trigger a data export
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
          <Button variant="outline" size="sm" onClick={handleViewReports}>
            <Activity className="h-4 w-4 mr-2" />
            View Reports
          </Button>
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
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">$1.2M</div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-green-600 font-medium">+15% from last quarter</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Vendors</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">250</div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-green-600 font-medium">+20 new this month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Transactions</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">5,800</div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-green-600 font-medium">+10% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Vendors</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="flex items-center mt-1">
              <AlertTriangle className="h-3 w-3 text-orange-500 mr-1" />
              <p className="text-xs text-orange-600 font-medium">Requires review</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Clients</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">5</div>
            <div className="flex items-center mt-1">
              <CheckCircle className="h-3 w-3 text-emerald-500 mr-1" />
              <p className="text-xs text-emerald-600 font-medium">Marketplaces live</p>
            </div>
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
            <Button onClick={handleViewDetails} variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={mockOverallData}
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
        </CardContent>
      </Card>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 text-orange-600 mr-2" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-sm text-gray-700">Vendor Applications</span>
              <span className="text-sm font-semibold text-orange-600">12 pending</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">License Renewals</span>
              <span className="text-sm font-semibold text-blue-600">3 expiring</span>
            </div>
            <Button onClick={handleReviewAll} className="w-full bg-purple-600 hover:bg-purple-700 mt-4">
              Review All
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-700">New Vendor Approved</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">Commission Rule Updated</span>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
            <Button onClick={handleViewActivityLog} variant="outline" className="w-full mt-4">
              View Activity Log
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <CheckSquare className="h-5 w-5 text-blue-600 mr-2" />
              Tasks & Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-700">Overdue Tasks</span>
              <span className="text-sm font-semibold text-red-600">1 overdue</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-sm text-gray-700">Due Today</span>
              <span className="text-sm font-semibold text-orange-600">2 pending</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">In Progress</span>
              <span className="text-sm font-semibold text-blue-600">1 active</span>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleViewTasks} variant="outline" className="flex-1">
                View All
              </Button>
              <Button onClick={handleCreateTask} className="flex-1 bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-1" />
                New Task
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 text-purple-600 mr-2" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-700">API Status</span>
              <span className="text-sm font-semibold text-green-600">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-700">Database</span>
              <span className="text-sm font-semibold text-green-600">Healthy</span>
            </div>
            <Button onClick={handleSystemStatus} variant="outline" className="w-full mt-4">
              System Status
            </Button>
          </CardContent>
        </Card>
      </div>

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