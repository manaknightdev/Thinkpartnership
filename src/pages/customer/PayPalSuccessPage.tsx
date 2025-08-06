import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import OrdersAPI from "@/services/OrdersAPI";
import PayPalAPI from "@/services/PayPalAPI";

const PayPalSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const processPayPalReturn = async () => {
      try {
        const paymentId = searchParams.get('paymentId');
        const payerId = searchParams.get('PayerID');
        const token = searchParams.get('token');

        if (!paymentId || !payerId || !token) {
          throw new Error('Missing PayPal payment parameters');
        }

        // Get pending payment data from localStorage
        const pendingPaymentStr = localStorage.getItem('pending_paypal_payment');
        if (!pendingPaymentStr) {
          throw new Error('No pending PayPal payment found');
        }

        const pendingPayment = JSON.parse(pendingPaymentStr);

        // Execute PayPal payment through PayPal API service
        const executeResponse = await PayPalAPI.executePayment({
          payment_id: paymentId,
          payer_id: payerId,
          token: token
        });

        if (executeResponse.success) {
          // Create order after successful PayPal payment
          try {
            const orderData = await OrdersAPI.createOrder({
              service_id: pendingPayment.service_id,
              service_name: pendingPayment.service_name,
              vendor_id: pendingPayment.vendor_id,
              amount: pendingPayment.amount,
              payment_intent_id: executeResponse.data.transaction_id || paymentId,
              service_type: pendingPayment.service_type
            });

            if (orderData.error) {
              console.warn('Failed to create order:', orderData.message);
              setError('Payment successful but failed to create order. Please contact support.');
            } else {
              console.log('Order created successfully:', orderData.data);
              setOrderData(orderData.data);
              toast.success('PayPal payment completed successfully!');
            }
          } catch (orderError) {
            console.warn('Failed to create order:', orderError);
            setError('Payment successful but failed to create order. Please contact support.');
          }

          // Clean up pending payment data
          localStorage.removeItem('pending_paypal_payment');
        } else {
          throw new Error(executeResponse.message || 'Failed to execute PayPal payment');
        }

      } catch (err: any) {
        console.error('PayPal payment processing error:', err);
        setError(err.message || 'Failed to process PayPal payment');
        toast.error('PayPal payment failed');
      } finally {
        setProcessing(false);
      }
    };

    processPayPalReturn();
  }, [searchParams]);

  if (processing) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing PayPal Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  if (error) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
            <p className="text-lg text-gray-600 mb-8">{error}</p>
            <div className="space-y-4">
              <Button
                onClick={() => navigate("/marketplace")}
                className="bg-green-600 hover:bg-green-700 w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Payment Successful!
              </CardTitle>
              <p className="text-lg text-gray-600 mt-2">
                Your PayPal payment has been processed successfully
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {orderData && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">#{orderData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">{orderData.service_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">${orderData.total_amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">PayPal</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">What's Next?</span>
                </div>
                <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                  <li>You'll receive an email confirmation shortly</li>
                  <li>The vendor will be notified of your order</li>
                  <li>You can track your order status in your account</li>
                  <li>The vendor will contact you to begin work</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate("/marketplace/orders")}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  View My Orders
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/marketplace")}
                  className="flex-1"
                >
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MarketplaceLayout>
  );
};

export default PayPalSuccessPage;
