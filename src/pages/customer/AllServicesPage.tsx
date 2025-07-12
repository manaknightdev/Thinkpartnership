import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import ServicesAPI, { Service, Category } from "@/services/ServicesAPI";
import API_CONFIG from "@/config/api";
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Clock,
  ChevronDown,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const AllServicesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  // Utility function to get full image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath; // Already a full URL
    return `${API_CONFIG.BASE_URL}${imagePath}`; // Convert relative path to full URL
  };
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'all');
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(searchParams.get('delivery') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'best-match');

  // API state
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalServices, setTotalServices] = useState(0);
  const [error, setError] = useState('');

  const servicesPerPage = 12;

  // Fetch services and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch categories first
        const categoriesResponse = await ServicesAPI.getCategories();
        if (categoriesResponse.error) {
          throw new Error('Failed to load categories');
        }
        setCategories(categoriesResponse.categories);

        // Fetch services with current filters
        const filters = {
          page: currentPage,
          limit: servicesPerPage,
          search: searchTerm || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          location: selectedLocation !== 'all' ? selectedLocation : undefined,
          delivery: selectedDeliveryTime !== 'all' ? selectedDeliveryTime : undefined,
          sort: sortBy !== 'best-match' ? sortBy : undefined
        };

        console.log('🔍 Fetching services with filters:', filters);
        console.log('📂 Selected category:', selectedCategory);

        const servicesResponse = await ServicesAPI.getServices(filters);
        if (servicesResponse.error) {
          throw new Error('Failed to load services');
        }

        setServices(servicesResponse.services);
        setTotalServices(servicesResponse.total || servicesResponse.services.length);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchTerm, selectedCategory, selectedLocation, selectedDeliveryTime, sortBy]);

  // Handle search
  // const handleSearch = () => {
  //   setCurrentPage(1); // Reset to first page when searching
  // };

  // Handle service click
  const handleServiceClick = (serviceId: number) => {
    navigate(`/marketplace/services/${serviceId}`);
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalServices / servicesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    document.getElementById('services-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  // const getVisiblePages = () => {
  //   const delta = 2;
  //   const range = [];
  //   const rangeWithDots = [];

  //   for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
  //     range.push(i);
  //   }

  //   if (currentPage - delta > 2) {
  //     rangeWithDots.push(1, '...');
  //   } else {
  //     rangeWithDots.push(1);
  //   }

  //   rangeWithDots.push(...range);

  //   if (currentPage + delta < totalPages - 1) {
  //     rangeWithDots.push('...', totalPages);
  //   } else {
  //     rangeWithDots.push(totalPages);
  //   }

  //   return rangeWithDots;
  // };

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
                      {categories.map((category) => (
                        <SelectItem key={category.slug} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Canada</SelectItem>
                      <SelectItem value="alberta">Alberta</SelectItem>
                      <SelectItem value="british-columbia">British Columbia</SelectItem>
                      <SelectItem value="manitoba">Manitoba</SelectItem>
                      <SelectItem value="new-brunswick">New Brunswick</SelectItem>
                      <SelectItem value="newfoundland-labrador">Newfoundland and Labrador</SelectItem>
                      <SelectItem value="northwest-territories">Northwest Territories</SelectItem>
                      <SelectItem value="nova-scotia">Nova Scotia</SelectItem>
                      <SelectItem value="nunavut">Nunavut</SelectItem>
                      <SelectItem value="ontario">Ontario</SelectItem>
                      <SelectItem value="prince-edward-island">Prince Edward Island</SelectItem>
                      <SelectItem value="quebec">Quebec</SelectItem>
                      <SelectItem value="saskatchewan">Saskatchewan</SelectItem>
                      <SelectItem value="yukon">Yukon</SelectItem>
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

                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Filters Display */}
                {(selectedCategory !== "all" || selectedLocation !== "all" || selectedDeliveryTime !== "all" || sortBy !== "best-match") && (
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
            {error && (
              <Alert className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!loading && !error && (
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                  Showing {((currentPage - 1) * servicesPerPage) + 1}-{Math.min(currentPage * servicesPerPage, totalServices)} of {totalServices} services
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedCategory !== "all" && ` in ${selectedCategory}`}
                </p>
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            )}

            <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {loading ? (
                // Loading skeletons
                Array.from({ length: servicesPerPage }).map((_, index) => (
                  <Card key={index} className="overflow-hidden border-0 shadow-lg bg-white rounded-2xl">
                    <Skeleton className="w-full h-56 rounded-t-2xl" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-4" />
                      <div className="flex gap-2 mb-4">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : services.length > 0 ? (
                services.map((service, index) => (
                <Card key={service.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white rounded-2xl">
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <img
                      src={service.images?.[0] ? getImageUrl(service.images[0]) : "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center"}
                      alt={service.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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

                    <div className="flex flex-wrap gap-2 mb-4">
                      {/* Category Badge */}
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 rounded-full">
                        {service.category}
                      </Badge>
                      {/* Category Tags */}
                      {Array.isArray(service.category_tags) && service.category_tags.slice(0, 2).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs bg-gray-100 text-gray-600 rounded-full">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xl font-bold text-gray-900">{service.price}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{service.delivery_time}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleServiceClick(service.id)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
              ) : (
                // No results state
                <div className="col-span-full text-center py-12">
                  <div className="max-w-md mx-auto">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any services matching your criteria. Try adjusting your filters or search terms.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setSelectedLocation('all');
                        setSelectedDeliveryTime('all');
                        setSortBy('best-match');
                        setCurrentPage(1);
                      }}
                      variant="outline"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Page Info */}
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * servicesPerPage) + 1}-{Math.min(currentPage * servicesPerPage, totalServices)} of {totalServices} results
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


          </div>
        </section>
      </div>
    </MarketplaceLayout>
  );
};

export default AllServicesPage;
