import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import StripeAPI from "@/services/StripeAPI";
import OrdersAPI from "@/services/OrdersAPI";
import {
  CreditCard,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2
} from "lucide-react";

interface PaymentFormProps {
  amount: number | string;
  serviceName: string;
  serviceId: number;
  vendorId?: number;
  serviceType?: 'fixed' | 'custom';
  quantity?: number;
  unitType?: string;
  onPaymentComplete?: (paymentData: any) => void;
}

export const PaymentForm = ({ amount, serviceName, serviceId, vendorId, serviceType = 'fixed', quantity = 1, unitType, onPaymentComplete }: PaymentFormProps) => {
  const [processing, setProcessing] = useState(false);
  const [stripeConnected, setStripeConnected] = useState<boolean | null>(null);
  const [checkingStripe, setCheckingStripe] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('stripe');

  // Ensure amount is a number
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;

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

    try {
      // Create payment intent through Stripe API
      const paymentData = {
        amount: numericAmount,
        currency: 'usd',
        service_id: serviceId,
        service_name: serviceName,
        description: `Payment for ${serviceName}`
      };

      const paymentResponse = await StripeAPI.createPayment(paymentData);

      if (paymentResponse.client_secret) {
        // In a real implementation, you would use Stripe Elements to confirm the payment
        // For now, we'll simulate successful payment
        toast.success('Payment initiated successfully!');

        // Create order after successful payment
        try {
          const orderData = await OrdersAPI.createOrder({
            service_id: serviceId,
            service_name: serviceName,
            vendor_id: vendorId,
            amount: numericAmount,
            payment_intent_id: paymentResponse.payment_intent_id,
            service_type: serviceType,
            quantity: quantity,
            unit_type: unitType
          });

          if (orderData.error) {
            console.warn('Failed to create order:', orderData.message);
          } else {
            console.log('Order created successfully:', orderData.data);
          }
        } catch (orderError) {
          console.warn('Failed to create order:', orderError);
        }

        setTimeout(() => {
          setProcessing(false);
          onPaymentComplete?.({
            method: 'stripe',
            amount: numericAmount,
            serviceName,
            payment_intent_id: paymentResponse.payment_intent_id,
            client_secret: paymentResponse.client_secret,
            serviceId,
            vendorId
          });
        }, 1000);
      } else {
        throw new Error('Failed to create payment intent');
      }
    } catch (error: any) {
      setProcessing(false);
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    }
  };



  const handlePayment = () => {
    if (selectedPaymentMethod === 'stripe') {
      handleStripePayment();
    }
  };

  const paymentMethods = [
    { id: "stripe", name: "Stripe Payment", icon: CreditCard, description: "Secure payment with Stripe" }
  ];





  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-gray-600">{serviceName}</span>
                {serviceType === 'custom' && quantity > 1 && (
                  <span className="text-sm text-gray-500">
                    {quantity} {unitType}s × ${(numericAmount / quantity).toFixed(2)} each
                  </span>
                )}
              </div>
              <span className="font-semibold">${numericAmount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span>${numericAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Method Options */}
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPaymentMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    selectedPaymentMethod === method.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedPaymentMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <method.icon className="w-6 h-6 text-gray-700" />
                  <div>
                    <div className="font-medium text-gray-900">{method.name}</div>
                    <div className="text-sm text-gray-600">{method.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stripe Connection Status */}
          {selectedPaymentMethod === 'stripe' && (
            <div className="mt-4">
              {checkingStripe ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-sm">Checking Stripe connection...</span>
                </div>
              ) : stripeConnected === false ? (
                <div className="p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-center space-x-3 mb-3">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-orange-900 text-sm">Stripe Account Required</div>
                      <div className="text-xs text-orange-700">Connect your Stripe account to use this payment method</div>
                    </div>
                  </div>
                  <Button
                    onClick={handleConnectStripe}
                    size="sm"
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect Stripe Account
                  </Button>
                </div>
              ) : (
                <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">Stripe account connected</span>
                  </div>
                </div>
              )}
            </div>
          )}


        </CardContent>
      </Card>



      {/* Security Notice */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Secure payments powered by Stripe
              </p>
              <p className="text-xs text-green-700">
                Your payment is processed securely through Stripe Connect. All transactions are encrypted and protected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pay Button */}
      <Button
        onClick={handlePayment}
        disabled={processing || (selectedPaymentMethod === 'stripe' && !stripeConnected)}
        className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700 disabled:opacity-50"
      >
        {processing ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : selectedPaymentMethod === 'stripe' && !stripeConnected ? (
          'Connect Stripe to Pay'
        ) : (
          `Pay $${numericAmount.toFixed(2)} with Stripe`
        )}
      </Button>

      {/* Trust Badges */}
      <div className="flex justify-center items-center space-x-6 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Shield className="w-4 h-4" />
          <span>SSL Secured</span>
        </div>
        <div className="flex items-center space-x-1">
          <Lock className="w-4 h-4" />
          <span>256-bit Encryption</span>
        </div>
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-4 h-4" />
          <span>PCI Compliant</span>
        </div>
      </div>
    </div>
  );
};
