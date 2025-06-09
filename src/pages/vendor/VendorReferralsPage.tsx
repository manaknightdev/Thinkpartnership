import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link for navigation

const VendorReferralsPage = () => {
  const mockReferralData = [
    { name: 'Week 1', referrals: 5, commissions: 100 },
    { name: 'Week 2', referrals: 8, commissions: 150 },
    { name: 'Week 3', referrals: 12, commissions: 220 },
    { name: 'Week 4', referrals: 10, commissions: 180 },
    { name: 'Week 5', referrals: 15, commissions: 300 },
    { name: 'Week 6', referrals: 13, commissions: 250 },
  ];

  const mockReferralHistory = [
    { id: "ref001", customer: "Alice Smith", service: "Home Painting", date: "2023-10-26", commission: "$50.00", status: "Paid" },
    { id: "ref002", customer: "Bob Johnson", service: "Emergency Plumbing", date: "2023-10-20", commission: "$25.00", status: "Paid" },
    { id: "ref003", customer: "Charlie Brown", service: "HVAC Check-up", date: "2023-10-15", commission: "$30.00", status: "Pending" },
    { id: "ref004", customer: "Diana Prince", service: "Landscaping Design", date: "2023-10-10", commission: "$70.00", status: "Paid" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Affiliate/Referral Dashboard</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Track your referred customers and earned commissions.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground">+15 last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earned Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,250.00</div>
            <p className="text-xs text-muted-foreground">Pending: $200.00</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground">Target: 15%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Referral & Commission Trends</CardTitle>
          <CardDescription>Performance over the last 6 weeks.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={mockReferralData}
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
              <Line type="monotone" dataKey="referrals" stroke="#8884d8" name="Referrals" />
              <Line type="monotone" dataKey="commissions" stroke="#82ca9d" name="Commissions ($)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>Detailed breakdown of your referrals and commissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReferralHistory.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">{referral.customer}</TableCell>
                    <TableCell>{referral.service}</TableCell>
                    <TableCell>{referral.date}</TableCell>
                    <TableCell>{referral.commission}</TableCell>
                    <TableCell>{referral.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/vendor-portal/referrals/full-report">View Full Report</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorReferralsPage;