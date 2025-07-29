import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import ServicesAPI, { Service, Category } from "@/services/ServicesAPI";
import API_CONFIG from "@/config/api";
import {
  Search,
  Home,
  Hammer,
  Leaf,
  Lightbulb,
  Truck,
  Building2,
  CheckCircle,
  Clock,
  Shield,
  Users,
  ArrowRight
} from "lucide-react";

const CustomerBrowseServicesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // Utility function to get full image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath; // Already a full URL
    return `${API_CONFIG.BASE_URL}${imagePath}`; // Convert relative path to full URL
  };
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Fetch categories and featured services (no sort to get all services, then sort on frontend)
        const [categoriesResponse, servicesResponse] = await Promise.all([
          ServicesAPI.getCategories(),
          ServicesAPI.getServices({ limit: 12 }) // Increased limit to get more services including newer ones
        ]);

        if (categoriesResponse.error) {
          throw new Error('Failed to load categories');
        }

        if (servicesResponse.error) {
          throw new Error('Failed to load services');
        }

        setCategories(categoriesResponse.categories);

        // Sort featured services by ID (newest first - higher IDs are newer) on frontend
        const sortedFeaturedServices = [...servicesResponse.services]
          .sort((a, b) => {
            return b.id - a.id; // Newest first (higher IDs first)
          })
          .slice(0, 6); // Take only the first 6 after sorting

        console.log('🏠 Browse page - Featured services:', {
          totalReceived: servicesResponse.services.length,
          originalOrder: servicesResponse.services.slice(0, 6).map(s => ({ id: s.id, title: s.title })),
          sortedOrder: sortedFeaturedServices.map(s => ({ id: s.id, title: s.title }))
        });

        setFeaturedServices(sortedFeaturedServices);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    // Navigate to all services with search parameters
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    navigate(`/marketplace/services?${params.toString()}`);
  };

  const handleViewDetails = (serviceId: number) => {
    // Navigate to the marketplace service details page
    navigate(`/marketplace/services/${serviceId}`);
  };

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/marketplace/services?category=${categorySlug}`);
  };

  // Category icon mapping
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: any } = {
      'plumbing': CheckCircle,
      'electrical': Lightbulb,
      'hvac': Home,
      'roofing': Building2,
      'flooring': Leaf,
      'painting': Truck,
      'landscaping': Leaf,
      'handyman': Hammer,
    };
    return iconMap[categoryName.toLowerCase()] || Hammer;
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-yellow-500",
      "bg-orange-500",
      "bg-gray-600",
      "bg-amber-600",
      "bg-purple-500",
      "bg-green-600",
      "bg-gray-500"
    ];
    return colors[index % colors.length];
  };

  // Loading and error states
  if (isLoading) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <Skeleton className="h-16 w-3/4 mx-auto mb-4" />
              <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
              <Skeleton className="h-12 w-full max-w-4xl mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-56 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-8 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  if (error) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

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
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with trusted professionals. Quality guaranteed, satisfaction promised.
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
            {/* <div className="flex flex-wrap justify-center gap-4 mb-12">
              <span className="text-gray-500 text-base font-medium">Popular:</span>
              {["Plumbing", "Electrical", "HVAC", "Roofing", "Flooring", "Painting"].map((term) => (
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
            </div> */}

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
        {/* Featured Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Top-rated services from trusted professionals in your area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredServices.map((service) => (
              <Card key={service.id} className="group overflow-hidden border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white rounded-2xl relative">

                <div className="relative overflow-hidden rounded-t-2xl">
                  <img
                    src={service.images?.[0] ? getImageUrl(service.images[0]) : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center'}
                    alt={service.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />



                  {/* Vendor Info */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <img
                      src={service.vendor_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'}
                      alt={service.vendor}
                      className="w-10 h-10 rounded-full border-3 border-white shadow-lg"
                    />
                    <div className="text-white">
                      <div className="text-sm font-semibold">{service.vendor}</div>
                      <div className="text-xs opacity-90">{service.completed_orders} orders completed</div>
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

                  {/* Category and Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {/* Category Badge */}
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200 rounded-full cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(service.category_slug || service.category.toLowerCase().replace(/\s+/g, '-'));
                      }}
                    >
                      {service.category}
                    </Badge>
                    {/* Category Tags */}
                    {Array.isArray(service.category_tags) && service.category_tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-600 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryClick(tag.toLowerCase().replace(/\s+/g, '-'));
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xl font-bold text-gray-900">${service.base_price}</span>
                      </div>

                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleViewDetails(service.id)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      View Details
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
              className="rounded-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 px-8 py-3 text-lg font-semibold"
              onClick={() => navigate('/marketplace/services')}
            >
              View All Services
            </Button>
          </div>
        </section>

        {/* Enhanced Categories Section */}
        {/* <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Popular Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect professional for any home service you need
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {categories.slice(0, 8).map((category, index) => {
              const IconComponent = getCategoryIcon(category.name);
              const color = getCategoryColor(index);
              return (
                <Card
                  key={category.slug}
                  className="group cursor-pointer transition-all duration-500 hover:shadow-2xl border-0 bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50 rounded-2xl overflow-hidden"
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-base mb-2 text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {category.description || 'Professional services'}
                    </p>
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      Popular
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
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
        </section> */}



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
                Connect with service providers in your area. Quality work from trusted professionals.
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