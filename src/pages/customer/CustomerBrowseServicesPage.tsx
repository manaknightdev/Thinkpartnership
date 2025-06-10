import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { toast } from "sonner";
import {
  Search,
  Home,
  Wrench,
  Paintbrush,
  Leaf,
  Lightbulb,
  Truck,
  Building2,
  CheckCircle,
  Star,
  MapPin,
  Clock,
  Shield,
  TrendingUp,
  Award,
  Users,
  Zap
} from "lucide-react";

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
    {
      name: "Plumbing",
      icon: Wrench,
      count: 24,
      color: "bg-blue-500",
      description: "Pipes, leaks, installations"
    },
    {
      name: "Electrical",
      icon: Lightbulb,
      count: 18,
      color: "bg-yellow-500",
      description: "Wiring, outlets, lighting"
    },
    {
      name: "Cleaning",
      icon: CheckCircle,
      count: 32,
      color: "bg-green-500",
      description: "Deep clean, maintenance"
    },
    {
      name: "Landscaping",
      icon: Leaf,
      count: 15,
      color: "bg-emerald-500",
      description: "Lawn care, garden design"
    },
    {
      name: "HVAC",
      icon: Home,
      count: 12,
      color: "bg-orange-500",
      description: "Heating, cooling, ventilation"
    },
    {
      name: "Painting",
      icon: Paintbrush,
      count: 21,
      color: "bg-purple-500",
      description: "Interior, exterior, touch-ups"
    },
    {
      name: "Moving",
      icon: Truck,
      count: 8,
      color: "bg-red-500",
      description: "Relocation, packing, storage"
    },
    {
      name: "Inspections",
      icon: Building2,
      count: 9,
      color: "bg-indigo-500",
      description: "Home, safety, compliance"
    },
  ];

  const mockFeaturedServices = [
    {
      title: "Premium Home Painting",
      vendor: "Brush Strokes Pro",
      description: "Transform your home with high-quality interior and exterior painting services. Experienced and reliable.",
      price: "$500+",
      rating: 4.9,
      reviews: 127,
      responseTime: "2 hours",
      verified: true,
      tags: ["Interior", "Exterior", "Eco-friendly"],
      image: "https://t3.ftcdn.net/jpg/00/96/57/12/360_F_96571267_qfpHjHTvH8siby0Cey6rTpfiJczIxX3e.jpg"
    },
    {
      title: "Emergency Plumbing Repair",
      vendor: "Rapid Plumbers",
      description: "24/7 emergency plumbing services for leaks, clogs, and burst pipes. Fast response guaranteed.",
      price: "$150+",
      rating: 4.8,
      reviews: 89,
      responseTime: "30 mins",
      verified: true,
      tags: ["24/7", "Emergency", "Licensed"],
      image: "https://media.istockphoto.com/id/183953925/photo/young-plumber-fixing-a-sink-in-bathroom.jpg?s=612x612&w=0&k=20&c=Ps2U_U4_Z60mIZsuem-BoaHLlCjsT8wYWiXNWR-TCDA="
    },
    {
      title: "Full Home Inspection",
      vendor: "Certified Inspectors Inc.",
      description: "Comprehensive home inspections for buyers and sellers. Detailed reports and expert advice.",
      price: "$300+",
      rating: 4.9,
      reviews: 156,
      responseTime: "1 day",
      verified: true,
      tags: ["Certified", "Detailed Reports", "Pre-purchase"],
      image: "https://www.shutterstock.com/image-photo/mid-adult-woman-architect-wearing-600nw-2060102018.jpg"
    },
    {
      title: "Professional Lawn Care",
      vendor: "Green Thumb Landscaping",
      description: "Regular lawn mowing, fertilization, and garden maintenance to keep your yard pristine.",
      price: "$80+",
      rating: 4.7,
      reviews: 203,
      responseTime: "4 hours",
      verified: true,
      tags: ["Weekly Service", "Organic", "Seasonal"],
      image: "https://media.istockphoto.com/id/475958716/photo/lawn-mower.jpg?s=612x612&w=0&k=20&c=TIGBHDkXS9IJbq84NHtfsFIPp_aqy6APWni2r_oS2NQ="
    },
    {
      title: "HVAC System Tune-up",
      vendor: "Climate Control Experts",
      description: "Seasonal maintenance to ensure your heating and cooling systems run efficiently.",
      price: "$120+",
      rating: 4.8,
      reviews: 94,
      responseTime: "6 hours",
      verified: true,
      tags: ["Maintenance", "Energy Efficient", "Warranty"],
      image: "https://media.istockphoto.com/id/515643040/photo/man-repairing-computer.jpg?s=612x612&w=0&k=20&c=H9NBpHyqc14Rqc1AdFwypY-UXMys0nVYL2EVe8p-mUA="
    },
    {
      title: "Deep House Cleaning",
      vendor: "Sparkling Spaces",
      description: "Thorough cleaning services for homes, including kitchens, bathrooms, and living areas.",
      price: "$200+",
      rating: 4.9,
      reviews: 178,
      responseTime: "3 hours",
      verified: true,
      tags: ["Deep Clean", "Eco-friendly", "Insured"],
      image: "https://t4.ftcdn.net/jpg/03/06/99/87/360_F_306998742_5awR6uVsZ8dRNdHHnj0tnm4sGUDBAxQ5.jpg"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-green-800 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-green-900/30" />
        <div className="relative container mx-auto px-4 sm:px-8 py-16 sm:py-24">
          <div className="max-w-4xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400">
                Home Service
              </span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-slate-200 max-w-2xl leading-relaxed">
              Connect with trusted, verified professionals for all your home improvement needs.
              Quality service, guaranteed satisfaction.
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mb-8">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="What service do you need? (e.g., 'plumber', 'painter', 'cleaner'...)"
                  className="h-14 pl-12 pr-32 text-lg bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-2xl text-gray-900 placeholder:text-gray-500"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <Button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-300" />
                <span>500+ Verified Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-300" />
                <span>100% Satisfaction Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-teal-300" />
                <span>Fast Response Times</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-8 py-12">
        {/* Categories Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find the right professional for your specific needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {mockCategories.map((category) => (
              <HoverCard key={category.name}>
                <HoverCardTrigger asChild>
                  <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <category.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                        {category.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {category.count} services
                      </Badge>
                    </CardContent>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent className="w-64">
                  <div className="space-y-2">
                    <h4 className="font-semibold">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{category.count} available services</span>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </section>

        {/* Featured Services Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Featured Services
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Top-rated professionals ready to help
              </p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Most Popular</span>
            </div>
          </div>

          <div className="relative px-12">
            <Carousel className="w-full max-w-6xl mx-auto">
              <CarouselContent className="-ml-4">
                {mockFeaturedServices.map((service, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="group overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                      <div className="relative">
                        {service.image && (
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute top-4 left-4 flex gap-2">
                          {service.verified && (
                            <Badge className="bg-green-500 text-white">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Badge variant="secondary" className="bg-white/90 text-gray-900">
                            <Clock className="h-3 w-3 mr-1" />
                            {service.responseTime}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-900">{service.rating}</span>
                          </div>
                        </div>
                      </div>

                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          {service.vendor}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {service.description}
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {service.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <span className="text-2xl font-bold text-primary">{service.price}</span>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Users className="h-3 w-3" />
                              <span>{service.reviews} reviews</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleViewDetails(service.title)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-6 bg-white/90 hover:bg-white border shadow-lg" />
              <CarouselNext className="hidden md:flex -right-6 bg-white/90 hover:bg-white border shadow-lg" />
            </Carousel>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="text-center">
          <Card className="max-w-4xl mx-auto border-0 bg-white/80 backdrop-blur-sm shadow-lg dark:bg-slate-800/80">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Need Help Finding the Right Service?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Our customer support team is here to help you find the perfect professional for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="outline" className="bg-white hover:bg-gray-50">
                  <MapPin className="h-5 w-5 mr-2" />
                  Browse by Location
                </Button>
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Users className="h-5 w-5 mr-2" />
                  Get Personalized Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default CustomerBrowseServicesPage;