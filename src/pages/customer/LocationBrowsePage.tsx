import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import {
  Search,
  MapPin,
  Navigation,
  Clock,
  Star,
  Users,
  Zap,
  Shield,
  ArrowRight,
  Map,
  Locate,
  Globe
} from "lucide-react";

const LocationBrowsePage = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedRadius, setSelectedRadius] = useState("10");

  // Mock location data
  const popularLocations = [
    {
      name: "Downtown",
      serviceCount: 245,
      avgRating: 4.8,
      avgResponseTime: "30 mins",
      topServices: ["Cleaning", "Plumbing", "Electrical"],
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop"
    },
    {
      name: "Midtown",
      serviceCount: 189,
      avgRating: 4.7,
      avgResponseTime: "45 mins",
      topServices: ["HVAC", "Painting", "Landscaping"],
      image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=400&h=300&fit=crop"
    },
    {
      name: "Suburbs North",
      serviceCount: 156,
      avgRating: 4.9,
      avgResponseTime: "1 hour",
      topServices: ["Landscaping", "Pool Service", "Home Security"],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
    },
    {
      name: "Suburbs South",
      serviceCount: 134,
      avgRating: 4.6,
      avgResponseTime: "1.5 hours",
      topServices: ["Cleaning", "Pest Control", "Handyman"],
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop"
    },
    {
      name: "Waterfront District",
      serviceCount: 98,
      avgRating: 4.8,
      avgResponseTime: "45 mins",
      topServices: ["Window Cleaning", "Pressure Washing", "Marine Services"],
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
    },
    {
      name: "Historic District",
      serviceCount: 87,
      avgRating: 4.7,
      avgResponseTime: "1 hour",
      topServices: ["Restoration", "Antique Repair", "Specialty Cleaning"],
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop"
    }
  ];

  const nearbyServices = [
    { category: "Emergency Services", count: 45, icon: Zap, color: "bg-red-500" },
    { category: "Home Cleaning", count: 89, icon: Shield, color: "bg-blue-500" },
    { category: "Plumbing", count: 67, icon: Users, color: "bg-green-500" },
    { category: "Electrical", count: 54, icon: Zap, color: "bg-yellow-500" },
    { category: "HVAC", count: 43, icon: Shield, color: "bg-purple-500" },
    { category: "Landscaping", count: 76, icon: Users, color: "bg-emerald-500" }
  ];

  const handleLocationSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.set('location', searchLocation);
    if (selectedRadius !== "10") params.set('radius', selectedRadius);
    navigate(`/marketplace/services?${params.toString()}`);
  };

  const handleLocationSelect = (locationName: string) => {
    navigate(`/marketplace/services?location=${encodeURIComponent(locationName)}`);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          const { latitude, longitude } = position.coords;
          console.log("Current location:", latitude, longitude);
          navigate(`/marketplace/services?lat=${latitude}&lng=${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to manual location entry
        }
      );
    }
  };

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Find Services Near You
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover trusted professionals in your area. Get faster response times and local expertise.
            </p>

            {/* Location Search */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter your address, city, or ZIP code"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                    className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleUseCurrentLocation}
                    className="flex items-center gap-2 px-4 py-3 border-2 border-gray-200 hover:border-blue-500 rounded-xl"
                  >
                    <Locate className="w-4 h-4" />
                    Use Current
                  </Button>
                  <Button
                    onClick={handleLocationSearch}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1,200+</div>
                <div className="text-gray-600">Local Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">4.8★</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">30min</div>
                <div className="text-gray-600">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600">Emergency Services</div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Locations */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Popular Areas
              </h2>
              <p className="text-lg text-gray-600">
                Browse services in the most popular locations in your city
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularLocations.map((location, index) => (
                <Card 
                  key={index}
                  className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white rounded-2xl overflow-hidden"
                  onClick={() => handleLocationSelect(location.name)}
                >
                  <div className="relative">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{location.name}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{location.avgRating}</span>
                        <span>•</span>
                        <Clock className="w-4 h-4" />
                        <span>{location.avgResponseTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-gray-900">
                        {location.serviceCount}
                      </div>
                      <div className="text-sm text-gray-600">
                        Available Services
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="text-sm font-medium text-gray-700">Top Services:</div>
                      <div className="flex flex-wrap gap-2">
                        {location.topServices.map((service, serviceIndex) => (
                          <Badge key={serviceIndex} variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl">
                      Browse Services
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Nearby Services */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Services Available Nearby
              </h2>
              <p className="text-lg text-gray-600">
                Quick access to the most requested services in your area
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {nearbyServices.map((service, index) => (
                <Card 
                  key={index}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-200 rounded-xl"
                  onClick={() => navigate(`/marketplace/services?category=${encodeURIComponent(service.category.toLowerCase())}`)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                      {service.category}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {service.count} providers
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Map Integration CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <Map className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">
              Interactive Service Map
            </h2>
            <p className="text-xl mb-8 opacity-90">
              View all available services on an interactive map. See real-time availability and get instant quotes.
            </p>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-blue-600 hover:bg-gray-100 border-white rounded-full px-8 py-3"
              onClick={() => navigate('/marketplace/map')}
            >
              <Globe className="w-5 h-5 mr-2" />
              Open Service Map
            </Button>
          </div>
        </section>
      </div>
    </MarketplaceLayout>
  );
};

export default LocationBrowsePage;
