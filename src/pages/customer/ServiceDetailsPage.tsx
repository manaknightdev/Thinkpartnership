import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react";

const ServiceDetailsPage = () => {
  const { serviceName } = useParams<{ serviceName: string }>();

  // Mock data for service details - in a real app, this would come from an API
  const mockServiceDetails = {
    "Premium Home Painting": {
      vendor: "Brush Strokes Pro",
      description: "Transform your home with high-quality interior and exterior painting services. Our experienced team ensures a flawless finish, using premium paints and meticulous preparation. We handle everything from color consultation to final touch-ups, ensuring your satisfaction.",
      price: "$500+",
      contact: {
        email: "brushstrokes@example.com",
        phone: "(555) 111-2222",
        address: "123 Art Street, City, State"
      },
      features: [
        "Free color consultation",
        "Interior & exterior painting",
        "Surface preparation & repair",
        "Eco-friendly paint options",
        "Satisfaction guarantee"
      ],
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3825b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    "Emergency Plumbing Repair": {
      vendor: "Rapid Plumbers",
      description: "24/7 emergency plumbing services for leaks, clogs, and burst pipes. Our certified plumbers are available around the clock to handle any plumbing emergency quickly and efficiently, minimizing damage and restoring your peace of mind.",
      price: "$150+",
      contact: {
        email: "rapidplumbers@example.com",
        phone: "(555) 333-4444",
        address: "456 Water Lane, City, State"
      },
      features: [
        "24/7 emergency service",
        "Leak detection & repair",
        "Drain cleaning & unclogging",
        "Water heater repair/installation",
        "Pipe replacement"
      ],
      image: "https://images.unsplash.com/photo-1582210256130-6d771118616e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    "Full Home Inspection": {
      vendor: "Certified Inspectors Inc.",
      description: "Comprehensive home inspections for buyers and sellers. Our detailed reports cover structural integrity, electrical systems, plumbing, HVAC, roofing, and more, providing you with a clear understanding of the property's condition.",
      price: "$300+",
      contact: {
        email: "inspectors@example.com",
        phone: "(555) 555-6666",
        address: "789 Survey Road, City, State"
      },
      features: [
        "Pre-purchase inspections",
        "Pre-listing inspections",
        "Radon testing",
        "Termite inspections",
        "Detailed digital reports"
      ],
      image: "https://images.unsplash.com/photo-1560448204-e02f1123d356?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    "Professional Lawn Care": {
      vendor: "Green Thumb Landscaping",
      description: "Regular lawn mowing, fertilization, and garden maintenance to keep your yard pristine. We offer a range of services from basic upkeep to full landscape design and installation, ensuring your outdoor space is always beautiful.",
      price: "$80+",
      contact: {
        email: "greenthumb@example.com",
        phone: "(555) 777-8888",
        address: "101 Garden Path, City, State"
      },
      features: [
        "Lawn mowing & edging",
        "Fertilization & weed control",
        "Shrub & tree trimming",
        "Seasonal clean-ups",
        "Landscape design"
      ],
      image: "https://images.unsplash.com/photo-1518621736915-f218812f276b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    "HVAC System Tune-up": {
      vendor: "Climate Control Experts",
      description: "Seasonal maintenance to ensure your heating and cooling systems run efficiently. Our technicians perform thorough inspections, cleaning, and adjustments to prevent breakdowns and extend the life of your HVAC unit.",
      price: "$120+",
      contact: {
        email: "hvac@example.com",
        phone: "(555) 999-0000",
        address: "202 Climate Way, City, State"
      },
      features: [
        "AC & heating maintenance",
        "Filter replacement",
        "Duct cleaning",
        "Thermostat calibration",
        "Emergency repairs"
      ],
      image: "https://images.unsplash.com/photo-1583912229130-e0f3301f121e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    "Deep House Cleaning": {
      vendor: "Sparkling Spaces",
      description: "Thorough cleaning services for homes, including kitchens, bathrooms, and living areas. We use eco-friendly products and a detailed checklist to ensure every corner of your home sparkles.",
      price: "$200+",
      contact: {
        email: "sparklingspaces@example.com",
        phone: "(555) 222-1111",
        address: "303 Clean Street, City, State"
      },
      features: [
        "Kitchen & bathroom deep clean",
        "Floor cleaning & vacuuming",
        "Dusting & sanitizing surfaces",
        "Window cleaning (interior)",
        "Move-in/move-out cleaning"
      ],
      image: "https://images.unsplash.com/photo-1581578731548-adab4975807f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
  };

  const service = serviceName ? mockServiceDetails[serviceName as keyof typeof mockServiceDetails] : undefined;

  if (!service) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">Service Not Found</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          The service you are looking for does not exist.
        </p>
        <Button asChild>
          <Link to="/customer-portal/browse">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Browse Services
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Button variant="outline" className="mb-6" asChild>
        <Link to="/customer-portal/browse">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Browse Services
        </Link>
      </Button>

      <Card className="overflow-hidden">
        {service.image && (
          <img src={service.image} alt={service.title} className="w-full h-64 object-cover" />
        )}
        <CardHeader>
          <CardTitle className="text-4xl font-bold">{serviceName}</CardTitle>
          <CardDescription className="text-xl text-primary">By "{service.vendor}"</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{service.description}</p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-2">Pricing</h3>
            <p className="text-3xl font-bold text-primary">{service.price}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Final price may vary based on scope.</p>
          </div>

          {service.features && service.features.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-2">Key Features</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {service.contact && (
            <div>
              <h3 className="text-2xl font-semibold mb-2">Contact Vendor</h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                {service.contact.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground" /> {service.contact.phone}
                  </p>
                )}
                {service.contact.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" /> {service.contact.email}
                  </p>
                )}
                {service.contact.address && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" /> {service.contact.address}
                  </p>
                )}
              </div>
            </div>
          )}

          <Button size="lg" className="w-full">Request Service</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceDetailsPage;