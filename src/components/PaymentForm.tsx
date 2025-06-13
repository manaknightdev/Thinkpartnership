import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  Apple,
  Smartphone,
  Wallet
} from "lucide-react";

interface PaymentFormProps {
  amount: number;
  serviceName: string;
  onPaymentComplete?: (paymentData: any) => void;
}

export const PaymentForm = ({ amount, serviceName, onPaymentComplete }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple" | "google" | "paypal">("card");
  const [saveCard, setSaveCard] = useState(true);
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: ""
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const getCardBrand = (number: string) => {
    const num = number.replace(/\s/g, '');
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5') || num.startsWith('2')) return 'mastercard';
    if (num.startsWith('3')) return 'amex';
    return 'unknown';
  };

  const validateCard = () => {
    const newErrors: Record<string, string> = {};
    
    if (!cardData.number || cardData.number.replace(/\s/g, '').length < 13) {
      newErrors.number = 'Please enter a valid card number';
    }
    
    if (!cardData.expiry || cardData.expiry.length < 5) {
      newErrors.expiry = 'Please enter a valid expiry date';
    }
    
    if (!cardData.cvc || cardData.cvc.length < 3) {
      newErrors.cvc = 'Please enter a valid CVC';
    }
    
    if (!cardData.name.trim()) {
      newErrors.name = 'Please enter the cardholder name';
    }
    
    if (!cardData.email.trim() || !cardData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'card' && !validateCard()) {
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onPaymentComplete?.({
        method: paymentMethod,
        amount,
        serviceName,
        cardData: paymentMethod === 'card' ? cardData : null
      });
    }, 2000);
  };

  const paymentMethods = [
    { id: "card", name: "Credit or Debit Card", icon: CreditCard, description: "Visa, Mastercard, American Express" },
    { id: "apple", name: "Apple Pay", icon: Apple, description: "Pay with Touch ID or Face ID" },
    { id: "google", name: "Google Pay", icon: Smartphone, description: "Pay with your Google account" },
    { id: "paypal", name: "PayPal", icon: Wallet, description: "Pay with your PayPal account" }
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
              <span className="text-gray-600">{serviceName}</span>
              <span className="font-semibold">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Service Fee</span>
              <span className="font-semibold">$5.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Processing Fee</span>
              <span className="font-semibold">$2.50</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span>${(amount + 7.50).toFixed(2)}</span>
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
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                paymentMethod === method.id
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setPaymentMethod(method.id as any)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 ${
                  paymentMethod === method.id ? "border-green-500 bg-green-500" : "border-gray-300"
                }`}>
                  {paymentMethod === method.id && (
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
        </CardContent>
      </Card>

      {/* Card Details Form */}
      {paymentMethod === "card" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Card Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Card Number */}
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.number}
                    onChange={(e) => setCardData(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
                    maxLength={19}
                    className={errors.number ? "border-red-500" : ""}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getCardBrand(cardData.number) === 'visa' && (
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        VISA
                      </div>
                    )}
                    {getCardBrand(cardData.number) === 'mastercard' && (
                      <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        MC
                      </div>
                    )}
                  </div>
                </div>
                {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
              </div>

              {/* Expiry and CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => setCardData(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                    maxLength={5}
                    className={errors.expiry ? "border-red-500" : ""}
                  />
                  {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cardData.cvc}
                    onChange={(e) => setCardData(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '') }))}
                    maxLength={4}
                    className={errors.cvc ? "border-red-500" : ""}
                  />
                  {errors.cvc && <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>}
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardData.name}
                  onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={cardData.email}
                  onChange={(e) => setCardData(prev => ({ ...prev, email: e.target.value }))}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Billing Address */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Billing Address</h3>
                <Input
                  placeholder="Address"
                  value={cardData.address}
                  onChange={(e) => setCardData(prev => ({ ...prev, address: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="City"
                    value={cardData.city}
                    onChange={(e) => setCardData(prev => ({ ...prev, city: e.target.value }))}
                  />
                  <Input
                    placeholder="State"
                    value={cardData.state}
                    onChange={(e) => setCardData(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
                <Input
                  placeholder="ZIP Code"
                  value={cardData.zip}
                  onChange={(e) => setCardData(prev => ({ ...prev, zip: e.target.value.replace(/\D/g, '') }))}
                  maxLength={5}
                />
              </div>

              {/* Save Card Option */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="saveCard"
                  checked={saveCard}
                  onCheckedChange={setSaveCard}
                />
                <Label htmlFor="saveCard" className="text-sm">
                  Save this card for future purchases
                </Label>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Your payment information is secure
              </p>
              <p className="text-xs text-green-700">
                We use industry-standard encryption to protect your data. Your card details are never stored on our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pay Button */}
      <Button
        onClick={handleSubmit}
        disabled={processing}
        className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700 disabled:opacity-50"
      >
        {processing ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : (
          `Pay $${(amount + 7.50).toFixed(2)}`
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
