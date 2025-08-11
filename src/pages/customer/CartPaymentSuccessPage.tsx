import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import {
  CheckCircle,
  Download,
  MessageCircle,
  Package,
  Receipt,
  ArrowLeft,
  Clock,
  MapPin
} from "lucide-react";

interface PaymentData {
  payment_intent_id: string;
  orders: {
    order_id: number;
    order_number: string;
    vendor_id: number;
    vendor_name: string;
    amount: number;
    items: any[];
  }[];
  total_amount: number;
}

const CartPaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  useEffect(() => {
    // Get payment data from localStorage
    const storedData = localStorage.getItem('lastCartPaymentData');
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setPaymentData(data);
        // Clear the stored data after use
        localStorage.removeItem('lastCartPaymentData');
      } catch (error) {
        console.error('Error parsing payment data:', error);
        navigate('/marketplace/cart');
      }
    } else {
      // No payment data found, redirect to cart
      navigate('/marketplace/cart');
    }
  }, [navigate]);

  const handleDownloadReceipt = () => {
    // Implement receipt download functionality
    console.log('Download receipt for orders:', paymentData?.orders);
    // For now, just show a message
    alert('Receipt download feature coming soon!');
  };

  const handleViewOrder = (orderNumber: string) => {
    navigate(`/marketplace/orders/${orderNumber}`);
  };

  const handleChatWithVendor = (vendorId: number) => {
    // Navigate to chat with vendor
    navigate(`/marketplace/vendor/${vendorId}/chat`);
  };

  if (!paymentData) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
            <p className="text-gray-600">Please wait while we load your order details.</p>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Success Header */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              Your orders have been placed successfully. You'll receive confirmation emails shortly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleDownloadReceipt}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Receipt
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/marketplace/orders')}
              >
                <Package className="w-5 h-5 mr-2" />
                View All Orders
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              Payment ID: {paymentData.payment_intent_id}
            </div>
          </div>
        </section>

        {/* Order Details */}
        <section className="pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Details</h2>
                <p className="text-gray-600">
                  {paymentData.orders.length} {paymentData.orders.length === 1 ? 'order' : 'orders'} placed with {paymentData.orders.length} {paymentData.orders.length === 1 ? 'vendor' : 'vendors'}
                </p>
              </div>

              {paymentData.orders.map((order) => (
                <Card key={order.order_id} className="shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={order.items[0]?.service?.vendor?.image} />
                          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                            {order.vendor_name?.charAt(0) || 'V'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{order.vendor_name}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Order #{order.order_number}</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Paid
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ${order.amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Total Amount</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.service?.image || item.service?.images?.[0]}
                            alt={item.service?.title}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500';
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.service?.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {item.service?.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {item.service?.category_tags?.slice(0, 2).map((tag: string, tagIndex: number) => (
                                <Badge key={tagIndex} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              ${(parseFloat(item.service?.base_price?.toString() || '0') * (item.quantity || 1)).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Qty: {item.quantity || 1}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => handleViewOrder(order.order_number)}
                        className="flex-1"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        View Order Details
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => handleChatWithVendor(order.vendor_id)}
                        className="flex-1"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat with {order.vendor_name}
                      </Button>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-medium text-blue-900 mb-2">What happens next?</h5>
                      <div className="space-y-2 text-sm text-blue-800">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{order.vendor_name} will be notified of your order</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>You can chat with {order.vendor_name} for any questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Service will be provided as agreed</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Summary Card */}
              <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-green-600" />
                    Payment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-medium">{paymentData.orders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">Credit Card</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-medium font-mono text-sm">{paymentData.payment_intent_id}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total Paid</span>
                    <span className="font-bold text-green-600">${paymentData.total_amount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/marketplace/services')}
                  className="flex-1"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Button>
                
                <Button
                  size="lg"
                  onClick={() => navigate('/marketplace/orders')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Package className="w-5 h-5 mr-2" />
                  View All Orders
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MarketplaceLayout>
  );
};

export default CartPaymentSuccessPage;