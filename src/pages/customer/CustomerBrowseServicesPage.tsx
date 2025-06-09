import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, Home, Wrench, Paintbrush, Leaf, Lightbulb, Truck, Building2, CheckCircle } from "lucide-react";

const CustomerBrowseServicesPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSearch = () => {
    toast.info("Searching for services...");
  };

  const handleViewDetails = (serviceName: string) => {
    // Navigate to the new service details page
    navigate(`/customer-portal/services/${encodeURIComponent(serviceName)}`);
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
      image: "https://t3.ftcdn.net/jpg/00/96/57/12/360_F_96571267_qfpHjHTvH8siby0Cey6rTpfiJczIxX3e.jpg"
    },
    {
      title: "Emergency Plumbing Repair",
      vendor: "Rapid Plumbers",
      description: "24/7 emergency plumbing services for leaks, clogs, and burst pipes. Fast response guaranteed.",
      price: "$150+",
      image: "https://media.istockphoto.com/id/183953925/photo/young-plumber-fixing-a-sink-in-bathroom.jpg?s=612x612&w=0&k=20&c=Ps2U_U4_Z60mIZsuem-BoaHLlCjsT8wYWiXNWR-TCDA="
    },
    {
      title: "Full Home Inspection",
      vendor: "Certified Inspectors Inc.",
      description: "Comprehensive home inspections for buyers and sellers. Detailed reports and expert advice.",
      price: "$300+",
      image: "https://www.shutterstock.com/image-photo/mid-adult-woman-architect-wearing-600nw-2060102018.jpg"
    },
    {
      title: "Professional Lawn Care",
      vendor: "Green Thumb Landscaping",
      description: "Regular lawn mowing, fertilization, and garden maintenance to keep your yard pristine.",
      price: "$80+",
      image: "https://media.istockphoto.com/id/475958716/photo/lawn-mower.jpg?s=612x612&w=0&k=20&c=TIGBHDkXS9IJbq84NHtfsFIPp_aqy6APWni2r_oS2NQ="
    },
    {
      title: "HVAC System Tune-up",
      vendor: "Climate Control Experts",
      description: "Seasonal maintenance to ensure your heating and cooling systems run efficiently.",
      price: "$120+",
      image: "https://media.istockphoto.com/id/515643040/photo/man-repairing-computer.jpg?s=612x612&w=0&k=20&c=H9NBpHyqc14Rqc1AdFwypY-UXMys0nVYL2EVe8p-mUA="
    },
    {
      title: "Deep House Cleaning",
      vendor: "Sparkling Spaces",
      description: "Thorough cleaning services for homes, including kitchens, bathrooms, and living areas.",
      price: "$200+",
      image: "https://t4.ftcdn.net/jpg/03/06/99/87/360_F_306998742_5awR6uVsZ8dRNdHHnj0tnm4sGUDBAxQ5.jpg"
    },
  ];

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-left">Welcome to the Customer Portal</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl text-left">
        Discover a wide range of trusted home services from our network of vetted professionals.
      </p>

      <div className="max-w-xl mb-12 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 text-left">
        <Input type="search" placeholder="Search for services (e.g., 'painter', 'mover', 'inspector')..." className="flex-grow" />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" /> Search
        </Button>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-left">Browse by Category</h2>
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
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-left">Featured Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
    </div>
  );
};

export default CustomerBrowseServicesPage;