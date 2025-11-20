import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from "sonner";
import { Download, BarChart as BarChartIcon, TrendingUp, Users, Calendar, DollarSign, Activity, FileText } from "lucide-react";

const mockOverallRevenueData = [
  { name: 'Jan', totalRevenue: 50000, platformRevenue: 2500 },
  { name: 'Feb', totalRevenue: 60000, platformRevenue: 3000 },
  { name: 'Mar', totalRevenue: 75000, platformRevenue: 3750 },
  { name: 'Apr', totalRevenue: 70000, platformRevenue: 3500 },
  { name: 'May', totalRevenue: 85000, platformRevenue: 4250 },
  { name: 'Jun', totalRevenue: 90000, platformRevenue: 4500 },
];

const mockTopClients = [
  { name: "Client A", totalRevenueGenerated: "$350,000", activeVendors: 15, transactions: 1200 },
  { name: "Client B", totalRevenueGenerated: "$280,000", activeVendors: 10, transactions: 950 },
  { name: "Client C", totalRevenueGenerated: "$190,000", activeVendors: 8, transactions: 700 },
];

const mockTopVendors = [
  { name: "Rapid Plumbers", totalRevenue: "$80,000", referrals: 300, client: "Client A" },
  { name: "Brush Strokes Pro", totalRevenue: "$75,000", referrals: 280, client: "Client B" },
  { name: "Certified Inspectors Inc.", totalRevenue: "$60,000", referrals: 220, client: "Client A" },
];

const AdminReportsPage = () => {
  const handleExportAllReports = async () => {
    try {
      toast.info("Preparing reports data export...");

      // Create comprehensive CSV content with all report data
      const headers = ['Report Type', 'Client/Vendor', 'Revenue', 'Platform Revenue', 'Referrals', 'Period'];
      const csvContent = [
        headers.join(','),
        // Overall revenue data
        ...mockOverallRevenueData.map(item => [
          'Overall Revenue',
          `"${item.client}"`,
          `"$${item.totalRevenue.toLocaleString()}"`,
          `"$${item.platformRevenue.toLocaleString()}"`,
          'N/A',
          `"${item.month}"`
        ].join(',')),
        // Top clients data
        ...mockTopClients.map(client => [
          'Top Client',
          `"${client.name}"`,
          `"${client.totalRevenue}"`,
          'N/A',
          client.referrals,
          'Current Period'
        ].join(',')),
        // Top vendors data
        ...mockTopVendors.map(vendor => [
          'Top Vendor',
          `"${vendor.name}"`,
          `"${vendor.totalRevenue}"`,
          'N/A',
          vendor.referrals,
          'Current Period'
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `admin-reports-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Reports data exported successfully!');
    } catch (error) {
      console.error('Error exporting reports data:', error);
      toast.error('Failed to export reports data. Please try again.');
    }
  };

  // Calculate summary stats
  const totalRevenue = mockOverallRevenueData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const platformRevenue = mockOverallRevenueData.reduce((sum, item) => sum + item.platformRevenue, 0);
  const totalClients = mockTopClients.length;
  const totalVendors = mockTopVendors.length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive insights into marketplace performance and growth metrics
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Select defaultValue="monthly">
            <SelectTrigger className="w-40" aria-label="Select Report Period">
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
          <Button onClick={handleExportAllReports} className="bg-purple-600 hover:bg-purple-700" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
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
                <DollarSign className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${platformRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Vendors</p>
                <p className="text-2xl font-bold text-gray-900">{totalVendors}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" /> Revenue Performance Trends
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Total revenue generated and platform's share over the last 6 months
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Detailed Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={mockOverallRevenueData}
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
                dataKey="totalRevenue"
                stroke="#7c3aed"
                strokeWidth={3}
                name="Total Revenue ($)"
                activeDot={{ r: 6, fill: '#7c3aed' }}
                dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="platformRevenue"
                stroke="#047857"
                strokeWidth={3}
                name="Platform Share ($)"
                dot={{ fill: '#047857', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChartIcon className="h-5 w-5" /> Top Performing Clients
          </CardTitle>
          <CardDescription>Clients generating the most revenue for the marketplace.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Total Revenue Generated</TableHead>
                  <TableHead>Active Vendors</TableHead>
                  <TableHead>Total Transactions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTopClients.map((client, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.totalRevenueGenerated}</TableCell>
                    <TableCell>{client.activeVendors}</TableCell>
                    <TableCell>{client.transactions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockTopClients} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalRevenueGenerated" fill="#8884d8" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Top Performing Vendors
          </CardTitle>
          <CardDescription>Vendors with the highest revenue and referrals across all clients.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Client Marketplace</TableHead>
                  <TableHead>Total Revenue</TableHead>
                  <TableHead>Total Referrals</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTopVendors.map((vendor, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.client}</TableCell>
                    <TableCell>{vendor.totalRevenue}</TableCell>
                    <TableCell>{vendor.referrals}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <Button onClick={handleExportAllReports} size="lg">
          <Download className="mr-2 h-5 w-5" /> Export All Reports
        </Button>
      </div>
    </div>
  );
};

export default AdminReportsPage;