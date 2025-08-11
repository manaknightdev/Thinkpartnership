import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import CartAPI from "@/services/CartAPI";
import { toast } from "sonner";
import StripeAPI from "@/services/StripeAPI";
import OrdersAPI from "@/services/OrdersAPI";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Shield,
  Loader2,
  CreditCard,
  Package,
  Lock,
  ExternalLink
} from "lucide-react";

interface PaymentFormProps {
  totalAmount: number;
  onPaymentComplete: (paymentData: any) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ totalAmount, onPaymentComplete }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripeConnected, setStripeConnected] = useState<boolean | null>(null);
  const [checkingStripe, setCheckingStripe] = useState(true);

  // Check Stripe connection status on component mount
  useEffect(() => {
    const checkStripeConnection = async () => {
      try {
        setCheckingStripe(true);
        const status = await StripeAPI.getAccountStatus();
        setStripeConnected(status.connected);
      } catch (error) {
        console.error('Error checking Stripe connection:', error);
        setStripeConnected(false);
      } finally {
        setCheckingStripe(false);
      }
    };

    checkStripeConnection();
  }, []);

  const handleConnectStripe = () => {
    try {
      StripeAPI.redirectToStripeConnect();
    } catch (error) {
      toast.error('Failed to connect to Stripe. Please try again.');
    }
  };

  const handleStripePayment = async () => {
    if (!stripeConnected) {
      toast.error('Please connect your Stripe account first');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent through backend
      const paymentResponse = await CartAPI.createCartPaymentIntent();

      if (paymentResponse.error) {
        throw new Error(paymentResponse.message || 'Failed to create payment intent');
      }

      // Simulate payment success (in real implementation, this would be handled by Stripe)
      const paymentIntentId = `pi_cart_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

      // Complete cart checkout
      const checkoutResponse = await CartAPI.checkoutCart({
        payment_intent_id: paymentIntentId
      });

      if (checkoutResponse.error) {
        throw new Error(checkoutResponse.message || 'Failed to complete checkout');
      }

      onPaymentComplete({
        payment_intent_id: paymentIntentId,
        orders: checkoutResponse.data?.orders,
        total_amount: checkoutResponse.data?.total_amount
      });

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
      toast.error(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stripe Connection Status */}
          {checkingStripe ? (
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Checking Stripe connection...</span>
            </div>
          ) : stripeConnected === false ? (
            <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
              <div className="flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-orange-900 text-sm">Stripe Account Required</div>
                  <div className="text-xs text-orange-700">Connect your Stripe account to use this payment method</div>
                </div>
              </div>
              <Button
                onClick={handleConnectStripe}
                className="mt-3 w-full bg-orange-600 hover:bg-orange-700 text-white"
                size="sm"
              >
                Connect Stripe Account
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">Stripe account connected</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Secure payments powered by Stripe</span>
            </div>
            <p className="text-xs text-gray-600">
              Your payment is processed securely through Stripe Connect. All transactions are encrypted and protected.
            </p>
          </div>

          <Button
            onClick={handleStripePayment}
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={processing || !stripeConnected}
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : !stripeConnected ? (
              'Connect Stripe to Pay'
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Pay ${(totalAmount || 0).toFixed(2)} Securely
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 text-center">
            Your payment is secured with 256-bit SSL encryption
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CartCheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, summary, loading: cartLoading, validateCart, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/marketplace/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      navigate('/marketplace/cart');
      return;
    }
  }, [cartLoading, items.length, navigate]);

  // Validate cart when cart is loaded
  useEffect(() => {
    if (items.length > 0) {
      validateCart();
    }
  }, [items]);

  const handlePaymentComplete = (paymentData: any) => {
    toast.success("Payment successful! Your orders have been placed.");
    console.log("Payment completed:", paymentData);

    // Store payment data for the success page
    localStorage.setItem('lastCartPaymentData', JSON.stringify(paymentData));

    // Clear the cart
    clearCart();

    // Redirect to payment success page
    setTimeout(() => {
      navigate("/marketplace/cart/payment-success");
    }, 2000);
  };

  // Loading state
  if (cartLoading) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Cart</h2>
            <p className="text-gray-600">Please wait while we load your cart...</p>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowLeft className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout Error</h1>
            <p className="text-lg text-gray-600 mb-8">{error}</p>
            <Button
              onClick={() => navigate("/marketplace/cart")}
              className="bg-green-600 hover:bg-green-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
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
                onClick={() => navigate('/marketplace/cart')}
              >
                <ArrowLeft className="w-4 h-4" /> Back to Cart
              </Button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
                  <p className="text-gray-600">Complete your purchase safely and securely</p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center space-x-4 mt-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium text-green-600">Cart Review</span>
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
                {/* Order Summary Sidebar */}
                <div className="lg:col-span-2">
                  <Card className="sticky top-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-green-600" />
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Items by vendor */}
                      {summary?.vendors.map((vendor, vendorIndex) => (
                        <div key={vendor.vendor_id} className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={vendor.items[0]?.service.vendor?.image} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                                {vendor.vendor_name?.charAt(0) || 'V'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-sm">{vendor.vendor_name}</h4>
                              <p className="text-xs text-gray-600">
                                {vendor.items.length} {vendor.items.length === 1 ? 'service' : 'services'}
                              </p>
                            </div>
                          </div>

                          {vendor.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <img
                                src={item.service.image || item.service.images?.[0]}
                                alt={item.service.title}
                                className="w-12 h-12 object-cover rounded-lg"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500';
                                }}
                              />
                              <div className="flex-1">
                                <h5 className="font-medium text-sm text-gray-900">{item.service.title}</h5>
                                <p className="text-xs text-gray-600">
                                  Qty: {item.quantity} × ${item.service.base_price}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-sm">
                                  ${(parseFloat(item.service.base_price.toString()) * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal</span>
                              <span>${(vendor.subtotal || 0).toFixed(2)}</span>
                            </div>
                            {vendor.tax_calculation && vendor.tax_calculation.tax_amount != null && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span>${(vendor.tax_calculation.tax_amount || 0).toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-semibold">
                              <span>Vendor Total</span>
                              <span className="text-green-600">${(vendor.total || 0).toFixed(2)}</span>
                            </div>
                          </div>

                          {vendorIndex < (summary?.vendors.length || 0) - 1 && (
                            <Separator className="my-4" />
                          )}
                        </div>
                      ))}

                      <Separator />

                      {/* Grand totals */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal ({summary?.total_items} items)</span>
                          <span>${(summary?.grand_subtotal || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Tax</span>
                          <span>${(summary?.grand_tax_amount || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Grand Total</span>
                          <span className="text-green-600">${(summary?.grand_total || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Payment Form */}
                <div className="lg:col-span-3">
                  <PaymentForm
                    totalAmount={summary?.grand_total || 0}
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

export default CartCheckoutPage;