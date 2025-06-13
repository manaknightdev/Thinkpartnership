import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import {
  Heart,
  Clock,
  Eye,
  Bookmark,
  Verified,
  Trash2,
  Share2,
  Filter,
  Grid3X3,
  List,
  Search
} from "lucide-react";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock favorites data
  const favoriteServices = [
    {
      id: 1,
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
      completedOrders: 150,
      category: "Painting",
      dateAdded: "2024-01-15"
    },
    {
      id: 2,
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
      completedOrders: 89,
      category: "Plumbing",
      dateAdded: "2024-01-12"
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
      dateAdded: "2024-01-10"
    },
    {
      id: 4,
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
      completedOrders: 300,
      category: "Landscaping",
      dateAdded: "2024-01-08"
    }
  ];

  const categories = ["all", ...Array.from(new Set(favoriteServices.map(service => service.category)))];

  const filteredServices = favoriteServices.filter(service => 
    selectedCategory === "all" || service.category === selectedCategory
  );

  const handleViewDetails = (serviceName: string) => {
    navigate(`/marketplace/services/${encodeURIComponent(serviceName)}`);
  };

  const handleRemoveFavorite = (serviceId: number) => {
    // In a real app, this would update the backend
    console.log(`Removing service ${serviceId} from favorites`);
  };

  const handleShare = (service: any) => {
    // In a real app, this would open a share dialog
    console.log(`Sharing service: ${service.title}`);
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
                  My Favorites
                </h1>
                <p className="text-lg text-gray-600">
                  Services you've saved for later. {favoriteServices.length} items in your favorites.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share List
                </Button>
              </div>
            </div>

            {/* Filters and View Toggle */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {category === "all" ? "All Categories" : category}
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Favorites Grid/List */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            {filteredServices.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Showing {filteredServices.length} favorite services
                    {selectedCategory !== "all" && ` in ${selectedCategory}`}
                  </p>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredServices.map((service) => (
                      <Card key={service.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white rounded-2xl">
                        <div className="relative overflow-hidden rounded-t-2xl">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Action Buttons */}
                          <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <Button 
                              size="sm" 
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 p-0"
                              onClick={() => handleRemoveFavorite(service.id)}
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-white/90 text-gray-700 hover:bg-white rounded-full w-10 h-10 p-0"
                              onClick={() => handleShare(service)}
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="absolute top-4 left-4">
                            <Badge className={`${service.vendorLevel === 'Top Rated' ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} text-white text-sm px-3 py-1 rounded-full shadow-lg`}>
                              {service.vendorLevel === 'Top Rated' && <Verified className="w-3 h-3 mr-1" />}
                              {service.vendorLevel}
                            </Badge>
                          </div>

                          <div className="absolute bottom-4 left-4 text-white text-xs bg-black/50 px-2 py-1 rounded">
                            Added {new Date(service.dateAdded).toLocaleDateString()}
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
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              Verified Pro
                            </Badge>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{service.responseTime} response</span>
                            </div>
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
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredServices.map((service) => (
                      <Card key={service.id} className="group transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-green-300">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-6">
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-24 h-24 object-cover rounded-xl"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-600 transition-colors">
                                  {service.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => handleRemoveFavorite(service.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => handleShare(service)}
                                  >
                                    <Share2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <span className="text-xl font-bold text-gray-900">{service.price}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {service.category}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    Added {new Date(service.dateAdded).toLocaleDateString()}
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleViewDetails(service.title)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No favorites yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start browsing services and save your favorites by clicking the heart icon.
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

export default FavoritesPage;
