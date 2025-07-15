import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart as LineChartIcon, Users, Download, Star, CheckCircle, DollarSign } from "lucide-react";
import { toast } from "sonner";

const ClientReportsPage = () => {
  const mockTopVendors = [
    { name: "Rapid Plumbers", revenue: "$12,500", referrals: 50 },
    { name: "Brush Strokes Pro", revenue: "$9,800", referrals: 40 },
    { name: "Certified Inspectors Inc.", revenue: "$7,200", referrals: 30 },
    { name: "Green Thumb Landscaping", revenue: "$5,100", referrals: 25 },
  ];

  const mockAllVendors = [
    {
      id: "v001",
      name: "Rapid Plumbers",
      services: "Plumbing",
      totalRevenue: 45000,
      completedJobs: 89,

      status: "Active",
      joinDate: "2024-01-15"
    },
    {
      id: "v002",
      name: "Brush Strokes Pro",
      services: "Painting",
      totalRevenue: 32000,
      completedJobs: 67,

      status: "Active",
      joinDate: "2024-02-20"
    },
    {
      id: "v003",
      name: "Certified Inspectors Inc.",
      services: "Inspections",
      totalRevenue: 28000,
      completedJobs: 45,

      status: "Active",
      joinDate: "2024-01-10"
    },
    {
      id: "v004",
      name: "Green Thumb Landscaping",
      services: "Landscaping",
      totalRevenue: 22000,
      completedJobs: 34,

      status: "Active",
      joinDate: "2024-03-05"
    },
    {
      id: "v005",
      name: "Sparky Electric",
      services: "Electrical",
      totalRevenue: 15000,
      completedJobs: 23,
      rating: 4.2,
      status: "Suspended",
      joinDate: "2024-02-01"
    },
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

  const [isAllVendorsReportOpen, setIsAllVendorsReportOpen] = useState(false);

  const handleViewAllVendorsReport = () => {
    setIsAllVendorsReportOpen(true);
  };

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
                {mockTopVendors.map((vendor, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell className="text-green-600 font-semibold">{vendor.revenue}</TableCell>
                    <TableCell className="text-blue-600 font-semibold">{vendor.referrals}</TableCell>
                  </TableRow>
                ))}
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
                  <p className="text-2xl font-bold text-blue-600">{mockAllVendors.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary">
                    ${mockAllVendors.reduce((sum, v) => sum + v.totalRevenue, 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {mockAllVendors.reduce((sum, v) => sum + v.completedJobs, 0)}
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
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAllVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{vendor.services}</Badge>
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        ${vendor.totalRevenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-blue-600 font-semibold">
                        {vendor.completedJobs}
                      </TableCell>

                      <TableCell>
                        <Badge variant={vendor.status === "Active" ? "default" : "destructive"}>
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(vendor.joinDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
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