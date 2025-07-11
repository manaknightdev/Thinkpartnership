import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { 
  CheckCircle, 
  ArrowRight, 
  Download, 
  MessageCircle,
  Star,
  Clock
} from "lucide-react";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // Get payment data from URL params or localStorage
    const paymentIntentId = searchParams.get('payment_intent');
    const serviceName = searchParams.get('service_name');
    const amount = searchParams.get('amount');
    
    // You could also get this from localStorage if passed from checkout
    const storedPaymentData = localStorage.getItem('lastPaymentData');
    
    if (storedPaymentData) {
      try {
        const data = JSON.parse(storedPaymentData);
        setPaymentData(data);
        // Clear the stored data
        localStorage.removeItem('lastPaymentData');
      } catch (e) {
        console.error('Error parsing payment data:', e);
      }
    } else if (paymentIntentId || serviceName) {
      // Fallback to URL params
      setPaymentData({
        payment_intent_id: paymentIntentId,
        serviceName: serviceName,
        amount: amount ? parseFloat(amount) : 0
      });
    }
  }, [searchParams]);

  const handleBrowseServices = () => {
    navigate("/marketplace");
  };

  const handleViewOrders = () => {
    navigate("/marketplace/orders");
  };

  const handleContactVendor = () => {
    // This would navigate to chat or contact page
    navigate("/marketplace/messages");
  };

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600">
              Your order has been confirmed and is being processed
            </p>
          </div>

          {/* Payment Details Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Order Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Service Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">
                        {paymentData?.serviceName || 'Service Name'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-medium text-green-600">
                        ${paymentData?.amount?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">Stripe</span>
                    </div>
                    {paymentData?.payment_intent_id && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-mono text-sm">
                          {paymentData.payment_intent_id.substring(0, 20)}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
                  <div className="space-y-3">
                    
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Communication</p>
                        <p className="text-sm text-gray-600">
                          You'll receive updates and can chat with your assigned vendor
                        </p>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              onClick={handleBrowseServices}
              className="bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Browse More Services
            </Button>
            
            <Button
              variant="outline"
              onClick={handleViewOrders}
              className="flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              View My Orders
            </Button>
            
            <Button
              variant="outline"
              onClick={handleContactVendor}
              className="flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Contact Support
            </Button>
          </div>

          {/* Additional Information */}
        
        </div>
      </div>
    </MarketplaceLayout>
  );
};

export default PaymentSuccessPage;
