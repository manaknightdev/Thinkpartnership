import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { 
  Users, 
  Building, 
  Calculator, 
  TrendingUp, 
  Shield, 

  CheckCircle
} from "lucide-react";

const ClientCommissionRulesPage = () => {

  const calculateCommissionExample = (servicePrice: number, referralFee: number) => {
    const vendorFee = servicePrice * (referralFee / 100);
    const platformFee = vendorFee * 0.10; // 10% platform fee
    const remainingAmount = vendorFee - platformFee;
    const clientShare = remainingAmount * 0.50; // 50% to client
    const referrerShare = remainingAmount * 0.50; // 50% to referrer

    return {
      servicePrice: Number(servicePrice) || 0,
      vendorFee: Number(vendorFee) || 0,
      platformFee: Number(platformFee) || 0,
      remainingAmount: Number(remainingAmount) || 0,
      clientShare: Number(clientShare) || 0,
      referrerShare: Number(referrerShare) || 0
    };
  };

  const exampleCalculation = calculateCommissionExample(1000, 20);

  // Helper function to format currency values safely
  const formatCurrency = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return '$0';
    }
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Commission Rules</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
          Transparent commission structure and how earnings are calculated
        </p>
      </div>

      {/* Commission Structure Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Calculator className="h-6 w-6" />
            Commission Structure Overview
          </CardTitle>
          <CardDescription className="text-blue-700">
            Understanding how commissions are calculated and distributed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Platform Fee */}
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Platform Fee</h3>
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">10%</div>
              <p className="text-sm text-blue-700">
                We control our platform fee on all referral fees collected
              </p>
            </div>

            {/* Vendor Referral Fee */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Building className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Vendor Referral Fee</h3>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-2">Variable</div>
              <p className="text-sm text-green-700">
                Set by vendors on a per-service basis (typically 5-25%)
              </p>
            </div>

            {/* Client Share */}
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Your Share</h3>
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-2">50%</div>
              <p className="text-sm text-purple-700">
                Of referral fee after platform fee deduction
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission Flow Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Commission Flow Example
          </CardTitle>
          <CardDescription>
            See how commissions flow through the system with a real example
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg">
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium">John Doe purchases Service #1 from Vendor B for <span className="text-green-600 font-bold">{formatCurrency(exampleCalculation.servicePrice)}</span></p>
                  <p className="text-sm text-gray-600">Vendor B pays 20% referral fee on gross</p>
                </div>
              </div>



              {/* Step 2 */}
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium">Vendor B pays referral fee: <span className="text-blue-600 font-bold">{formatCurrency(exampleCalculation.vendorFee)}</span></p>
                  <p className="text-sm text-gray-600">({formatCurrency(exampleCalculation.servicePrice)} × 20%)</p>
                </div>
              </div>



              {/* Step 3 */}
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium">Platform takes 10%: <span className="text-red-600 font-bold">{formatCurrency(exampleCalculation.platformFee)}</span></p>
                  <p className="text-sm text-gray-600">Remaining: <span className="text-green-600 font-bold">{formatCurrency(exampleCalculation.remainingAmount)}</span></p>
                </div>
              </div>



              {/* Step 4 */}
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <p className="font-medium text-purple-900">You (Client) get:</p>
                      <p className="text-xl font-bold text-purple-600">{formatCurrency(exampleCalculation.clientShare)}</p>
                      <p className="text-sm text-purple-700">50% of remaining</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="font-medium text-green-900">Vendor A (Referrer) gets:</p>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(exampleCalculation.referrerShare)}</p>
                      <p className="text-sm text-green-700">50% of remaining</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Key Points */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <CheckCircle className="h-5 w-5" />
            Key Points to Remember
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-green-800">
                  <strong>Service owners</strong> don't get a percentage - they receive direct payment from customers
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-green-800">
                  <strong>There's always a referrer</strong> on the platform for every transaction
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-green-800">
                  <strong>Vendor referral fees</strong> are set per service and can vary (5-25% typical)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-green-800">
                  <strong>Platform fee</strong> is always 10% of the referral fee collected
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientCommissionRulesPage; 