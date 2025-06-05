import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VendorReferralsPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Affiliate/Referral Dashboard</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Track your referred customers and earned commissions.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Referrals</CardTitle>
            <CardDescription>Customers you've referred to the marketplace.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">125</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Last 30 days: +15</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Earned Commissions</CardTitle>
            <CardDescription>Your total earnings from referred purchases.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">$1,250.00</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Pending: $200.00</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>Detailed breakdown of your referrals and commissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            (Placeholder for a table showing referred customers, services purchased, and commission earned.)
          </p>
          <Button variant="outline">View Full Report</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorReferralsPage;