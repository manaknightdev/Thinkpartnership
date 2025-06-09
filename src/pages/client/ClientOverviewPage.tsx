import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DollarSign, Users, TrendingUp } from "lucide-react";

const ClientOverviewPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Marketplace Overview</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Welcome to your client portal! Here you can manage your branded sub-marketplace, onboard vendors, and monitor transactions.
      </p>

      {/* Quick Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">235</div>
            <p className="text-xs text-muted-foreground">+18 new vendors this quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,578</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Navigation Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Marketplace Metrics</CardTitle>
            <CardDescription>View key metrics and performance of your marketplace.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Dive into detailed reports on transactions, revenue, and overall marketplace health.
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
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Oversee your network of service providers, approve applications, and update vendor details.
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
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Set up and adjust the commission structure for different services and vendors.
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