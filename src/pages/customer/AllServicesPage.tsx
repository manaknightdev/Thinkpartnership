import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Star,
  Clock,
  ChevronDown,
  Heart,
  Eye,
  Bookmark,
  Verified,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const AllServicesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'all');
  const [selectedRating, setSelectedRating] = useState(searchParams.get('rating') || 'all');
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(searchParams.get('delivery') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'best-match');
  
  const servicesPerPage = 12;

  // Extended mock services data
  const allServices = [
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
      completedOrders: 150,
      category: "Painting"
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
      completedOrders: 89,
      category: "Plumbing"
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
      completedOrders: 200,
      category: "Inspections"
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
      completedOrders: 300,
      category: "Landscaping"
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
      completedOrders: 120,
      category: "HVAC"
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
      completedOrders: 250,
      category: "Cleaning"
    },
    // Add more services to demonstrate pagination
    {
      title: "Electrical Wiring Installation",
      vendor: "PowerPro Electricians",
      vendorLevel: "Top Rated",
      description: "Professional electrical installation and repair services for residential and commercial properties.",
      price: "$180",
      originalPrice: "$240",
      responseTime: "2 hours",
      verified: true,
      deliveryTime: "1-2 days",
      tags: ["Licensed", "Insured", "Emergency"],
      image: "https://images.unsplash.com/photo-1621905252472-e8b1c8e7e8e8?w=400&h=300&fit=crop&crop=center",
      vendorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      isLiked: false,
      completedOrders: 180,
      category: "Electrical"
    },
    {
      title: "Professional Moving Service",
      vendor: "Swift Movers",
      vendorLevel: "Pro",
      description: "Full-service moving company with packing, loading, and transportation services.",
      price: "$350",
      originalPrice: "$450",
      responseTime: "1 day",
      verified: true,
      deliveryTime: "Flexible",
      tags: ["Full Service", "Insured", "Packing"],
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center",
      vendorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      isLiked: true,
      completedOrders: 95,
      category: "Moving"
    }
  ];

  // Duplicate services to simulate more data
  const extendedServices = [...allServices, ...allServices.map(service => ({
    ...service,
    title: service.title + " (Premium)",
    price: `$${parseInt(service.price.replace('$', '')) + 50}`,
    vendor: service.vendor + " Plus"
  }))];

  const categories = ["all", ...Array.from(new Set(allServices.map(service => service.category))).sort()];

  const filteredServices = extendedServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category.toLowerCase() === selectedCategory.toLowerCase();

    // Add more filter logic here
    const matchesRating = selectedRating === "all" ||
                         (service.rating && service.rating >= parseFloat(selectedRating));

    const matchesDeliveryTime = selectedDeliveryTime === "all" ||
                               (selectedDeliveryTime === "same-day" && service.deliveryTime.toLowerCase().includes("same day")) ||
                               (selectedDeliveryTime === "1-day" && (service.deliveryTime.toLowerCase().includes("same day") || service.deliveryTime.toLowerCase().includes("1") || service.deliveryTime.toLowerCase().includes("24"))) ||
                               (selectedDeliveryTime === "3-days" && !service.deliveryTime.toLowerCase().includes("week")) ||
                               (selectedDeliveryTime === "1-week");

    return matchesSearch && matchesCategory && matchesRating && matchesDeliveryTime;
  });

  // Sort the filtered services
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseInt(a.price.replace('$', '')) - parseInt(b.price.replace('$', ''));
      case 'price-high':
        return parseInt(b.price.replace('$', '')) - parseInt(a.price.replace('$', ''));
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return b.id - a.id; // Assuming higher ID means newer
      case 'popular':
        return b.completedOrders - a.completedOrders;
      default:
        return 0; // best-match - keep original order
    }
  });

  const totalPages = Math.ceil(sortedServices.length / servicesPerPage);
  const startIndex = (currentPage - 1) * servicesPerPage;
  const currentServices = sortedServices.slice(startIndex, startIndex + servicesPerPage);

  const handleViewDetails = (serviceName: string) => {
    navigate(`/marketplace/services/${encodeURIComponent(serviceName)}`);
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      // Scroll to top of results
      document.getElementById('services-grid')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handleSearch = () => {
    setCurrentPage(1);
    // Update URL params
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    navigate(`/marketplace/services?${params.toString()}`);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                All Services
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Browse our complete collection of professional services. Find exactly what you need.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
                <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700 px-8">
                  Search
                </Button>
              </div>

              {/* Enhanced Filters */}
              <div className="space-y-4">
                {/* Primary Filters */}
                <div className="flex flex-wrap gap-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.filter(cat => cat !== "all").map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Areas</SelectItem>
                      <SelectItem value="nearby">Nearby (5 miles)</SelectItem>
                      <SelectItem value="city">Within City</SelectItem>
                      <SelectItem value="county">Within County</SelectItem>
                      <SelectItem value="state">Within State</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Rating</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.0">4.0+ Stars</SelectItem>
                      <SelectItem value="3.5">3.5+ Stars</SelectItem>
                      <SelectItem value="3.0">3.0+ Stars</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedDeliveryTime} onValueChange={setSelectedDeliveryTime}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Delivery Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Time</SelectItem>
                      <SelectItem value="same-day">Same Day</SelectItem>
                      <SelectItem value="1-day">Within 1 Day</SelectItem>
                      <SelectItem value="3-days">Within 3 Days</SelectItem>
                      <SelectItem value="1-week">Within 1 Week</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="best-match">Best Match</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Filters Display */}
                {(selectedCategory !== "all" || selectedLocation !== "all" || selectedRating !== "all" || selectedDeliveryTime !== "all" || sortBy !== "best-match") && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {selectedCategory !== "all" && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {selectedCategory}
                        <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-green-900">×</button>
                      </Badge>
                    )}
                    {selectedLocation !== "all" && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {selectedLocation}
                        <button onClick={() => setSelectedLocation("all")} className="ml-1 hover:text-blue-900">×</button>
                      </Badge>
                    )}
                    {selectedRating !== "all" && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        {selectedRating}+ stars
                        <button onClick={() => setSelectedRating("all")} className="ml-1 hover:text-yellow-900">×</button>
                      </Badge>
                    )}
                    {selectedDeliveryTime !== "all" && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {selectedDeliveryTime}
                        <button onClick={() => setSelectedDeliveryTime("all")} className="ml-1 hover:text-purple-900">×</button>
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedLocation("all");
                        setSelectedRating("all");
                        setSelectedDeliveryTime("all");
                        setSortBy("best-match");
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + servicesPerPage, sortedServices.length)} of {sortedServices.length} services
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
              </p>
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
            </div>

            <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentServices.map((service, index) => (
                <Card key={`${service.title}-${index}`} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white rounded-2xl">
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                      <Heart className={`w-5 h-5 ${service.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>

                    <div className="absolute top-4 left-4">
                      <Badge className={`${service.vendorLevel === 'Top Rated' ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} text-white text-sm px-3 py-1 rounded-full shadow-lg`}>
                        {service.vendorLevel === 'Top Rated' && <Verified className="w-3 h-3 mr-1" />}
                        {service.vendorLevel}
                      </Badge>
                    </div>

                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <Button size="sm" className="bg-white/90 text-gray-700 hover:bg-white rounded-full w-10 h-10 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-white/90 text-gray-700 hover:bg-white rounded-full w-10 h-10 p-0">
                        <Bookmark className="w-4 h-4" />
                      </Button>
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
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Page Info */}
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(startIndex + servicesPerPage, sortedServices.length)} of {sortedServices.length} results
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {getVisiblePages().map((page, index) => (
                        <div key={index}>
                          {page === '...' ? (
                            <span className="px-3 py-2 text-gray-500">...</span>
                          ) : (
                            <Button
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page as number)}
                              disabled={loading}
                              className={`w-10 h-10 ${
                                currentPage === page
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "hover:bg-green-50 hover:border-green-300"
                              }`}
                            >
                              {loading && currentPage === page ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                page
                              )}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Next Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className="flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Load More Option (Alternative) */}
                <div className="text-center mt-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const nextPage = currentPage + 1;
                      if (nextPage <= totalPages) {
                        handlePageChange(nextPage);
                      }
                    }}
                    disabled={currentPage === totalPages || loading}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      `Load More (${Math.max(0, sortedServices.length - (currentPage * servicesPerPage))} remaining)`
                    )}
                  </Button>
                </div>
              </div>
            )}

            {sortedServices.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </MarketplaceLayout>
  );
};

export default AllServicesPage;
