import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";

const ClientDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-grow p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Client Dashboard</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
          Welcome to your client portal! Here you can manage your branded sub-marketplace, onboard vendors, and monitor transactions.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Overview</CardTitle>
              <CardDescription>View key metrics and performance of your marketplace.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                (Placeholder for charts, total transactions, active vendors, etc.)
              </p>
              <Button variant="outline" className="mt-4">View Reports</Button>
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
              <Button variant="outline" className="mt-4">Manage Vendors</Button>
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
              <Button variant="outline" className="mt-4">Set Rules</Button>
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

export default ClientDashboard;