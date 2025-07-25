import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { PaymentForm } from "@/components/PaymentForm";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, Clock, Shield, Loader2, Plus, Minus } from "lucide-react";
import ServicesAPI, { ServiceDetails } from "@/services/ServicesAPI";

const CheckoutPage = () => {
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Fetch service details by name
  useEffect(() => {
    const fetchServiceByName = async () => {
      if (!serviceName) {
        setError('Service name is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        // First get all services and find by title
        const response = await ServicesAPI.getServices({ search: decodeURIComponent(serviceName) });

        if (response.error || !response.services || response.services.length === 0) {
          setError('Service not found');
          setLoading(false);
          return;
        }

        // Find exact match by title
        const matchedService = response.services.find(s =>
          s.title.toLowerCase() === decodeURIComponent(serviceName).toLowerCase()
        );

        if (!matchedService) {
          setError('Service not found');
          setLoading(false);
          return;
        }

        // Get detailed service information
        const detailsResponse = await ServicesAPI.getServiceDetails(matchedService.id);

        if (detailsResponse.error) {
          setError('Failed to load service details');
        } else {
          const serviceData = detailsResponse.service;
          // Ensure base_price is a number
          if (serviceData.base_price && typeof serviceData.base_price === 'string') {
            serviceData.base_price = parseFloat(serviceData.base_price);
          }

          // Set initial quantity for custom services
          if ((serviceData as any).service_type === 'custom' && (serviceData as any).min_quantity) {
            setQuantity((serviceData as any).min_quantity);
          }

          setService(serviceData);
        }
      } catch (err: any) {
        console.error('Error fetching service:', err);
        setError(err.message || 'Failed to load service');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceByName();
  }, [serviceName]);

  const handlePaymentComplete = (paymentData: any) => {
    toast.success("Payment successful! Your order has been placed.");
    console.log("Payment completed:", paymentData);

    // Store payment data for the success page
    localStorage.setItem('lastPaymentData', JSON.stringify(paymentData));

    // Redirect to payment success page
    setTimeout(() => {
      navigate("/marketplace/payment-success");
    }, 2000);
  };

  // Helper functions for quantity management
  const isCustomService = service && (service as any).service_type === 'custom';
  const minQuantity = isCustomService ? (service as any).min_quantity || 1 : 1;
  const maxQuantity = isCustomService ? (service as any).max_quantity : null;
  const unitType = isCustomService ? (service as any).unit_type || 'unit' : 'service';

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < minQuantity) return;
    if (maxQuantity && newQuantity > maxQuantity) return;
    setQuantity(newQuantity);
  };

  const incrementQuantity = () => {
    if (!maxQuantity || quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > minQuantity) {
      setQuantity(quantity - 1);
    }
  };

  // Calculate total amount
  const basePrice = typeof service?.base_price === 'number' ? service.base_price : parseFloat(service?.base_price || '0');
  const totalAmount = isCustomService ? basePrice * quantity : basePrice;

  // Loading state
  if (loading) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Service Details</h2>
            <p className="text-gray-600">Please wait while we prepare your checkout...</p>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  // Error or no service found
  if (error || !service) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowLeft className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {error || 'Service Not Found'}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {error || 'The service you are trying to purchase does not exist.'}
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
              onClick={() => navigate(`/marketplace/services/${service.id}`)}
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
                        src={service.images && service.images.length > 0 ? service.images[0] : service.image}
                        alt={service.title}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>

                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{service.response_time} response</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 mb-6">
                        <img
                          src={service.vendor.image}
                          alt={service.vendor.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{service.vendor.name}</div>
                          <div className="text-sm text-gray-600">{service.vendor.completed_orders} orders completed</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {service.category_tags && service.category_tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-600 rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="border-t pt-4 space-y-4">
                        {/* Quantity Selector for Custom Services */}
                        {isCustomService && (
                          <div className="space-y-3">
                            <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                              Quantity ({unitType}s)
                            </Label>
                            <div className="flex items-center space-x-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={decrementQuantity}
                                disabled={quantity <= minQuantity}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                id="quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || minQuantity)}
                                min={minQuantity}
                                max={maxQuantity || undefined}
                                className="w-20 text-center"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={incrementQuantity}
                                disabled={maxQuantity ? quantity >= maxQuantity : false}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            {minQuantity > 1 && (
                              <p className="text-xs text-gray-500">
                                Minimum quantity: {minQuantity} {unitType}s
                              </p>
                            )}
                            {maxQuantity && (
                              <p className="text-xs text-gray-500">
                                Maximum quantity: {maxQuantity} {unitType}s
                              </p>
                            )}
                          </div>
                        )}

                        {/* Pricing Breakdown */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              {isCustomService ? `Price per ${unitType}` : 'Service Price'}
                            </span>
                            <span className="text-lg font-bold text-gray-900">
                              ${basePrice.toFixed(2)}
                            </span>
                          </div>

                          {isCustomService && quantity > 1 && (
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Quantity</span>
                              <span>{quantity} {unitType}s</span>
                            </div>
                          )}

                          {isCustomService && (
                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="font-semibold text-gray-900">Total Amount</span>
                              <span className="text-xl font-bold text-green-600">
                                ${totalAmount.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Form */}
              <div className="lg:col-span-3">
                <PaymentForm
                  amount={totalAmount}
                  serviceName={`${service.title}${isCustomService && quantity > 1 ? ` (${quantity} ${unitType}s)` : ''}`}
                  serviceId={service.id}
                  vendorId={service.vendor?.id}
                  serviceType={isCustomService ? "custom" : "fixed"}
                  quantity={isCustomService ? quantity : 1}
                  unitType={isCustomService ? unitType : undefined}
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