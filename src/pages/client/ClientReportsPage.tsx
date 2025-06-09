import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";

const ClientReportsPage = () => {
  const mockTopVendors = [
    { name: "Rapid Plumbers", revenue: "$12,500", referrals: 50 },
    { name: "Brush Strokes Pro", revenue: "$9,800", referrals: 40 },
    { name: "Certified Inspectors Inc.", revenue: "$7,200", referrals: 30 },
    { name: "Green Thumb Landscaping", revenue: "$5,100", referrals: 25 },
  ];

  const mockRevenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 5500 },
  ];

  const handleGenerateReport = () => {
    toast.info("Generating custom report...");
  };

  const handleViewAllVendorsReport = () => {
    toast.info("Navigating to all vendors report...");
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Reports & Analytics</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Access detailed reports and analytics for your marketplace performance.
      </p>

      <div className="flex justify-end mb-4">
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
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Marketplace Performance Overview</CardTitle>
          <CardDescription>Revenue and transaction trends over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={mockRevenueData}
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
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
          <Button onClick={handleGenerateReport} variant="outline" className="mt-4">Generate Custom Report</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Vendors</CardTitle>
          <CardDescription>Vendors with the highest revenue and referrals.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Total Referrals</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTopVendors.map((vendor, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.revenue}</TableCell>
                  <TableCell>{vendor.referrals}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleViewAllVendorsReport} variant="outline" className="mt-4">View All Vendors Report</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientReportsPage;