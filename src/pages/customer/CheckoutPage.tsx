import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { PaymentForm } from "@/components/PaymentForm";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, Star, Clock, Shield, Verified } from "lucide-react";

const mockServiceDetails = {
  "Premium Home Painting": {
    vendor: "Brush Strokes Pro",
    vendorLevel: "Top Rated",
    description: "Transform your home with high-quality interior and exterior painting services. Experienced and reliable.",
    price: 500,
    originalPrice: 650,
    rating: 4.9,
    reviews: 127,
    responseTime: "2 hours",
    deliveryTime: "3-5 days",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center",
    vendorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    completedOrders: 150,
    tags: ["Interior", "Exterior", "Eco-friendly"]
  },
  "Emergency Plumbing Repair": {
    vendor: "Rapid Plumbers",
    vendorLevel: "Pro",
    description: "24/7 emergency plumbing services for leaks, clogs, and burst pipes. Fast response guaranteed.",
    price: 150,
    originalPrice: 200,
    rating: 4.8,
    reviews: 89,
    responseTime: "30 mins",
    deliveryTime: "Same day",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&crop=center",
    vendorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    completedOrders: 89,
    tags: ["24/7", "Emergency", "Licensed"]
  },
  "Full Home Inspection": {
    vendor: "Certified Inspectors Inc.",
    vendorLevel: "Top Rated",
    description: "Comprehensive home inspections for buyers and sellers. Detailed reports and expert advice.",
    price: 300,
    originalPrice: 400,
    rating: 4.9,
    reviews: 156,
    responseTime: "1 day",
    deliveryTime: "2-3 days",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center",
    vendorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    completedOrders: 200,
    tags: ["Certified", "Detailed Reports", "Pre-purchase"]
  },
  "Professional Lawn Care": {
    vendor: "Green Thumb Landscaping",
    vendorLevel: "Pro",
    description: "Regular lawn mowing, fertilization, and garden maintenance to keep your yard pristine.",
    price: 80,
    originalPrice: 120,
    rating: 4.7,
    reviews: 203,
    responseTime: "4 hours",
    deliveryTime: "Weekly",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center",
    vendorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    completedOrders: 300,
    tags: ["Weekly Service", "Organic", "Seasonal"]
  },
  "HVAC System Tune-up": {
    vendor: "Climate Control Experts",
    vendorLevel: "Top Rated",
    description: "Seasonal maintenance to ensure your heating and cooling systems run efficiently.",
    price: 120,
    originalPrice: 180,
    rating: 4.8,
    reviews: 94,
    responseTime: "6 hours",
    deliveryTime: "1-2 days",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop&crop=center",
    vendorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    completedOrders: 120,
    tags: ["Maintenance", "Energy Efficient", "Warranty"]
  },
  "Deep House Cleaning": {
    vendor: "Sparkling Spaces",
    vendorLevel: "Pro",
    description: "Thorough cleaning services for homes, including kitchens, bathrooms, and living areas.",
    price: 200,
    originalPrice: 280,
    rating: 4.9,
    reviews: 178,
    responseTime: "3 hours",
    deliveryTime: "Same day",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
    vendorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    completedOrders: 250,
    tags: ["Deep Clean", "Eco-friendly", "Insured"]
  },
};

const CheckoutPage = () => {
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();

  const service = serviceName ? mockServiceDetails[serviceName as keyof typeof mockServiceDetails] : undefined;

  const handlePaymentComplete = (paymentData: any) => {
    toast.success("Payment successful! Your order has been placed.");
    console.log("Payment completed:", paymentData);

    // In a real app, this would send data to backend
    setTimeout(() => {
      navigate("/marketplace/orders");
    }, 2000);
  };

  if (!service) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowLeft className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              The service you are trying to purchase does not exist.
            </p>
            <Button
              onClick={() => navigate("/marketplace")}
              className="bg-green-600 hover:bg-green-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
            </Button>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <Button
              variant="outline"
              className="mb-6 flex items-center gap-2"
              onClick={() => navigate(`/marketplace/services/${encodeURIComponent(serviceName || '')}`)}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Service Details
            </Button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Secure Checkout
                </h1>
                <p className="text-gray-600">Complete your purchase safely and securely</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center space-x-4 mt-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">Service Selected</span>
              </div>
              <div className="w-8 h-0.5 bg-green-600"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">Payment</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Confirmation</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Service Details Sidebar */}
              <div className="lg:col-span-2">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      Service Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="relative">
                      <img
                        src={service.image}
                        alt={serviceName}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={`${service.vendorLevel === 'Top Rated' ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} text-white text-sm px-3 py-1 rounded-full shadow-lg`}>
                          {service.vendorLevel === 'Top Rated' && <Verified className="w-3 h-3 mr-1" />}
                          {service.vendorLevel}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{serviceName}</h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>

                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-gray-900">{service.rating}</span>
                          <span className="text-sm text-gray-500">({service.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{service.responseTime} response</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 mb-6">
                        <img
                          src={service.vendorImage}
                          alt={service.vendor}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{service.vendor}</div>
                          <div className="text-sm text-gray-600">{service.completedOrders} orders completed</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {service.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-600 rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600">Service Price</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">${service.price}</span>
                            {service.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">${service.originalPrice}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Delivery Time</span>
                          <span>{service.deliveryTime}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Form */}
              <div className="lg:col-span-3">
                <PaymentForm
                  amount={service.price}
                  serviceName={serviceName || ''}
                  onPaymentComplete={handlePaymentComplete}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </MarketplaceLayout>
  );
};

export default CheckoutPage;