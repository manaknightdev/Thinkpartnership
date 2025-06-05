import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";

const VendorDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-grow p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Vendor Dashboard</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
          Welcome to your vendor portal! Here you can list your services, invite customers, and track your referral commissions.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Profile & Services</CardTitle>
              <CardDescription>Update your company information and manage your service listings.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                (Placeholder for company bio, contact info, service categories, pricing.)
              </p>
              <Button variant="outline" className="mt-4">Edit Profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referral Dashboard</CardTitle>
              <CardDescription>Track your referred customers and earned commissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                (Placeholder for referral link generation, customer list, commission history.)
              </p>
              <Button variant="outline" className="mt-4">View Referrals</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invite Customers</CardTitle>
              <CardDescription>Generate unique links or codes to invite your clients to the marketplace.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                (Placeholder for invite link generator and sharing options.)
              </p>
              <Button variant="outline" className="mt-4">Generate Link</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;