import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { MarketplaceLayout } from "@/components/MarketplaceLayout";
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

  Clock,
  Shield,
  Users,
  Heart,
  ArrowRight,
  Bookmark,
  Eye,
  Verified,
  Crown
} from "lucide-react";

const CustomerBrowseServicesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    // Navigate to all services with search parameters
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    navigate(`/marketplace/services?${params.toString()}`);
  };

  const handleViewDetails = (serviceName: string) => {
    // Navigate to the marketplace service details page
    navigate(`/marketplace/services/${encodeURIComponent(serviceName)}`);
  };

  const mockCategories = [
    {
      name: "Cleaning",
      icon: CheckCircle,
      count: 32,
      color: "bg-green-500",
      description: "Deep clean, maintenance"
    },
    {
      name: "Electrical",
      icon: Lightbulb,
      count: 18,
      color: "bg-yellow-500",
      description: "Wiring, outlets, lighting"
    },
    {
      name: "HVAC",
      icon: Home,
      count: 12,
      color: "bg-orange-500",
      description: "Heating, cooling, ventilation"
    },
    {
      name: "Inspections",
      icon: Building2,
      count: 9,
      color: "bg-indigo-500",
      description: "Home, safety, compliance"
    },
    {
      name: "Landscaping",
      icon: Leaf,
      count: 15,
      color: "bg-emerald-500",
      description: "Lawn care, garden design"
    },
    {
      name: "Moving",
      icon: Truck,
      count: 8,
      color: "bg-red-500",
      description: "Relocation, packing, storage"
    },
    {
      name: "Painting",
      icon: Paintbrush,
      count: 21,
      color: "bg-purple-500",
      description: "Interior, exterior, touch-ups"
    },
    {
      name: "Plumbing",
      icon: Wrench,
      count: 24,
      color: "bg-blue-500",
      description: "Pipes, leaks, installations"
    },
  ];

  const mockFeaturedServices = [
    {
      title: "Premium Home Painting",
      vendor: "Brush Strokes Pro",
      vendorLevel: "Top Rated",
      description: "Transform your home with high-quality interior and exterior painting services. Experienced and reliable.",
      price: "$500",
      originalPrice: "$650",
      responseTime: "2 hours",
      verified: true,
      deliveryTime: "3-5 days",
      tags: ["Interior", "Exterior", "Eco-friendly"],
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center",
      vendorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      isLiked: false,
      completedOrders: 150
    },
    {
      title: "Emergency Plumbing Repair",
      vendor: "Rapid Plumbers",
      vendorLevel: "Pro",
      description: "24/7 emergency plumbing services for leaks, clogs, and burst pipes. Fast response guaranteed.",
      price: "$150",
      originalPrice: "$200",
      responseTime: "30 mins",
      verified: true,
      deliveryTime: "Same day",
      tags: ["24/7", "Emergency", "Licensed"],
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&crop=center",
      vendorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      isLiked: true,
      completedOrders: 89
    },
    {
      title: "Full Home Inspection",
      vendor: "Certified Inspectors Inc.",
      vendorLevel: "Top Rated",
      description: "Comprehensive home inspections for buyers and sellers. Detailed reports and expert advice.",
      price: "$300",
      originalPrice: "$400",
      responseTime: "1 day",
      verified: true,
      deliveryTime: "2-3 days",
      tags: ["Certified", "Detailed Reports", "Pre-purchase"],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center",
      vendorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      isLiked: false,
      completedOrders: 200
    },
    {
      title: "Professional Lawn Care",
      vendor: "Green Thumb Landscaping",
      vendorLevel: "Pro",
      description: "Regular lawn mowing, fertilization, and garden maintenance to keep your yard pristine.",
      price: "$80",
      originalPrice: "$120",
      responseTime: "4 hours",
      verified: true,
      deliveryTime: "Weekly",
      tags: ["Weekly Service", "Organic", "Seasonal"],
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center",
      vendorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      isLiked: false,
      completedOrders: 300
    },
    {
      title: "HVAC System Tune-up",
      vendor: "Climate Control Experts",
      vendorLevel: "Top Rated",
      description: "Seasonal maintenance to ensure your heating and cooling systems run efficiently.",
      price: "$120",
      originalPrice: "$180",
      responseTime: "6 hours",
      verified: true,
      deliveryTime: "1-2 days",
      tags: ["Maintenance", "Energy Efficient", "Warranty"],
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop&crop=center",
      vendorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      isLiked: true,
      completedOrders: 120
    },
    {
      title: "Deep House Cleaning",
      vendor: "Sparkling Spaces",
      vendorLevel: "Pro",
      description: "Thorough cleaning services for homes, including kitchens, bathrooms, and living areas.",
      price: "$200",
      originalPrice: "$280",
      responseTime: "3 hours",
      verified: true,
      deliveryTime: "Same day",
      tags: ["Deep Clean", "Eco-friendly", "Insured"],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
      vendorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      isLiked: false,
      completedOrders: 250
    },
  ];

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section - Modern Marketplace Style */}
        <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-8">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-gray-900 leading-tight">
              Find the perfect
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {" "}service{" "}
              </span>
              for your home
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Connect with trusted professionals in your area. Quality guaranteed, satisfaction promised.
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <Input
                  type="search"
                  placeholder="What service do you need? Try 'home cleaning', 'plumbing repair', 'painting'..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-16 pl-16 pr-40 text-lg bg-white border-2 border-gray-200 rounded-2xl shadow-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 text-gray-900 placeholder:text-gray-500 transition-all duration-300"
                />
                <Button
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-10 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <span className="text-gray-500 text-base font-medium">Popular:</span>
              {["Home Cleaning", "Plumbing", "Painting", "Landscaping", "HVAC", "Electrical"].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm(term);
                    handleSearch();
                  }}
                  className="rounded-full border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all duration-300 px-4 py-2"
                >
                  {term}
                </Button>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold">Verified Professionals</div>
                  <div className="text-sm text-gray-500">Background checked</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="font-semibold">Quality Guaranteed</div>
                  <div className="text-sm text-gray-500">100% satisfaction</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Fast Response</div>
                  <div className="text-sm text-gray-500">Quick turnaround</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Premium Top-Rated Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="h-6 w-6 text-yellow-500" />
              <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-4 py-2 rounded-full font-semibold">Premium Services</Badge>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Top-Rated Premium Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our exclusive premium services from the highest-rated professionals. Quality guaranteed with priority support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {mockFeaturedServices.map((service, index) => (
              <Card key={index} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white rounded-2xl relative">
                {/* Premium Badge */}
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>

                <div className="relative overflow-hidden rounded-t-2xl">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Heart Icon */}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                    <Heart className={`w-5 h-5 ${service.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>

                  {/* Vendor Level Badge */}
                  <div className="absolute top-4 left-16">
                    <Badge className={`${service.vendorLevel === 'Top Rated' ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} text-white text-sm px-3 py-1 rounded-full shadow-lg`}>
                      {service.vendorLevel === 'Top Rated' && <Verified className="w-3 h-3 mr-1" />}
                      {service.vendorLevel}
                    </Badge>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Button size="sm" className="bg-white/90 text-gray-700 hover:bg-white rounded-full w-10 h-10 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-white/90 text-gray-700 hover:bg-white rounded-full w-10 h-10 p-0">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Vendor Info */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <img
                      src={service.vendorImage}
                      alt={service.vendor}
                      className="w-10 h-10 rounded-full border-3 border-white shadow-lg"
                    />
                    <div className="text-white">
                      <div className="text-sm font-semibold">{service.vendor}</div>
                      <div className="text-xs opacity-90">{service.completedOrders} orders completed</div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        Verified Pro
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{service.responseTime} response</span>
                    </div>
                  </div>

                  {/* Service Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.tags.slice(0, 2).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs bg-gray-100 text-gray-600 rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xl font-bold text-gray-900">{service.price}</span>
                        {service.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">{service.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{service.deliveryTime}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleViewDetails(service.title)}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      View Premium
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white transition-all duration-300 px-8 py-3 text-lg font-semibold"
              onClick={() => navigate('/marketplace/services')}
            >
              {/* <Crown className="w-5 h-5 mr-2" /> */}
              View All Services
            </Button>
          </div>
        </section>

        {/* Enhanced Categories Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Popular Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect professional for any home service you need
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {mockCategories.map((category) => (
              <Card key={category.name} className="group cursor-pointer transition-all duration-500 hover:shadow-2xl border-0 bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50 rounded-2xl overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-base mb-2 text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {category.description}
                  </p>
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                    {category.count} services
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 px-8"
              onClick={() => navigate('/marketplace/categories')}
            >
              View All Categories
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>



        {/* Enhanced Call-to-Action Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-12 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Get Started?
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Connect with our top-rated service providers in your area. Quality work from trusted professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate('/marketplace/services')}
                >
                  Browse All Services
                </Button>
              </div>
            </div>
          </div>
        </section>


      </div>
    </div>
    </MarketplaceLayout>
  );
};

export default CustomerBrowseServicesPage;