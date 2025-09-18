import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DollarSign, Users, TrendingUp, BarChart, Settings, Handshake, CheckSquare, Clock, AlertTriangle, Loader2, ExternalLink } from "lucide-react";

import ClientAPI, { DashboardStats, ClientOrder } from '@/services/ClientAPI';
import MarketplaceAuthAPI from '@/services/MarketplaceAuthAPI';
import { showError, showSuccess } from '@/utils/toast';

const ClientOverviewPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<ClientOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAccessingMarketplace, setIsAccessingMarketplace] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Fetch dashboard stats and recent orders in parallel
      const [statsData, ordersData] = await Promise.all([
        ClientAPI.getDashboardStats(),
        ClientAPI.getOrders()
      ]);

      setStats(statsData);
      // Get the 3 most recent orders
      const sortedOrders = ordersData.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setRecentOrders(sortedOrders.slice(0, 3));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load dashboard statistics';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatGrowth = (growth: number | undefined) => {
    if (growth === undefined || growth === null) {
      return '+0.0%';
    }
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleViewMarketplace = async () => {
    if (isAccessingMarketplace) return;

    setIsAccessingMarketplace(true);

    try {
      // Get marketplace access token from backend
      const marketplaceAuth = await ClientAPI.getMarketplaceAccess();
      
      if (marketplaceAuth.error) {
        throw new Error(marketplaceAuth.message);
      }

      // Convert client auth response to marketplace auth format
      const marketplaceAuthData = {
        error: marketplaceAuth.error,
        message: marketplaceAuth.message,
        role: marketplaceAuth.role || 'user',
        token: marketplaceAuth.token || marketplaceAuth.access_token,
        access_token: marketplaceAuth.access_token || marketplaceAuth.token,
        refresh_token: marketplaceAuth.refresh_token,
        expire_at: marketplaceAuth.expire_at,
        user_id: marketplaceAuth.user_id,
        client_id: typeof marketplaceAuth.client_id === 'string' ? parseInt(marketplaceAuth.client_id) : marketplaceAuth.client_id,
        client_name: marketplaceAuth.client_name,
        first_name: marketplaceAuth.first_name,
        last_name: marketplaceAuth.last_name,
        email: marketplaceAuth.email,
        is_client_access: marketplaceAuth.is_client_access || true,
        is_admin_impersonation: marketplaceAuth.is_admin_impersonation
      };

      // Store marketplace auth data
      MarketplaceAuthAPI.storeAuthData(marketplaceAuthData);
      
      showSuccess(`Accessing ${marketplaceAuth.client_name || 'your marketplace'}...`);
      
      // Navigate to marketplace
      window.location.href = "/marketplace";
      
    } catch (error: any) {
      console.error('Error accessing marketplace:', error);
      showError(error.message || 'Failed to access marketplace');
      setIsAccessingMarketplace(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg p-6 border border-primary/20">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace Overview</h1>
        <p className="text-lg text-gray-700 mb-4">
          Welcome to your client portal! Here you can manage your branded sub-marketplace, onboard vendors, and monitor transactions.
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button
            onClick={handleViewMarketplace}
            disabled={isAccessingMarketplace}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2 h-10 px-4"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="whitespace-nowrap">
              {isAccessingMarketplace ? 'Accessing...' : 'View Marketplace'}
            </span>
          </Button>
          <Button variant="outline" asChild className="h-10 px-4">
            <Link to="/client-portal/invites" className="flex items-center whitespace-nowrap">
              Invite Users
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-10 px-4">
            <Link to="/client-portal/vendors" className="flex items-center whitespace-nowrap">
              Manage Vendors
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-10 px-4">
            <Link to="/client-portal/branding" className="flex items-center whitespace-nowrap">
              Customize Branding
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(stats?.total_revenue)}
            </div>
            <p className={`text-xs font-medium ${stats && stats.monthly_growth && stats.monthly_growth >= 0 ? 'text-primary' : 'text-red-600'}`}>
              {formatGrowth(stats?.monthly_growth)} from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.active_vendors?.toLocaleString() || '0'}
            </div>
            <p className={`text-xs font-medium ${stats && stats.vendor_growth && stats.vendor_growth >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatGrowth(stats?.vendor_growth)} growth this quarter
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats?.total_customers?.toLocaleString() || '0'}
            </div>
            <p className={`text-xs font-medium ${stats && stats.customer_growth && stats.customer_growth >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
              {formatGrowth(stats?.customer_growth)} from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats?.pending_orders?.toLocaleString() || '0'}
            </div>
            <p className={`text-xs font-medium ${stats && stats.order_growth && stats.order_growth >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
              {formatGrowth(stats?.order_growth)} order growth
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart className="h-5 w-5 text-primary" />
              </div>
              Marketplace Metrics
            </CardTitle>
            <CardDescription>View key metrics and performance of your marketplace.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Dive into detailed reports on transactions, revenue, and overall marketplace health.
            </p>
            <Button className="w-full bg-primary hover:bg-primary/90" asChild>
              <Link to="/client-portal/reports">View Reports</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Handshake className="h-5 w-5 text-blue-600" />
              </div>
              Vendor Management
            </CardTitle>
            <CardDescription>Approve new vendors and manage existing partner profiles.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Oversee your network of service providers, approve applications, and update vendor details.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
              <Link to="/client-portal/vendors">Manage Vendors</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              Revenue Rules
            </CardTitle>
            <CardDescription>Configure commission splits and payout settings for your marketplace.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Set up and adjust the commission structure for different services and vendors.
            </p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
              <Link to="/client-portal/rules">View Rules</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tasks & Follow-ups Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CheckSquare className="h-5 w-5 text-orange-600" />
              </div>
              Tasks & Follow-ups
            </CardTitle>
            <CardDescription>Track your account setup progress and administrative tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-sm text-gray-700">Pending Tasks</span>
                <span className="text-sm font-semibold text-orange-600">2 pending</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">In Progress</span>
                <span className="text-sm font-semibold text-blue-600">1 active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Completed</span>
                <span className="text-sm font-semibold text-green-600">1 done</span>
              </div>
            </div>
            <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
              <Link to="/client-portal/tasks">View All Tasks</Link>
            </Button>
          </CardContent>
        </Card> */}

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-teal-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Clock className="h-5 w-5 text-teal-600" />
              </div>
              Recent Orders
            </CardTitle>
            <CardDescription>Latest orders from your marketplace customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        Order #{order.id} - {order.service_title || 'Service Order'}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {order.customer_name} • ${parseFloat(order.total_amount?.toString() || '0').toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status?.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatTimeAgo(order.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No recent orders</p>
                  <p className="text-xs text-gray-400 mt-1">Orders will appear here once customers start placing them</p>
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/client-portal/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientOverviewPage;