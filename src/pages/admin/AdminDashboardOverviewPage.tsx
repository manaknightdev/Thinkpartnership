import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockOverallData = [
  { name: 'Jan', revenue: 12000, vendors: 10, transactions: 50 },
  { name: 'Feb', revenue: 15000, vendors: 12, transactions: 65 },
  { name: 'Mar', revenue: 18000, vendors: 15, transactions: 80 },
  { name: 'Apr', revenue: 17000, vendors: 16, transactions: 75 },
  { name: 'May', revenue: 20000, vendors: 18, transactions: 90 },
  { name: 'Jun', revenue: 23000, vendors: 20, transactions: 105 },
];

const AdminDashboardOverviewPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard Overview</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        A quick glance at the overall health and performance of the marketplace.
      </p>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.2M</div>
            <p className="text-xs text-muted-foreground">+15% from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">250</div>
            <p className="text-xs text-muted-foreground">+20 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,800</div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Vendors</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Review applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Marketplaces live</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Marketplace Performance Trends</CardTitle>
          <CardDescription>Revenue, Vendors, and Transactions over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={mockOverallData}
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
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue ($)" />
              <Line type="monotone" dataKey="vendors" stroke="#82ca9d" name="Vendors" />
              <Line type="monotone" dataKey="transactions" stroke="#ffc658" name="Transactions" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardOverviewPage;