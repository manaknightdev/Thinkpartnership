/**
 * Tax Settings Component
 * Reusable component for tax configuration in service forms
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, Calculator } from 'lucide-react';
import { TaxAPI, TaxCalculation } from '@/services/TaxAPI';

interface TaxSettingsProps {
  taxInclusive: boolean;
  setTaxInclusive: (value: boolean) => void;
  customTaxRate: number | null;
  setCustomTaxRate: (value: number | null) => void;
  basePrice: number;
  onTaxChange?: (taxCalculation: TaxCalculation) => void;
  className?: string;
}

export const TaxSettings: React.FC<TaxSettingsProps> = ({
  taxInclusive,
  setTaxInclusive,
  customTaxRate,
  setCustomTaxRate,
  basePrice,
  onTaxChange,
  className = ''
}) => {
  const [selectedProvince, setSelectedProvince] = useState('ON');
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculation | null>(null);
  const [customRateInput, setCustomRateInput] = useState('');

  // Calculate tax whenever settings change
  useEffect(() => {
    if (basePrice > 0) {
      const calculation = TaxAPI.calculateClientTax(basePrice, selectedProvince, {
        tax_inclusive: taxInclusive,
        custom_tax_rate: customTaxRate
      });
      
      setTaxCalculation(calculation);
      onTaxChange?.(calculation);
    }
  }, [basePrice, selectedProvince, taxInclusive, customTaxRate, onTaxChange]);

  // Handle custom tax rate input
  const handleCustomRateChange = (value: string) => {
    setCustomRateInput(value);
    
    if (value === '') {
      setCustomTaxRate(null);
      return;
    }

    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      // Convert percentage to decimal (e.g., 13 -> 0.13)
      const decimalRate = numericValue / 100;
      if (decimalRate >= 0 && decimalRate <= 1) {
        setCustomTaxRate(decimalRate);
      }
    }
  };

  // Format display rate
  const displayRate = customTaxRate !== null ? (customTaxRate * 100).toFixed(2) : '';

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          Tax Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tax Calculation Method */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Tax Calculation</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="tax-inclusive"
              checked={taxInclusive}
              onCheckedChange={setTaxInclusive}
            />
            <Label htmlFor="tax-inclusive" className="text-sm">
              {taxInclusive ? 'Tax Inclusive Pricing' : 'Tax Exclusive Pricing'}
            </Label>
          </div>
          <p className="text-xs text-gray-500">
            {taxInclusive 
              ? 'Tax is included in your price. Customers see the exact price you set.'
              : 'Tax will be added to your price. Customers pay your price plus applicable taxes.'
            }
          </p>
        </div>

        {/* Custom Tax Rate */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Tax Rate Override</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="e.g., 13.00"
              value={customRateInput}
              onChange={(e) => handleCustomRateChange(e.target.value)}
              className="w-32"
              min="0"
              max="100"
              step="0.01"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
          <p className="text-xs text-gray-500">
            Leave empty to use automatic provincial tax rates. Enter a custom rate (0-100%) to override.
          </p>
          {customTaxRate !== null && (
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                Using custom tax rate of {displayRate}% instead of provincial rates.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Preview Province Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Preview for Province</Label>
          <Select value={selectedProvince} onValueChange={setSelectedProvince}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select province for preview" />
            </SelectTrigger>
            <SelectContent>
              {TaxAPI.getProvincesForSelect().map((province) => (
                <SelectItem key={province.value} value={province.value}>
                  {province.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            This preview shows how tax will be calculated for customers in different provinces.
          </p>
        </div>

        {/* Tax Calculation Preview */}
        {taxCalculation && basePrice > 0 && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-sm mb-3">Tax Calculation Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {taxInclusive ? 'Total Price (tax included)' : 'Service Price'}:
                </span>
                <span className="font-medium">
                  ${taxInclusive ? taxCalculation.total_amount.toFixed(2) : taxCalculation.subtotal.toFixed(2)}
                </span>
              </div>
              
              {!taxInclusive && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {TaxAPI.formatTaxBreakdown(taxCalculation)}:
                    </span>
                    <span className="font-medium">
                      ${taxCalculation.tax_amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total Amount:</span>
                    <span>${taxCalculation.total_amount.toFixed(2)}</span>
                  </div>
                </>
              )}

              {taxInclusive && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Price (before tax):</span>
                    <span className="font-medium">${taxCalculation.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {TaxAPI.formatTaxBreakdown(taxCalculation)}:
                    </span>
                    <span className="font-medium">
                      ${taxCalculation.tax_amount.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Information Alert */}
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Important:</strong> Tax amounts are automatically calculated based on the customer's province. 
            All tax collected goes to you (the vendor) - you're responsible for remitting taxes to the appropriate authorities.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default TaxSettings;