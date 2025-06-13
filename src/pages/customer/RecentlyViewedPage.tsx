import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import {
  Clock,
  Eye,
  Heart,
  Bookmark,
  Verified,
  Trash2,
  Filter,
  Calendar,
  ArrowRight
} from "lucide-react";

const RecentlyViewedPage = () => {
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");

  // Mock recently viewed data with timestamps
  const recentlyViewedServices = [
    {
      id: 1,
      title: "Premium Home Painting",
      vendor: "Brush Strokes Pro",
      vendorLevel: "Top Rated",
      description: "Transform your home with high-quality interior and exterior painting services.",
      price: "$500",
      originalPrice: "$650",
      responseTime: "2 hours",
      verified: true,
      deliveryTime: "3-5 days",
      tags: ["Interior", "Exterior", "Eco-friendly"],
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center",
      vendorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      completedOrders: 150,
      category: "Painting",
      viewedAt: "2024-01-15T14:30:00Z",
      viewCount: 3
    },
    {
      id: 2,
      title: "Emergency Plumbing Repair",
      vendor: "Rapid Plumbers",
      vendorLevel: "Pro",
      description: "24/7 emergency plumbing services for leaks, clogs, and burst pipes.",
      price: "$150",
      originalPrice: "$200",
      responseTime: "30 mins",
      verified: true,
      deliveryTime: "Same day",
      tags: ["24/7", "Emergency", "Licensed"],
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&crop=center",
      vendorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      completedOrders: 89,
      category: "Plumbing",
      viewedAt: "2024-01-15T10:15:00Z",
      viewCount: 1
    },
    {
      id: 3,
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
      completedOrders: 250,
      category: "Cleaning",
      viewedAt: "2024-01-14T16:45:00Z",
      viewCount: 2
    },
    {
      id: 4,
      title: "Professional Lawn Care",
      vendor: "Green Thumb Landscaping",
      vendorLevel: "Pro",
      description: "Regular lawn mowing, fertilization, and garden maintenance.",
      price: "$80",
      originalPrice: "$120",
      responseTime: "4 hours",
      verified: true,
      deliveryTime: "Weekly",
      tags: ["Weekly Service", "Organic", "Seasonal"],
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center",
      vendorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      completedOrders: 300,
      category: "Landscaping",
      viewedAt: "2024-01-13T09:20:00Z",
      viewCount: 1
    },
    {
      id: 5,
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
      completedOrders: 120,
      category: "HVAC",
      viewedAt: "2024-01-12T11:30:00Z",
      viewCount: 4
    }
  ];

  const timeframes = [
    { id: "all", name: "All Time", days: null },
    { id: "today", name: "Today", days: 1 },
    { id: "week", name: "This Week", days: 7 },
    { id: "month", name: "This Month", days: 30 }
  ];

  const filterByTimeframe = (services: any[], timeframe: string) => {
    if (timeframe === "all") return services;
    
    const now = new Date();
    const timeframeData = timeframes.find(t => t.id === timeframe);
    if (!timeframeData?.days) return services;
    
    const cutoffDate = new Date(now.getTime() - (timeframeData.days * 24 * 60 * 60 * 1000));
    
    return services.filter(service => new Date(service.viewedAt) >= cutoffDate);
  };

  const filteredServices = filterByTimeframe(recentlyViewedServices, selectedTimeframe);

  const handleViewDetails = (serviceName: string) => {
    navigate(`/marketplace/services/${encodeURIComponent(serviceName)}`);
  };

  const handleRemoveFromHistory = (serviceId: number) => {
    // In a real app, this would update the backend
    console.log(`Removing service ${serviceId} from history`);
  };

  const handleClearAll = () => {
    // In a real app, this would clear all history
    console.log("Clearing all viewing history");
  };

  const formatViewedTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Recently Viewed
                </h1>
                <p className="text-lg text-gray-600">
                  Services you've recently browsed. {recentlyViewedServices.length} items in your history.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleClearAll}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </Button>
              </div>
            </div>

            {/* Time Filter */}
            <div className="flex flex-wrap gap-2">
              {timeframes.map((timeframe) => (
                <Button
                  key={timeframe.id}
                  variant={selectedTimeframe === timeframe.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe.id)}
                  className={selectedTimeframe === timeframe.id ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {timeframe.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Recently Viewed List */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            {filteredServices.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Showing {filteredServices.length} recently viewed services
                    {selectedTimeframe !== "all" && ` from ${timeframes.find(t => t.id === selectedTimeframe)?.name.toLowerCase()}`}
                  </p>
                </div>

                <div className="space-y-4">
                  {filteredServices.map((service) => (
                    <Card key={service.id} className="group transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-green-300">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-6">
                          <div className="relative">
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-32 h-24 object-cover rounded-xl"
                            />
                            <div className="absolute top-2 left-2">
                              <Badge className={`${service.vendorLevel === 'Top Rated' ? 'bg-orange-500' : 'bg-blue-500'} text-white text-xs px-2 py-1`}>
                                {service.vendorLevel === 'Top Rated' && <Verified className="w-3 h-3 mr-1" />}
                                {service.vendorLevel}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-xl text-gray-900 group-hover:text-green-600 transition-colors mb-1">
                                  {service.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    Viewed {service.viewCount} time{service.viewCount !== 1 ? 's' : ''}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {formatViewedTime(service.viewedAt)}
                                  </span>
                                  <Badge variant="secondary" className="text-xs">
                                    {service.category}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="text-gray-500 hover:text-red-600"
                                  onClick={() => handleRemoveFromHistory(service.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="text-gray-500 hover:text-red-600"
                                >
                                  <Heart className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="text-gray-500 hover:text-blue-600"
                                >
                                  <Bookmark className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-2xl font-bold text-gray-900">{service.price}</span>
                                  {service.originalPrice && (
                                    <span className="text-lg text-gray-500 line-through">{service.originalPrice}</span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                  <Clock className="w-4 h-4" />
                                  <span>{service.responseTime} response</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDetails(service.title)}
                                  className="border-green-600 text-green-600 hover:bg-green-50"
                                >
                                  View Again
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleViewDetails(service.title)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Book Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {selectedTimeframe === "all" ? "No viewing history" : `No services viewed ${timeframes.find(t => t.id === selectedTimeframe)?.name.toLowerCase()}`}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {selectedTimeframe === "all" 
                    ? "Start browsing services to see your viewing history here."
                    : "Try selecting a different time period or browse more services."
                  }
                </p>
                <Button 
                  onClick={() => navigate('/marketplace')}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-3"
                >
                  Browse Services
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </MarketplaceLayout>
  );
};

export default RecentlyViewedPage;
