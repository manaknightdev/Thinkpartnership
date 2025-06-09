import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react";

const ServiceDetailsPage = () => {
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();

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
      image: "https://t3.ftcdn.net/jpg/00/96/57/12/360_F_96571267_qfpHjHTvH8siby0Cey6rTpfiJczIxX3e.jpg"
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
      image: "https://media.istockphoto.com/id/183953925/photo/young-plumber-fixing-a-sink-in-bathroom.jpg?s=612x612&w=0&k=20&c=Ps2U_U4_Z60mIZsuem-BoaHLlCjsT8wYWiXNWR-TCDA="
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
      image: "https://www.shutterstock.com/image-photo/mid-adult-woman-architect-wearing-600nw-2060102018.jpg"
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
      image: "https://media.istockphoto.com/id/475958716/photo/lawn-mower.jpg?s=612x612&w=0&k=20&c=TIGBHDkXS9IJbq84NHtfsFIPp_aqy6APWni2r_oS2NQ="
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
      image: "https://media.istockphoto.com/id/515643040/photo/man-repairing-computer.jpg?s=612x612&w=0&k=20&c=H9NBpHyqc14Rqc1AdFwypY-UXMys0nVYL2EVe8p-mUA="
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
      image: "https://t4.ftcdn.net/jpg/03/06/99/87/360_F_306998742_5awR6uVsZ8dRNdHHnj0tnm4sGUDBAxQ5.jpg"
    },
  };

  const service = serviceName ? mockServiceDetails[serviceName as keyof typeof mockServiceDetails] : undefined;

  if (!service) {
    return (
      <div className="p-4 sm:p-8 text-center">
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
    <div className="p-4 sm:p-8">
      <Button variant="outline" className="mb-6" asChild>
        <Link to="/customer-portal/browse">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Browse Services
        </Link>
      </Button>

      <Card className="overflow-hidden">
        {service.image && (
          <img src={service.image} alt={service.title} className="w-full h-48 sm:h-64 object-cover" />
        )}
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl font-bold">{serviceName}</CardTitle>
          <CardDescription className="text-lg sm:text-xl text-primary">By "{service.vendor}"</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{service.description}</p>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-2">Pricing</h3>
            <p className="text-2xl sm:text-3xl font-bold text-primary">{service.price}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Final price may vary based on scope.</p>
          </div>

          {service.features && service.features.length > 0 && (
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">Key Features</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {service.contact && (
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">Contact Vendor</h3>
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

          <Button size="lg" className="w-full" onClick={() => navigate(`/customer-portal/checkout/${encodeURIComponent(serviceName || '')}`)}>
            Request Service
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceDetailsPage;