import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from "sonner";
import { Download, BarChart as BarChartIcon, TrendingUp, Users } from "lucide-react"; // Added Users import

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
  const handleExportAllReports = () => {
    toast.info("Exporting all reports data...");
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Marketplace Usage & Reporting</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Comprehensive reports on marketplace performance, client activity, and vendor contributions.
      </p>

      <div className="flex justify-end mb-4">
        <Select defaultValue="monthly">
          <SelectTrigger className="w-full sm:w-[180px]">
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
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Overall Revenue Trend
          </CardTitle>
          <CardDescription>Total revenue generated and platform's share over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={mockOverallRevenueData}
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
              <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" name="Total Revenue ($)" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="platformRevenue" stroke="#82ca9d" name="Platform Share ($)" />
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