import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DollarSign, Users, TrendingUp, BarChart, Settings, Handshake, CheckSquare, Clock, AlertTriangle } from "lucide-react"; // Importing new icons

const ClientOverviewPage = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace Overview</h1>
        <p className="text-lg text-gray-700 mb-4">
          Welcome to your client portal! Here you can manage your branded sub-marketplace, onboard vendors, and monitor transactions.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-green-600 hover:bg-green-700" asChild>
            <Link to="/client-portal/invites">Invite Users</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/client-portal/vendors">Manage Vendors</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/client-portal/branding">Customize Branding</Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$45,231.89</div>
            <p className="text-xs text-green-600 font-medium">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">235</div>
            <p className="text-xs text-blue-600 font-medium">+18 new vendors this quarter</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">1,578</div>
            <p className="text-xs text-purple-600 font-medium">+5.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart className="h-5 w-5 text-green-600" />
              </div>
              Marketplace Metrics
            </CardTitle>
            <CardDescription>View key metrics and performance of your marketplace.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Dive into detailed reports on transactions, revenue, and overall marketplace health.
            </p>
            <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
              <Link to="/client-portal/reports">View Reports</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Handshake className="h-5 w-5 text-blue-600" />
              </div>
              Vendor Management
            </CardTitle>
            <CardDescription>Approve new vendors and manage existing partner profiles.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Oversee your network of service providers, approve applications, and update vendor details.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
              <Link to="/client-portal/vendors">Manage Vendors</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              Revenue Rules
            </CardTitle>
            <CardDescription>Configure commission splits and payout settings for your marketplace.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Set up and adjust the commission structure for different services and vendors.
            </p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
              <Link to="/client-portal/rules">Set Rules</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tasks & Follow-ups Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CheckSquare className="h-5 w-5 text-orange-600" />
              </div>
              Tasks & Follow-ups
            </CardTitle>
            <CardDescription>Track your account setup progress and administrative tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-sm text-gray-700">Pending Tasks</span>
                <span className="text-sm font-semibold text-orange-600">2 pending</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">In Progress</span>
                <span className="text-sm font-semibold text-blue-600">1 active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Completed</span>
                <span className="text-sm font-semibold text-green-600">1 done</span>
              </div>
            </div>
            <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
              <Link to="/client-portal/tasks">View All Tasks</Link>
            </Button>
          </CardContent>
        </Card> */}

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-teal-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Clock className="h-5 w-5 text-teal-600" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates and actions on your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Payment Setup Completed</span>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">Branding Review Started</span>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-sm text-gray-700">Onboarding Task Assigned</span>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/client-portal/tasks">View Task History</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientOverviewPage;