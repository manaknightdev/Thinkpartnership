import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";

const CustomerPortal = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-grow p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Customer Portal</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Discover a wide range of trusted home services from our network of vetted professionals.
        </p>

        <div className="max-w-xl mx-auto mb-12">
          <Input type="search" placeholder="Search for services (e.g., 'painter', 'mover', 'inspector')..." className="w-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Placeholder for service categories or featured services */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Painting Services</h3>
            <p className="text-gray-600 dark:text-gray-400">Find professional painters for your home.</p>
            <Button variant="link" className="mt-2" asChild><Link to="#">Browse</Link></Button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Moving Services</h3>
            <p className="text-gray-600 dark:text-gray-400">Reliable movers for a smooth transition.</p>
            <Button variant="link" className="mt-2" asChild><Link to="#">Browse</Link></Button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Home Inspections</h3>
            <p className="text-gray-600 dark:text-gray-400">Thorough inspections for peace of mind.</p>
            <Button variant="link" className="mt-2" asChild><Link to="#">Browse</Link></Button>
          </div>
          {/* More service placeholders can be added here */}
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

export default CustomerPortal;