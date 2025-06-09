import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, Home, Wrench, Paintbrush, Leaf, Lightbulb, Truck, Building2, CheckCircle } from "lucide-react";

const CustomerBrowseServicesPage = () => {
  const handleSearch = () => {
    toast.info("Searching for services...");
  };

  const handleViewDetails = (serviceName: string) => {
    toast.info(`Viewing details for ${serviceName}...`);
  };

  const mockCategories = [
    { name: "Plumbing", icon: Wrench },
    { name: "Electrical", icon: Lightbulb },
    { name: "Cleaning", icon: CheckCircle },
    { name: "Landscaping", icon: Leaf },
    { name: "HVAC", icon: Home },
    { name: "Painting", icon: Paintbrush },
    { name: "Moving", icon: Truck },
    { name: "Inspections", icon: Building2 },
  ];

  const mockFeaturedServices = [
    {
      title: "Premium Home Painting",
      vendor: "Brush Strokes Pro",
      description: "Transform your home with high-quality interior and exterior painting services. Experienced and reliable.",
      price: "$500+",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba38135?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Emergency Plumbing Repair",
      vendor: "Rapid Plumbers",
      description: "24/7 emergency plumbing services for leaks, clogs, and burst pipes. Fast response guaranteed.",
      price: "$150+",
      image: "https://images.unsplash.com/photo-1581092910300-f91677972761?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Full Home Inspection",
      vendor: "Certified Inspectors Inc.",
      description: "Comprehensive home inspections for buyers and sellers. Detailed reports and expert advice.",
      price: "$300+",
      image: "https://images.unsplash.com/photo-1560448204-e02f1123d356?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Professional Lawn Care",
      vendor: "Green Thumb Landscaping",
      description: "Regular lawn mowing, fertilization, and garden maintenance to keep your yard pristine.",
      price: "$80+",
      image: "https://images.unsplash.com/photo-1518621736915-f218812f276b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "HVAC System Tune-up",
      vendor: "Climate Control Experts",
      description: "Seasonal maintenance to ensure your heating and cooling systems run efficiently.",
      price: "$120+",
      image: "https://images.unsplash.com/photo-1583912229130-e0f3301f121e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Deep House Cleaning",
      vendor: "Sparkling Spaces",
      description: "Thorough cleaning services for homes, including kitchens, bathrooms, and living areas.",
      price: "$200+",
      image: "https://images.unsplash.com/photo-1581578731548-adab4975807f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome to the Customer Portal</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        Discover a wide range of trusted home services from our network of vetted professionals.
      </p>

      <div className="max-w-xl mx-auto mb-12 flex space-x-2">
        <Input type="search" placeholder="Search for services (e.g., 'painter', 'mover', 'inspector')..." className="flex-grow" />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" /> Search
        </Button>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {mockCategories.map((category) => (
            <Button key={category.name} variant="outline" className="h-28 flex flex-col items-center justify-center text-lg p-4">
              <category.icon className="h-8 w-8 mb-2 text-primary" />
              {category.name}
            </Button>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Featured Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {mockFeaturedServices.map((service, index) => (
            <Card key={index} className="text-left overflow-hidden">
              {service.image && (
                <img src={service.image} alt={service.title} className="w-full h-48 object-cover" />
              )}
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>By "{service.vendor}"</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary">{service.price}</span>
                  <Button onClick={() => handleViewDetails(service.title)}>View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">What Our Customers Say</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
    </div>
  );
};

export default CustomerBrowseServicesPage;