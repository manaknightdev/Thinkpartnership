import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Handshake, Users, Home, DollarSign, ShieldCheck, Lightbulb, Quote, Info } from "lucide-react";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">

        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 lg:py-40 text-center bg-gradient-to-br from-blue-600 to-teal-500 dark:from-blue-800 dark:to-teal-700 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 max-w-5xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg animate-fade-in-up">
              ThinkPartnerships: Your Ultimate Referral Ecosystem
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 dark:text-teal-100 mb-10 max-w-3xl mx-auto animate-fade-in-up animate-delay-200">
              Seamlessly connect clients with trusted service providers, manage referral programs, and unlock new revenue streams.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up animate-delay-400">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 hover:text-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1" asChild>
                <Link to="/signup">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-blue-200 text-blue-100 hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1" asChild>
                <Link to="/client-portal">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-20 bg-gray-100 dark:bg-gray-900 px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-6 flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 animate-fade-in-up animate-delay-200">
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

            <Card className="text-center p-6 flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 animate-fade-in-up animate-delay-400">
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

            <Card className="text-center p-6 flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 animate-fade-in-up animate-delay-600">
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

        {/* About Us Section */}
        <section className="w-full py-20 bg-white dark:bg-gray-950 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left animate-fade-in-up">
              <Info className="h-16 w-16 text-blue-600 dark:text-blue-400 mb-6 mx-auto md:mx-0" />
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                At ThinkPartnerships, we believe in the power of connection. Our mission is to create a seamless, transparent, and rewarding ecosystem where businesses can effortlessly expand their service offerings through trusted partnerships, and customers can easily find reliable professionals for their needs.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                We're dedicated to fostering growth, simplifying operations, and building a community where everyone thrives.
              </p>
            </div>
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl animate-fade-in animate-delay-400">
              <img
                src="https://fellow.app/wp-content/uploads/2022/01/team-collaboration.jpg"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white text-shadow">
                <p className="text-xl font-semibold">Building Stronger Connections</p>
                <p className="text-sm opacity-80">Through innovative partnership solutions</p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="w-full py-20 bg-gray-100 dark:bg-gray-900 px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Why Choose ThinkPartnerships?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in-up animate-delay-200">
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
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in-up animate-delay-400">
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
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in-up animate-delay-600">
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
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in-up animate-delay-200">
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
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in-up animate-delay-400">
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
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in-up animate-delay-600">
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
        <section className="w-full py-20 bg-white dark:bg-gray-950 px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-left shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in-up animate-delay-200">
              <CardContent className="p-0 pt-2">
                <Quote className="h-8 w-8 text-gray-400 dark:text-gray-600 mb-4" />
                <p className="italic text-gray-700 dark:text-gray-300 mb-4">
                  "ThinkPartnerships transformed how we manage our referrals. The automated commissions save us so much time!"
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">- Sarah L., Real Estate Broker</p>
              </CardContent>
            </Card>
            <Card className="p-6 text-left shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in-up animate-delay-400">
              <CardContent className="p-0 pt-2">
                <Quote className="h-8 w-8 text-gray-400 dark:text-gray-600 mb-4" />
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg animate-fade-in">Ready to Grow Your Network?</h2>
            <p className="text-xl text-blue-100 dark:text-purple-100 mb-10 animate-fade-in animate-delay-200">
              Join ThinkPartnerships today and revolutionize your referral business.
            </p>
            <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 hover:text-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-fade-in animate-delay-400" asChild>
              <Link to="/signup">Sign Up Now</Link>
            </Button>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Index;