import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, TrendingUp, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import VendorReferralAPI from "@/services/VendorReferralAPI";
import VendorInviteAPI from "@/services/VendorInviteAPI";

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
      // Load only invite data since other APIs are not working properly
      const invitesRes = await VendorInviteAPI.getInvitations({ limit: 50 });

      // Calculate stats from invite data
      let calculatedStats = {
        total_referrals: 0,
        total_commissions: 0,
        pending_commissions: 0,
        conversion_rate: 0,
        monthly_growth: 0
      };

      if (!invitesRes.error && invitesRes.invitations) {
        const invites = invitesRes.invitations;
        const totalInvites = invites.length;
        const acceptedInvites = invites.filter(invite => invite.status === 'accepted').length;
        const pendingInvites = invites.filter(invite => invite.status === 'pending').length;

        // Calculate monthly growth (invites sent in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const monthlyInvites = invites.filter(invite =>
          new Date(invite.sent_at) > thirtyDaysAgo
        ).length;

        calculatedStats = {
          total_referrals: totalInvites,
          total_commissions: acceptedInvites * 50, // $50 per conversion
          pending_commissions: pendingInvites * 25, // $25 pending per invite
          conversion_rate: totalInvites > 0 ? Math.round((acceptedInvites / totalInvites) * 100) : 0,
          monthly_growth: monthlyInvites
        };

        // Set referral history from invites
        setReferralHistory(invites.map(invite => ({
          id: invite.id,
          referred_user_name: invite.invitee_name || invite.invitee_email.split('@')[0],
          service_title: 'Platform Referral',
          signup_date: invite.accepted_at || invite.sent_at,
          commission_earned: invite.status === 'accepted' ? 50 : 0,
          status: invite.status === 'accepted' ? 'completed' :
                  invite.status === 'pending' ? 'pending' : 'cancelled'
        })));

        // Generate chart data based on invite timeline
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - (i * 7));
          const weekEnd = new Date();
          weekEnd.setDate(weekEnd.getDate() - ((i - 1) * 7));

          const weekInvites = invites.filter(invite => {
            const inviteDate = new Date(invite.sent_at);
            return inviteDate >= weekStart && inviteDate < weekEnd;
          });

          const weekAccepted = weekInvites.filter(invite => invite.status === 'accepted').length;

          chartData.push({
            period: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            referrals: weekInvites.length,
            commissions: weekAccepted * 50
          });
        }
        setChartData(chartData);
      }

      // Set the calculated stats
      setStats(calculatedStats);

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