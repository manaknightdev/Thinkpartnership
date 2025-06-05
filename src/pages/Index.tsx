import { MadeWithDyad } from "@/components/made-with-dyad";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Handshake, Users, Home, DollarSign, ShieldCheck, Lightbulb } from "lucide-react"; // Importing icons

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">

        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 lg:py-40 text-center bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-800 dark:to-purple-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 max-w-5xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              ThinkPartnerships: Your Ultimate Referral Ecosystem
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 dark:text-purple-100 mb-10 max-w-3xl mx-auto">
              Seamlessly connect clients with trusted service providers, manage referral programs, and unlock new revenue streams.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 hover:text-blue-800 transition-colors shadow-lg" asChild>
                <Link to="/signup">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 transition-colors shadow-lg" asChild>
                <Link to="/client-portal">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-20 bg-gray-100 dark:bg-gray-900 px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-6 flex flex-col items-center">
              <Handshake className="h-16 w-16 text-primary mb-4" />
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-2xl">For Clients (Licensees)</CardTitle>
                <CardDescription>Build your branded referral marketplace.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Launch a sub-marketplace, onboard vendors, and track all transactions under your brand.
                </p>
                <Button variant="secondary" asChild>
                  <Link to="/client-portal">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-6 flex flex-col items-center">
              <Users className="h-16 w-16 text-primary mb-4" />
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-2xl">For Referral Partners (Vendors)</CardTitle>
                <CardDescription>List services, refer customers, earn commissions.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Expand your reach, invite your clients, and get paid when they use other services.
                </p>
                <Button variant="secondary" asChild>
                  <Link to="/vendor-portal">Join as a Vendor</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-6 flex flex-col items-center">
              <Home className="h-16 w-16 text-primary mb-4" />
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-2xl">For Customers</CardTitle>
                <CardDescription>Find vetted home service providers easily.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  One-stop shop to find and purchase services from a trusted network of professionals.
                </p>
                <Button variant="secondary" asChild>
                  <Link to="/customer-portal">Browse Services</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="w-full py-20 bg-white dark:bg-gray-950 px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose ThinkPartnerships?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-6">
              <CardHeader className="p-0 pb-4 flex-row items-center space-x-4">
                <DollarSign className="h-10 w-10 text-blue-600" />
                <CardTitle className="text-xl">Automated Commissions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 dark:text-gray-400">
                  Effortlessly track and manage referral commissions with our integrated system.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader className="p-0 pb-4 flex-row items-center space-x-4">
                <ShieldCheck className="h-10 w-10 text-green-600" />
                <CardTitle className="text-xl">Vetted Professionals</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 dark:text-gray-400">
                  Access a network of pre-screened and trusted home service providers.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader className="p-0 pb-4 flex-row items-center space-x-4">
                <Lightbulb className="h-10 w-10 text-yellow-600" />
                <CardTitle className="text-xl">Customizable Marketplaces</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 dark:text-gray-400">
                  Clients can create their own branded sub-marketplaces with ease.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader className="p-0 pb-4 flex-row items-center space-x-4">
                <Handshake className="h-10 w-10 text-purple-600" />
                <CardTitle className="text-xl">Seamless Referrals</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 dark:text-gray-400">
                  Simple tools for vendors to invite customers and track their referrals.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader className="p-0 pb-4 flex-row items-center space-x-4">
                <Users className="h-10 w-10 text-red-600" />
                <CardTitle className="text-xl">Centralized Management</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 dark:text-gray-400">
                  Manage all aspects of your referral program from one intuitive dashboard.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader className="p-0 pb-4 flex-row items-center space-x-4">
                <Home className="h-10 w-10 text-teal-600" />
                <CardTitle className="text-xl">Diverse Service Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 dark:text-gray-400">
                  Offer a wide range of home services to meet every customer need.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-20 bg-gray-100 dark:bg-gray-900 px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-left">
              <CardContent className="p-0 pt-2">
                <p className="italic text-gray-700 dark:text-gray-300 mb-4">
                  "ThinkPartnerships transformed how we manage our referrals. The automated commissions save us so much time!"
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">- Sarah L., Real Estate Broker</p>
              </CardContent>
            </Card>
            <Card className="p-6 text-left">
              <CardContent className="p-0 pt-2">
                <p className="italic text-gray-700 dark:text-gray-300 mb-4">
                  "Joining as a vendor was incredibly easy. I'm reaching new clients and earning commissions effortlessly."
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">- John P., Local Plumber</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final Call to Action Section */}
        <section className="w-full py-20 bg-gradient-to-r from-purple-700 to-blue-600 dark:from-purple-900 dark:to-blue-800 text-white text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">Ready to Grow Your Network?</h2>
            <p className="text-xl text-blue-100 dark:text-purple-100 mb-10">
              Join ThinkPartnerships today and revolutionize your referral business.
            </p>
            <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 hover:text-purple-800 transition-colors shadow-lg" asChild>
              <Link to="/signup">Sign Up Now</Link>
            </Button>
          </div>
        </section>

      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;