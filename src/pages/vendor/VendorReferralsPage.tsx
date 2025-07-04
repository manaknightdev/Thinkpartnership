import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import VendorReferralAPI from "@/services/VendorReferralAPI";

const VendorReferralsPage = () => {
  // State for API data
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_referrals: 0,
    total_commissions: 0,
    pending_commissions: 0,
    conversion_rate: 0,
    monthly_growth: 0
  });
  const [chartData, setChartData] = useState([]);
  const [referralHistory, setReferralHistory] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    setLoading(true);
    try {
      // Load stats, referrals, and analytics in parallel
      const [statsRes, referralsRes, analyticsRes] = await Promise.all([
        VendorReferralAPI.getReferralStats(),
        VendorReferralAPI.getReferrals({ limit: 10 }), // Get recent 10 referrals
        VendorReferralAPI.getReferralAnalytics({ period: 'week' })
      ]);

      // Update stats
      if (!statsRes.error && statsRes.data) {
        setStats({
          total_referrals: statsRes.data.total_referrals || 0,
          total_commissions: statsRes.data.total_commission_earned || 0,
          pending_commissions: statsRes.data.pending_commission || 0,
          conversion_rate: statsRes.data.conversion_rate || 0,
          monthly_growth: statsRes.data.this_month_referrals || 0
        });
      }

      // Update referral history
      if (!referralsRes.error && referralsRes.data?.referrals) {
        setReferralHistory(referralsRes.data.referrals);
      }

      // Update chart data
      if (!analyticsRes.error && analyticsRes.data?.chart_data) {
        setChartData(analyticsRes.data.chart_data);
      }

    } catch (error) {
      console.error('Error loading referral data:', error);
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state for initial load
  if (loading && stats.total_referrals === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading referral dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="text-2xl font-bold">
              {loading ? '...' : stats.total_referrals.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : `+${stats.monthly_growth} last 30 days`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earned Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : `$${stats.total_commissions.toFixed(2)}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : `Pending: $${stats.pending_commissions.toFixed(2)}`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : `${stats.conversion_rate.toFixed(1)}%`}
            </div>
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
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading referral history...
                    </TableCell>
                  </TableRow>
                ) : referralHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No referrals found. Start referring customers to earn commissions!
                    </TableCell>
                  </TableRow>
                ) : (
                  referralHistory.map((referral: any) => (
                    <TableRow key={referral.id}>
                      <TableCell className="font-medium">
                        {referral.referred_user_name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {referral.service_title || 'General Referral'}
                      </TableCell>
                      <TableCell>
                        {new Date(referral.signup_date || referral.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        ${(referral.commission_earned || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          referral.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : referral.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {referral.status === 'completed' ? 'Paid' :
                           referral.status === 'pending' ? 'Pending' :
                           referral.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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