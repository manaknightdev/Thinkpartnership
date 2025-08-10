/**
 * Tax API Service
 * Handles tax calculations and Canadian provincial tax rates
 */

import apiClient from '@/config/axios';

export interface TaxCalculation {
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  tax_province: string;
  tax_breakdown: {
    province: string;
    province_code: string;
    rate_percentage: number;
    is_custom: boolean;
    tax_inclusive: boolean;
    gst?: string;
    pst?: string;
    hst?: string;
  };
  calculation_method: 'inclusive' | 'exclusive';
  error?: string;
}

export interface Province {
  code: string;
  name: string;
  total_rate: number;
  gst_rate: number;
  pst_rate: number;
  hst_rate: number;
}

export interface TaxCalculationRequest {
  amount: number;
  province?: string;
  service_id?: number;
  service_type?: 'flat_fee' | 'custom';
}

export interface QuoteTaxRequest {
  quote_amount: number;
  customer_province?: string;
  tax_inclusive?: boolean;
  custom_tax_rate?: number;
}

class TaxAPI {
  /**
   * Get all Canadian provinces with tax rates
   */
  async getProvinces(): Promise<{ error: boolean; provinces?: Province[]; message?: string }> {
    try {
      const response = await apiClient.get('/api/marketplace/tax/provinces');
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to get provinces'
      };
    }
  }

  /**
   * Calculate tax for a service
   */
  async calculateTax(request: TaxCalculationRequest): Promise<{ error: boolean; tax_calculation?: TaxCalculation; message?: string }> {
    try {
      const response = await apiClient.post('/api/marketplace/tax/calculate', request);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to calculate tax'
      };
    }
  }

  /**
   * Calculate tax for a quote (used in chat)
   */
  async calculateQuoteTax(request: QuoteTaxRequest): Promise<{ error: boolean; tax_calculation?: TaxCalculation; message?: string }> {
    try {
      const response = await apiClient.post('/api/marketplace/tax/calculate-quote', request);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to calculate quote tax'
      };
    }
  }

  /**
   * Get tax rate for a province (client-side helper)
   */
  static TAX_RATES = {
    'AB': { gst: 5.00, pst: 0.00, hst: 0.00, total: 5.00, name: 'Alberta' },
    'BC': { gst: 5.00, pst: 7.00, hst: 0.00, total: 12.00, name: 'British Columbia' },
    'MB': { gst: 5.00, pst: 7.00, hst: 0.00, total: 12.00, name: 'Manitoba' },
    'NB': { gst: 0.00, pst: 0.00, hst: 15.00, total: 15.00, name: 'New Brunswick' },
    'NL': { gst: 0.00, pst: 0.00, hst: 15.00, total: 15.00, name: 'Newfoundland and Labrador' },
    'NT': { gst: 5.00, pst: 0.00, hst: 0.00, total: 5.00, name: 'Northwest Territories' },
    'NS': { gst: 0.00, pst: 0.00, hst: 15.00, total: 15.00, name: 'Nova Scotia' },
    'NU': { gst: 5.00, pst: 0.00, hst: 0.00, total: 5.00, name: 'Nunavut' },
    'ON': { gst: 0.00, pst: 0.00, hst: 13.00, total: 13.00, name: 'Ontario' },
    'PE': { gst: 0.00, pst: 0.00, hst: 15.00, total: 15.00, name: 'Prince Edward Island' },
    'QC': { gst: 5.00, pst: 9.975, hst: 0.00, total: 14.975, name: 'Quebec' },
    'SK': { gst: 5.00, pst: 6.00, hst: 0.00, total: 11.00, name: 'Saskatchewan' },
    'YT': { gst: 5.00, pst: 0.00, hst: 0.00, total: 5.00, name: 'Yukon' }
  };

  /**
   * Client-side tax calculation (for immediate feedback)
   */
  static calculateClientTax(amount: number, province: string = 'ON', options: { tax_inclusive?: boolean; custom_tax_rate?: number } = {}): TaxCalculation {
    const numericAmount = parseFloat(amount.toString());
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return {
        subtotal: 0,
        tax_rate: 0,
        tax_amount: 0,
        total_amount: 0,
        tax_province: province,
        tax_breakdown: {
          province: 'Unknown',
          province_code: province,
          rate_percentage: 0,
          is_custom: false,
          tax_inclusive: false
        },
        calculation_method: 'exclusive',
        error: 'Invalid amount'
      };
    }

    // Get tax rate
    let taxInfo;
    if (options.custom_tax_rate !== null && options.custom_tax_rate !== undefined) {
      const customRate = parseFloat(options.custom_tax_rate.toString());
      taxInfo = {
        total: customRate * 100,
        rate_decimal: customRate,
        name: 'Custom Rate',
        custom: true
      };
    } else {
      const provinceInfo = TaxAPI.TAX_RATES[province.toUpperCase() as keyof typeof TaxAPI.TAX_RATES] || TaxAPI.TAX_RATES['ON'];
      taxInfo = {
        ...provinceInfo,
        rate_decimal: provinceInfo.total / 100,
        custom: false
      };
    }

    // Calculate tax
    let taxAmount, finalSubtotal, totalAmount;

    if (options.tax_inclusive) {
      // Tax is included in the price
      totalAmount = numericAmount;
      taxAmount = numericAmount * (taxInfo.rate_decimal / (1 + taxInfo.rate_decimal));
      finalSubtotal = numericAmount - taxAmount;
    } else {
      // Tax is additional
      finalSubtotal = numericAmount;
      taxAmount = numericAmount * taxInfo.rate_decimal;
      totalAmount = numericAmount + taxAmount;
    }

    // Round to 2 decimal places
    finalSubtotal = Math.round(finalSubtotal * 100) / 100;
    taxAmount = Math.round(taxAmount * 100) / 100;
    totalAmount = Math.round(totalAmount * 100) / 100;

    // Create tax breakdown
    const taxBreakdown: TaxCalculation['tax_breakdown'] = {
      province: taxInfo.name,
      province_code: province.toUpperCase(),
      rate_percentage: taxInfo.total,
      is_custom: taxInfo.custom || false,
      tax_inclusive: options.tax_inclusive || false
    };

    // Add specific tax components if available
    if (!taxInfo.custom) {
      const provinceTax = TaxAPI.TAX_RATES[province.toUpperCase() as keyof typeof TaxAPI.TAX_RATES];
      if (provinceTax?.gst > 0) taxBreakdown.gst = `${provinceTax.gst}%`;
      if (provinceTax?.pst > 0) taxBreakdown.pst = `${provinceTax.pst}%`;
      if (provinceTax?.hst > 0) taxBreakdown.hst = `${provinceTax.hst}%`;
    }

    return {
      subtotal: finalSubtotal,
      tax_rate: taxInfo.rate_decimal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      tax_province: province.toUpperCase(),
      tax_breakdown: taxBreakdown,
      calculation_method: options.tax_inclusive ? 'inclusive' : 'exclusive'
    };
  }

  /**
   * Format tax breakdown for display
   */
  static formatTaxBreakdown(taxCalculation: TaxCalculation): string {
    const { tax_breakdown } = taxCalculation;
    
    if (tax_breakdown.is_custom) {
      return `Custom Tax Rate (${tax_breakdown.rate_percentage.toFixed(2)}%)`;
    }

    let breakdown = `${tax_breakdown.province} Tax`;
    const components = [];
    
    if (tax_breakdown.gst) components.push(`GST ${tax_breakdown.gst}`);
    if (tax_breakdown.pst) components.push(`PST ${tax_breakdown.pst}`);
    if (tax_breakdown.hst) components.push(`HST ${tax_breakdown.hst}`);
    
    if (components.length > 0) {
      breakdown += ` (${components.join(' + ')})`;
    }
    
    return breakdown;
  }

  /**
   * Get provinces list for dropdowns
   */
  static getProvincesForSelect(): Array<{ value: string; label: string; rate: number }> {
    return Object.entries(TaxAPI.TAX_RATES).map(([code, info]) => ({
      value: code,
      label: `${info.name} (${info.total}%)`,
      rate: info.total
    }));
  }
}

export default TaxAPI;