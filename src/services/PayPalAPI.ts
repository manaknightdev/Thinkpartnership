interface PayPalPaymentData {
  amount: number;
  currency?: string;
  service_id: number;
  service_name: string;
  vendor_id: number;
  service_type?: string;
  quantity?: number;
  unit_type?: string;
  return_url: string;
  cancel_url: string;
}

interface PayPalExecuteData {
  payment_id: string;
  payer_id: string;
  token: string;
}

interface PayPalResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: boolean;
}

class PayPalAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = 'https://baas.mytechpassport.com';
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('customer_token') || localStorage.getItem('token')}`,
      'x-project': btoa('thinkpartnership:_')
    };
  }

  async createPayment(paymentData: PayPalPaymentData): Promise<PayPalResponse> {
    try {
      const response = await fetch(`${this.baseURL}/v1/api/thinkpartnership/customer/lambda/paypal/create-payment`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error: any) {
      console.error('PayPal create payment error:', error);
      return {
        success: false,
        error: true,
        message: error.message || 'Failed to create PayPal payment'
      };
    }
  }

  async executePayment(executeData: PayPalExecuteData): Promise<PayPalResponse> {
    try {
      const response = await fetch(`${this.baseURL}/v1/api/thinkpartnership/customer/lambda/paypal/execute-payment`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(executeData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error: any) {
      console.error('PayPal execute payment error:', error);
      return {
        success: false,
        error: true,
        message: error.message || 'Failed to execute PayPal payment'
      };
    }
  }

  getVendorConnectURL(vendorId: string, returnUrl?: string): string {
    const params = new URLSearchParams({
      vendor_id: vendorId,
      ...(returnUrl && { return_url: returnUrl })
    });
    
    return `${this.baseURL}/v1/api/thinkpartnership/vendor/lambda/paypal/connect?${params.toString()}`;
  }

  getClientConnectURL(clientId: string, returnUrl?: string): string {
    const params = new URLSearchParams({
      client_id: clientId,
      ...(returnUrl && { return_url: returnUrl })
    });
    
    return `${this.baseURL}/v1/api/thinkpartnership/client/lambda/paypal/connect?${params.toString()}`;
  }

  getCustomerConnectURL(customerId: string, returnUrl?: string): string {
    const params = new URLSearchParams({
      customer_id: customerId,
      ...(returnUrl && { return_url: returnUrl })
    });
    
    return `${this.baseURL}/v1/api/thinkpartnership/customer/lambda/paypal/connect?${params.toString()}`;
  }
}

export default new PayPalAPI();
