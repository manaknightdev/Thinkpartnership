import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlobalNavbar } from "@/components/GlobalNavbar"; // Use GlobalNavbar
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CustomerPortal = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <GlobalNavbar /> {/* Use GlobalNavbar */}
      <main className="flex-grow p-4 sm:p-8 text-center pt-20">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Customer Portal</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Discover a wide range of trusted home services from our network of vetted professionals.
        </p>

        <div className="max-w-xl mx-auto mb-12">
          <Input type="search" placeholder="Search for services (e.g., 'painter', 'mover', 'inspector')..." className="w-full" />
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Button variant="outline" className="h-24 text-lg">Plumbing</Button>
            <Button variant="outline" className="h-24 text-lg">Electrical</Button>
            <Button variant="outline" className="h-24 text-lg">Cleaning</Button>
            <Button variant="outline" className="h-24 text-lg">Landscaping</Button>
            <Button variant="outline" className="h-24 text-lg">HVAC</Button>
            <Button variant="outline" className="h-24 text-lg">Painting</Button>
            <Button variant="outline" className="h-24 text-lg">Moving</Button>
            <Button variant="outline" className="h-24 text-lg">Inspections</Button>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Featured Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="text-left">
              <CardHeader>
                <CardTitle>Premium Home Painting</CardTitle>
                <CardDescription>By "Brush Strokes Pro"</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Transform your home with high-quality interior and exterior painting services. Experienced and reliable.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary">$500+</span>
                  <Button>View Details</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardHeader>
                <CardTitle>Emergency Plumbing Repair</CardTitle>
                <CardDescription>By "Rapid Plumbers"</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  24/7 emergency plumbing services for leaks, clogs, and burst pipes. Fast response guaranteed.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary">$150+</span>
                  <Button>View Details</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardHeader>
                <CardTitle>Full Home Inspection</CardTitle>
                <CardDescription>By "Certified Inspectors Inc."</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Comprehensive home inspections for buyers and sellers. Detailed reports and expert advice.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary">$300+</span>
                  <Button>View Details</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="text-left">
              <CardContent className="pt-6">
                <p className="italic text-gray-700 dark:text-gray-300 mb-4">
                  "Found a fantastic painter through this portal! The process was smooth and the quality was excellent."
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">- Jane D.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Service: Painting</p>
              </CardContent>
            </Card>
            <Card className="text-left">
              <CardContent className="pt-6">
                <p className="italic text-gray-700 dark:text-gray-300 mb-4">
                  "Quick and reliable plumbing service. Highly recommend using this platform to find local pros."
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">- Mark S.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Service: Plumbing</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CustomerPortal;