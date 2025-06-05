import { MadeWithDyad } from "@/components/made-with-dyad";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <section className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            Your Central Hub for Home Services & Referrals
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            Connect clients with trusted service providers, manage referral programs, and earn commissions effortlessly.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link to="/client-portal">For Businesses</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/customer-portal">Find Services</Link>
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
          <Card className="text-center">
            <CardHeader>
              <CardTitle>For Clients (Licensees)</CardTitle>
              <CardDescription>Manage your own branded referral ecosystem.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Launch a sub-marketplace under your brand, onboard vendors, and track all transactions.
              </p>
              <Button variant="secondary" asChild>
                <Link to="/client-portal">Learn More</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle>For Referral Partners (Vendors)</CardTitle>
              <CardDescription>List services, refer customers, and earn commissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Expand your reach, invite your clients, and get paid when they use other services.
              </p>
              <Button variant="secondary" asChild>
                <Link to="/vendor-portal">Join as a Vendor</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle>For Customers</CardTitle>
              <CardDescription>One-stop shop for vetted home service providers.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Easily find and purchase services from a trusted network of professionals.
              </p>
              <Button variant="secondary" asChild>
                <Link to="/customer-portal">Browse Services</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;