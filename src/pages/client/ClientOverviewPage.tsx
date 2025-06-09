import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ClientOverviewPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Marketplace Overview</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Welcome to your client portal! Here you can manage your branded sub-marketplace, onboard vendors, and monitor transactions.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Marketplace Metrics</CardTitle>
            <CardDescription>View key metrics and performance of your marketplace.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              (Placeholder for charts, total transactions, active vendors, etc.)
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/client-portal/reports">View Reports</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Management</CardTitle>
            <CardDescription>Approve new vendors and manage existing partner profiles.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              (Placeholder for vendor list, approval queue, edit vendor details.)
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/client-portal/vendors">Manage Vendors</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Rules</CardTitle>
            <CardDescription>Configure commission splits and payout settings for your marketplace.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              (Placeholder for dynamic revenue sharing rules engine.)
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/client-portal/rules">Set Rules</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientOverviewPage;