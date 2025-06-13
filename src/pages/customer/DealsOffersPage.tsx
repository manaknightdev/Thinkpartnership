import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import {
  Percent,
  Clock,
  Star,
  Heart,
  Eye,
  Bookmark,
  Verified,
  ArrowRight,
  Tag,
  Gift,
  Zap,
  Calendar,
  Users,
  TrendingUp,
  Timer,
  Sparkles
} from "lucide-react";

const DealsOffersPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock deals data
  const featuredDeals = [
    {
      id: 1,
      title: "Premium Home Painting",
      vendor: "Brush Strokes Pro",
      vendorLevel: "Top Rated",
      description: "Transform your home with high-quality interior and exterior painting services.",
      originalPrice: 650,
      discountedPrice: 450,
      discount: 31,
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center",
      vendorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      category: "Painting",
      dealType: "Limited Time",
      expiresIn: "2 days",
      claimed: 23,
      maxClaims: 50,
      tags: ["Interior", "Exterior", "Eco-friendly"],
      isLiked: false
    },
    {
      id: 2,
      title: "Deep House Cleaning",
      vendor: "Sparkling Spaces",
      vendorLevel: "Pro",
      description: "Thorough cleaning services for homes, including kitchens, bathrooms, and living areas.",
      originalPrice: 280,
      discountedPrice: 180,
      discount: 36,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
      vendorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      category: "Cleaning",
      dealType: "Flash Sale",
      expiresIn: "6 hours",
      claimed: 45,
      maxClaims: 100,
      tags: ["Deep Clean", "Eco-friendly", "Insured"],
      isLiked: true
    },
    {
      id: 3,
      title: "Professional Lawn Care Package",
      vendor: "Green Thumb Landscaping",
      vendorLevel: "Pro",
      description: "Complete lawn care package including mowing, fertilization, and seasonal maintenance.",
      originalPrice: 320,
      discountedPrice: 240,
      discount: 25,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center",
      vendorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      category: "Landscaping",
      dealType: "Seasonal",
      expiresIn: "1 week",
      claimed: 12,
      maxClaims: 30,
      tags: ["Monthly Service", "Organic", "Seasonal"],
      isLiked: false
    },
    {
      id: 4,
      title: "Emergency Plumbing Service",
      vendor: "Rapid Plumbers",
      vendorLevel: "Top Rated",
      description: "24/7 emergency plumbing services with 50% off first-time customers.",
      originalPrice: 200,
      discountedPrice: 100,
      discount: 50,
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&crop=center",
      vendorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      category: "Plumbing",
      dealType: "New Customer",
      expiresIn: "3 days",
      claimed: 67,
      maxClaims: 75,
      tags: ["24/7", "Emergency", "Licensed"],
      isLiked: true
    }
  ];

  const dealCategories = [
    { id: "all", name: "All Deals", count: featuredDeals.length },
    { id: "flash", name: "Flash Sales", count: 8 },
    { id: "limited", name: "Limited Time", count: 12 },
    { id: "seasonal", name: "Seasonal", count: 6 },
    { id: "new-customer", name: "New Customer", count: 15 }
  ];

  const quickDeals = [
    { title: "HVAC Tune-up", discount: "40% OFF", category: "HVAC", color: "bg-red-500" },
    { title: "Window Cleaning", discount: "30% OFF", category: "Cleaning", color: "bg-blue-500" },
    { title: "Electrical Repair", discount: "25% OFF", category: "Electrical", color: "bg-yellow-500" },
    { title: "Pest Control", discount: "35% OFF", category: "Pest Control", color: "bg-green-500" }
  ];

  const handleViewDeal = (dealTitle: string) => {
    navigate(`/marketplace/services/${encodeURIComponent(dealTitle)}`);
  };

  const handleClaimDeal = (dealId: number) => {
    console.log(`Claiming deal ${dealId}`);
    // In a real app, this would handle the deal claiming process
  };

  const getDealTypeColor = (dealType: string) => {
    switch (dealType) {
      case "Flash Sale":
        return "bg-red-500";
      case "Limited Time":
        return "bg-orange-500";
      case "Seasonal":
        return "bg-green-500";
      case "New Customer":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getProgressPercentage = (claimed: number, maxClaims: number) => {
    return (claimed / maxClaims) * 100;
  };

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Percent className="w-10 h-10 text-orange-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Deals & Offers
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Save big on premium home services! Limited-time offers from our top-rated professionals.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
                <div className="text-gray-600">Active Deals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">70%</div>
                <div className="text-gray-600">Max Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">24h</div>
                <div className="text-gray-600">Flash Sales</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">1000+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Deals Bar */}
        <section className="py-6 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Quick Deals
              </h2>
              <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickDeals.map((deal, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200">
                  <CardContent className="p-4 text-center">
                    <div className={`w-8 h-8 ${deal.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <Tag className="w-4 h-4 text-white" />
                    </div>
                    <div className="font-semibold text-sm text-gray-900 mb-1">{deal.title}</div>
                    <div className="text-lg font-bold text-orange-600">{deal.discount}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Deal Categories */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {dealCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "bg-orange-600 hover:bg-orange-700" : ""}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Deals */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Deals
              </h2>
              <p className="text-lg text-gray-600">
                Don't miss out on these amazing limited-time offers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {featuredDeals.map((deal) => (
                <Card key={deal.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white rounded-2xl">
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Deal Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getDealTypeColor(deal.dealType)} text-white text-sm px-3 py-1 rounded-full shadow-lg`}>
                        <Sparkles className="w-3 h-3 mr-1" />
                        {deal.dealType}
                      </Badge>
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-red-500 text-white text-lg font-bold px-3 py-2 rounded-full shadow-lg">
                        -{deal.discount}%
                      </div>
                    </div>

                    {/* Heart Icon */}
                    <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                      <Heart className={`w-5 h-5 ${deal.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>

                    {/* Vendor Level */}
                    <div className="absolute bottom-4 left-4">
                      <Badge className={`${deal.vendorLevel === 'Top Rated' ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} text-white text-sm px-3 py-1 rounded-full shadow-lg`}>
                        {deal.vendorLevel === 'Top Rated' && <Verified className="w-3 h-3 mr-1" />}
                        {deal.vendorLevel}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                        {deal.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {deal.description}
                      </p>
                    </div>

                    {/* Vendor Info */}
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={deal.vendorImage}
                        alt={deal.vendor}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{deal.vendor}</div>
                        <div className="text-xs text-gray-600">{deal.category}</div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-2xl font-bold text-gray-900">${deal.discountedPrice}</span>
                          <span className="text-lg text-gray-500 line-through">${deal.originalPrice}</span>
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          Save ${deal.originalPrice - deal.discountedPrice}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{deal.claimed} claimed</span>
                        <span>{deal.maxClaims - deal.claimed} remaining</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(deal.claimed, deal.maxClaims)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Expiry */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1 text-sm text-red-600">
                        <Timer className="w-4 h-4" />
                        <span>Expires in {deal.expiresIn}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {deal.tags.slice(0, 2).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs bg-gray-100 text-gray-600 rounded-full">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDeal(deal.title)}
                        className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleClaimDeal(deal.id)}
                        className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Claim Deal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <Gift className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">
              Never Miss a Deal
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Subscribe to get notified about flash sales, exclusive offers, and seasonal discounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MarketplaceLayout>
  );
};

export default DealsOffersPage;
