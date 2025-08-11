import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ServicesAPI, { ServiceDetails } from "@/services/ServicesAPI";
import ChatAPI from "@/services/ChatAPI";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  MessageCircle,
  Award,
  Loader2,
  LogIn,
  UserPlus,
  ShoppingCart
} from "lucide-react";

const ServiceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasChattedWithSeller, setHasChattedWithSeller] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch service details on component mount
  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!id) {
        setError("Service ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await ServicesAPI.getServiceDetails(id);

        if (response.error) {
          setError("Service not found");
        } else {
          setService(response.service);
        }
      } catch (err: any) {
        console.error("Error fetching service details:", err);
        setError(err.message || "Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  // Handle starting a chat with the vendor
  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate('/marketplace/login');
      return;
    }

    if (!service || !service.vendor) {
      setError("Service or vendor information not available");
      return;
    }

    try {
      setStartingChat(true);
      setError("");

      console.log('Starting REGULAR chat with data:', {
        service_id: service.id,
        vendor_id: service.vendor.id,
        service_title: service.title,
        service_type: (service as any).service_type,
        full_service: service
      });

      const response = await ChatAPI.startChat({
        service_id: service.id,
        vendor_id: service.vendor.id,
        initial_message: `Hi! I'm interested in your service "${service.title}". Could you provide more information?`
      });

      if (response.error) {
        throw new Error(response.message || 'Failed to start chat');
      }

      setHasChattedWithSeller(true);
      // Navigate to the chat page with the chat ID
      navigate(`/marketplace/chat/${response.data.chat_id}`);

    } catch (err: any) {
      console.error('Error starting chat:', err);
      setError(err.message || 'Failed to start chat');
    } finally {
      setStartingChat(false);
    }
  };

  // Handle adding service to cart (only for flat fee services)
  const handleAddToCart = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any default form submission behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!isAuthenticated) {
      navigate('/marketplace/login');
      return;
    }

    if (!service) {
      setError("Service information not available");
      return;
    }

    // Debug logging
    console.log('Service data for cart:', {
      id: service.id,
      title: service.title,
      service_type: (service as any).service_type,
      full_service: service
    });

    // Only allow flat fee services to be added to cart
    // If service_type is undefined, assume it's a flat fee service (from marketplace_service table)
    const serviceType = (service as any).service_type;
    if (serviceType && serviceType !== 'flat_fee') {
      setError("Only flat fee services can be added to cart");
      return;
    }

    try {
      setAddingToCart(true);
      setError("");

      const success = await addToCart(service.id, 1);
      
      if (!success) {
        // Error is already shown by the cart context
        return;
      }

    } catch (err: any) {
      console.error('Error adding to cart:', err);
      setError(err.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle requesting a quote for custom services
  const handleRequestQuote = async () => {
    if (!isAuthenticated) {
      navigate('/marketplace/login');
      return;
    }

    if (!service || !service.vendor) {
      setError("Service or vendor information not available");
      return;
    }

    try {
      setStartingChat(true);
      setError("");

      console.log('Starting QUOTE chat with data:', {
        service_id: service.id,
        vendor_id: service.vendor.id,
        service_title: service.title,
        service_type: (service as any).service_type,
        full_service: service
      });

      const response = await ChatAPI.startChat({
        service_id: service.id,
        vendor_id: service.vendor.id,
        initial_message: `Hi! I would like to request a quote for your service "${service.title}". Please provide me with a detailed quote including pricing and any additional information.`
      });

      console.log('Chat API response:', response);

      if (response.error) {
        console.error('Chat API returned error:', response.message);
        setError(response.message || 'Failed to start chat');
        return;
      }

      if (!response.data || !response.data.chat_id) {
        console.error('Chat API response missing chat_id:', response);
        setError('Invalid response from chat service');
        return;
      }

      setHasChattedWithSeller(true);
      console.log('Navigating to chat:', `/marketplace/chat/${response.data.chat_id}`);
      // Navigate to the chat page with the chat ID
      navigate(`/marketplace/chat/${response.data.chat_id}`);

    } catch (err: any) {
      console.error('Error starting chat:', err);
      console.error('Full error object:', JSON.stringify(err, null, 2));
      setError(err.message || err.response?.data?.message || 'Failed to start chat');
    } finally {
      setStartingChat(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Service Details</h2>
          <p className="text-gray-600">Please wait while we fetch the service information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !service) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Service Not Found</h1>
        <p className="text-lg text-gray-700 mb-8">
          {error || "The service you are looking for does not exist."}
        </p>
        <Button onClick={() => navigate('/marketplace/services')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section with Background Image */}
      <div className="relative h-96 overflow-hidden">
        {service.image && (
          <>
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}

        {/* Navigation and Hero Content */}
        <div className="absolute inset-0 flex flex-col">
          <div className="p-4 sm:p-8">
            <Button
              variant="secondary"
              className="mb-6 bg-white/90 hover:bg-white text-black"
              onClick={() => navigate('/marketplace/services')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
            </Button>
          </div>

          <div className="flex-1 flex items-end p-4 sm:p-8">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12 border-2 border-white">
                  <AvatarImage src={service.vendor?.image} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                    {service.vendor?.name?.charAt(0) || 'V'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm opacity-90">Service Provider</p>
                  <p className="font-semibold">{service.vendor?.name}</p>
                  {/* Vendor Location */}
                  {(service.vendor?.city || service.vendor?.province) && (
                    <div className="flex items-center gap-1 text-sm opacity-75 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {service.vendor.city && service.vendor.province
                          ? `${service.vendor.city}, ${service.vendor.province}`
                          : service.vendor.city || service.vendor.province
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">{service.title}</h1>
              <p className="text-lg opacity-90">Professional service provider</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  About This Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {service.description}
                </p>
                {service.short_description && (
                  <p className="text-gray-600 mt-4">
                    {service.short_description}
                  </p>
                )}
              </CardContent>
            </Card>


          </div>

          {/* Right Column - Pricing & Contact */}
          <div className="space-y-6">
            {/* Service Pricing */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm sticky top-4">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {service.pricing_tiers && service.pricing_tiers.length > 0 ? "Choose Your Service" : "Service Pricing"}
                </CardTitle>
                <CardDescription className="text-base">
                  {service.pricing_tiers && service.pricing_tiers.length > 0
                    ? "Select the package that best fits your needs"
                    : "Professional service starting from"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Check if service has pricing tiers (3-tier system) */}
                {service.pricing_tiers && service.pricing_tiers.length > 0 ? (
                  // 3-Tier Pricing System
                  <>
                    {service.pricing_tiers.map((tier: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{tier.name}</h3>
                          <span className="text-xl font-bold text-green-600">${tier.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  // Fixed Price or Custom Service System
                  <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      ${service.base_price}
                    </div>
                    <p className="text-gray-600">
                      Starting price
                    </p>
                    {(service as any).service_type === 'custom' && (
                      <div className="mt-2 text-sm text-gray-500">
                        {(service as any).min_quantity && (
                          <p>
                            Minimum quantity: {(service as any).min_quantity} unit(s)
                            {(service as any).max_quantity && ` • Maximum: ${(service as any).max_quantity}`}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {isAuthenticated ? (
                  // Check if this is a custom service based on service_type
                  (service as any).service_type === 'custom' ? (
                    <Button
                      size="lg"
                      className="w-full text-lg py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      onClick={handleRequestQuote}
                      disabled={startingChat}
                    >
                      {startingChat ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Starting Chat...
                        </>
                      ) : (
                        'Request Quote'
                      )}
                    </Button>
                  ) : (
                    // Flat fee service - show both Request Service Now and Add to Cart
                    <div className="space-y-3">
                      <Button
                        size="lg"
                        className="w-full text-lg py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        onClick={() => navigate(`/marketplace/checkout/${encodeURIComponent(service.title)}`)}
                      >
                        Request Service Now
                      </Button>
                      
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full text-lg py-6 border-2 border-green-600 text-green-600 hover:bg-green-50"
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        type="button"
                      >
                        {addingToCart ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="space-y-3">
                    <p className="text-center text-gray-600 text-sm">
                      Please log in or create an account to purchase this service
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        size="lg"
                        variant="outline"
                        className="text-lg py-6 border-green-600 text-green-600 hover:bg-green-50"
                        onClick={() => navigate('/marketplace/login')}
                      >
                        <LogIn className="w-5 h-5 mr-2" />
                        Log In
                      </Button>
                      <Button
                        size="lg"
                        className="text-lg py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        onClick={() => navigate('/marketplace/signup')}
                      >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Sign Up
                      </Button>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  </div>
                )}

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full text-lg py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={handleStartChat}
                  disabled={startingChat}
                >
                  {startingChat ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <MessageCircle className="mr-2 h-5 w-5" />
                  )}
                  {startingChat ? 'Starting Chat...' : 'Chat with Provider'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Free consultation • No commitment required
                </p>
              </CardContent>
            </Card>

            {/* Contact Card - Only show after chatting */}
            {service.vendor && hasChattedWithSeller && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {service.vendor.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                      <div className="p-2 bg-blue-500 rounded-full">
                        <Phone className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{service.vendor.phone}</p>
                      </div>
                    </div>
                  )}

                  {service.vendor.contact && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
                      <div className="p-2 bg-purple-500 rounded-full">
                        <Mail className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{service.vendor.contact}</p>
                      </div>
                    </div>
                  )}

                  {service.vendor.address && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
                      <div className="p-2 bg-orange-500 rounded-full">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">
                          {service.vendor.address}, {service.vendor.city}, {service.vendor.province}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;