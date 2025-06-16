import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  MessageCircle,
  ShoppingCart,
  Award
} from "lucide-react";

const ServiceDetailsPage = () => {
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const [hasChattedWithSeller, setHasChattedWithSeller] = useState(false);

  // Mock data for service details - in a real app, this would come from an API
  const mockServiceDetails = {
    "Premium Home Painting": {
      vendor: "Brush Strokes Pro",
      description: "Transform your home with high-quality interior and exterior painting services. Our experienced team ensures a flawless finish, using premium paints and meticulous preparation. We handle everything from color consultation to final touch-ups, ensuring your satisfaction.",
      pricingTiers: [
        {
          name: "Basic Interior",
          price: "$500",
          description: "Single room interior painting",
          features: ["1 room", "Basic paint", "Surface prep", "Clean-up"]
        },
        {
          name: "Premium Package",
          price: "$1,200",
          description: "Multiple rooms with premium paint",
          features: ["Up to 3 rooms", "Premium paint", "Surface prep & repair", "2 coats", "Clean-up"]
        },
        {
          name: "Full Home Makeover",
          price: "$3,500",
          description: "Complete interior and exterior",
          features: ["Entire home", "Premium paint", "Full prep & repair", "2-3 coats", "Trim work", "Clean-up"]
        }
      ],
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
      products: [
        {
          name: "Paint Touch-Up Kit",
          price: "$25",
          description: "Small paint touch-ups for minor scratches",
          image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&h=200&fit=crop"
        },
        {
          name: "Color Consultation",
          price: "$75",
          description: "Professional color matching service",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop"
        },
        {
          name: "Paint Samples Set",
          price: "$15",
          description: "Set of 10 paint color samples",
          image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&h=200&fit=crop"
        }
      ],
      image: "https://t3.ftcdn.net/jpg/00/96/57/12/360_F_96571267_qfpHjHTvH8siby0Cey6rTpfiJczIxX3e.jpg"
    },
    "Emergency Plumbing Repair": {
      vendor: "Rapid Plumbers",
      description: "24/7 emergency plumbing services for leaks, clogs, and burst pipes. Our certified plumbers are available around the clock to handle any plumbing emergency quickly and efficiently, minimizing damage and restoring your peace of mind.",
      pricingTiers: [
        {
          name: "Basic Repair",
          price: "$150",
          description: "Simple leak or clog repair",
          features: ["Leak detection", "Basic repair", "1 hour service", "Parts included"]
        },
        {
          name: "Standard Service",
          price: "$300",
          description: "Multiple repairs or installations",
          features: ["Multiple repairs", "Drain cleaning", "2-3 hours service", "All parts included"]
        },
        {
          name: "Emergency Package",
          price: "$500",
          description: "Major repairs or replacements",
          features: ["Major repairs", "Pipe replacement", "Water heater service", "24/7 availability"]
        }
      ],
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
      products: [
        {
          name: "Drain Cleaner",
          price: "$35",
          description: "Professional-grade drain cleaning solution",
          image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200&h=200&fit=crop"
        },
        {
          name: "Emergency Kit",
          price: "$85",
          description: "Basic plumbing emergency repair kit",
          image: "https://images.unsplash.com/photo-1609205264511-b0b5e8b6b8b8?w=200&h=200&fit=crop"
        }
      ],
      image: "https://media.istockphoto.com/id/183953925/photo/young-plumber-fixing-a-sink-in-bathroom.jpg?s=612x612&w=0&k=20&c=Ps2U_U4_Z60mIZsuem-BoaHLlCjsT8wYWiXNWR-TCDA="
    },
    "Full Home Inspection": {
      vendor: "Certified Inspectors Inc.",
      description: "Comprehensive home inspections for buyers and sellers. Our detailed reports cover structural integrity, electrical systems, plumbing, HVAC, roofing, and more, providing you with a clear understanding of the property's condition.",
      pricingTiers: [
        {
          name: "Basic Inspection",
          price: "$300",
          description: "Standard home inspection",
          features: ["Visual inspection", "Basic report", "2-3 hours", "Main systems check"]
        },
        {
          name: "Comprehensive Inspection",
          price: "$500",
          description: "Detailed inspection with testing",
          features: ["Full inspection", "Detailed report", "4-5 hours", "Radon testing", "Photos included"]
        },
        {
          name: "Premium Package",
          price: "$750",
          description: "Complete inspection with extras",
          features: ["Full inspection", "Premium report", "6+ hours", "Radon & termite testing", "Video walkthrough"]
        }
      ],
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
      products: [
        {
          name: "Radon Test Kit",
          price: "$45",
          description: "DIY radon testing kit",
          image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop"
        },
        {
          name: "Home Maintenance Guide",
          price: "$25",
          description: "Comprehensive home maintenance checklist",
          image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop"
        }
      ],
      image: "https://www.shutterstock.com/image-photo/mid-adult-woman-architect-wearing-600nw-2060102018.jpg"
    },
    "Professional Lawn Care": {
      vendor: "Green Thumb Landscaping",
      description: "Regular lawn mowing, fertilization, and garden maintenance to keep your yard pristine. We offer a range of services from basic upkeep to full landscape design and installation, ensuring your outdoor space is always beautiful.",
      pricingTiers: [
        {
          name: "Basic Maintenance",
          price: "$80",
          description: "Weekly lawn mowing and edging",
          features: ["Weekly mowing", "Edging", "Debris removal", "Basic trimming"]
        },
        {
          name: "Full Care Package",
          price: "$150",
          description: "Complete lawn and garden care",
          features: ["Bi-weekly service", "Fertilization", "Weed control", "Shrub trimming", "Seasonal cleanup"]
        },
        {
          name: "Premium Landscaping",
          price: "$300",
          description: "Full landscape design and maintenance",
          features: ["Custom design", "Plant installation", "Irrigation setup", "Monthly maintenance", "Seasonal updates"]
        }
      ],
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
      products: [
        {
          name: "Fertilizer Kit",
          price: "$35",
          description: "Organic lawn fertilizer for DIY application",
          image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop"
        }
      ],
      image: "https://media.istockphoto.com/id/475958716/photo/lawn-mower.jpg?s=612x612&w=0&k=20&c=TIGBHDkXS9IJbq84NHtfsFIPp_aqy6APWni2r_oS2NQ="
    },
    "HVAC System Tune-up": {
      vendor: "Climate Control Experts",
      description: "Seasonal maintenance to ensure your heating and cooling systems run efficiently. Our technicians perform thorough inspections, cleaning, and adjustments to prevent breakdowns and extend the life of your HVAC unit.",
      pricingTiers: [
        {
          name: "Basic Tune-up",
          price: "$120",
          description: "Standard HVAC maintenance",
          features: ["Filter replacement", "Basic inspection", "Cleaning", "Performance check"]
        },
        {
          name: "Complete Service",
          price: "$200",
          description: "Comprehensive HVAC service",
          features: ["Full inspection", "Deep cleaning", "Calibration", "Minor repairs", "Efficiency report"]
        },
        {
          name: "Premium Package",
          price: "$350",
          description: "Full system optimization",
          features: ["Complete overhaul", "Duct cleaning", "Smart thermostat setup", "1-year warranty", "Priority service"]
        }
      ],
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
      products: [
        {
          name: "Air Filter Set",
          price: "$25",
          description: "High-quality HVAC air filters (pack of 4)",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop"
        }
      ],
      image: "https://media.istockphoto.com/id/515643040/photo/man-repairing-computer.jpg?s=612x612&w=0&k=20&c=H9NBpHyqc14Rqc1AdFwypY-UXMys0nVYL2EVe8p-mUA="
    },
    "Deep House Cleaning": {
      vendor: "Sparkling Spaces",
      description: "Thorough cleaning services for homes, including kitchens, bathrooms, and living areas. We use eco-friendly products and a detailed checklist to ensure every corner of your home sparkles.",
      pricingTiers: [
        {
          name: "Standard Clean",
          price: "$200",
          description: "Basic deep cleaning service",
          features: ["Kitchen & bathroom clean", "Vacuuming", "Dusting", "Surface sanitizing"]
        },
        {
          name: "Premium Clean",
          price: "$350",
          description: "Comprehensive cleaning service",
          features: ["Deep kitchen clean", "Bathroom scrub", "Window cleaning", "Appliance cleaning", "Baseboards"]
        },
        {
          name: "Move-in/Move-out",
          price: "$500",
          description: "Complete property cleaning",
          features: ["Full property clean", "Inside appliances", "Cabinet interiors", "Light fixtures", "Carpet cleaning"]
        }
      ],
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
      products: [
        {
          name: "Eco-Friendly Cleaning Kit",
          price: "$45",
          description: "Professional-grade eco-friendly cleaning supplies",
          image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=200&fit=crop"
        }
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
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section with Background Image */}
      <div className="relative h-96 overflow-hidden">
        {service.image && (
          <>
            <img
              src={service.image}
              alt={serviceName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}

        {/* Navigation and Hero Content */}
        <div className="absolute inset-0 flex flex-col">
          <div className="p-4 sm:p-8">
            <Button
              variant="secondary"
              className="mb-6 bg-white/90 hover:bg-white text-black"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>

          <div className="flex-1 flex items-end p-4 sm:p-8">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12 border-2 border-white">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                    {service.vendor.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm opacity-90">Service Provider</p>
                  <p className="font-semibold">{service.vendor}</p>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">{serviceName}</h1>
              <p className="text-lg opacity-90">Professional service provider</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  About This Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  {service.description}
                </p>
              </CardContent>
            </Card>

            {/* Features Card */}
            {service.features && service.features.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product Cards */}
            {service.products && service.products.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <ShoppingCart className="h-6 w-6 text-blue-500" />
                    Additional Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {service.products.map((product, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-blue-600">{product.price}</span>
                          <Button size="sm" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Pricing & Contact */}
          <div className="space-y-6">
            {/* 3-Tier Pricing */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm sticky top-4">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Choose Your Service</CardTitle>
                <CardDescription className="text-base">
                  Select the package that best fits your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {service.pricingTiers?.map((tier, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{tier.name}</h3>
                      <span className="text-xl font-bold text-green-600">{tier.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                    <ul className="text-xs space-y-1">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <Separator />

                <Button
                  size="lg"
                  className="w-full text-lg py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  onClick={() => navigate(`/marketplace/request-service/${encodeURIComponent(serviceName || '')}`)}
                >
                  Request Service Now
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full text-lg py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    setHasChattedWithSeller(true);
                    navigate(`/marketplace/chat/${encodeURIComponent(service.vendor)}`);
                  }}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat with Seller
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Free consultation • No commitment required
                </p>
              </CardContent>
            </Card>

            {/* Contact Card - Only show after chatting */}
            {service.contact && hasChattedWithSeller && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {service.contact.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
                      <div className="p-2 bg-blue-500 rounded-full">
                        <Phone className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{service.contact.phone}</p>
                      </div>
                    </div>
                  )}

                  {service.contact.email && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer">
                      <div className="p-2 bg-purple-500 rounded-full">
                        <Mail className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{service.contact.email}</p>
                      </div>
                    </div>
                  )}

                  {service.contact.address && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer">
                      <div className="p-2 bg-orange-500 rounded-full">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{service.contact.address}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;