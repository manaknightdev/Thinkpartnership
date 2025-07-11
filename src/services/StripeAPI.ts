import axios from 'axios';
import { API_CONFIG } from '@/config/api';

// Create axios instance for Stripe API calls
const stripeApiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Add auth token to requests
stripeApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
stripeApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/marketplace/login';
    }
    return Promise.reject(error);
  }
);

// Stripe Account Connection Types
export interface StripeAccountStatus {
  connected: boolean;
  account_id: string | null;
  details_submitted: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  requirements?: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
    pending_verification: string[];
  };
  business_profile?: {
    name?: string;
    url?: string;
  };
  individual?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

export interface StripeConnectResponse {
  account_id: string;
  onboarding_url: string;
}

export interface PaymentRequest {
  amount: number;
  currency?: string;
  service_id: number;
  service_name: string;
  description?: string;
}

export interface PaymentResponse {
  payment_intent_id: string;
  client_secret: string;
  status: string;
}

class StripeAPI {
  // Connect Stripe Account
  async connectAccount(): Promise<StripeConnectResponse> {
    try {
      const response = await stripeApiClient.post(API_CONFIG.ENDPOINTS.STRIPE.CONNECT);
      
      if (response.data.error) {
        throw new Error(response.data.message || 'Failed to connect Stripe account');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Connect Stripe account error:', error);
      throw new Error(error.response?.data?.message || 'Failed to connect Stripe account');
    }
  }

  // Get Stripe Account Status
  async getAccountStatus(): Promise<StripeAccountStatus> {
    try {
      const response = await stripeApiClient.get(API_CONFIG.ENDPOINTS.STRIPE.ACCOUNT_STATUS);
      
      if (response.data.error) {
        throw new Error(response.data.message || 'Failed to get account status');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Get Stripe account status error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get account status');
    }
  }

  // Disconnect Stripe Account
  async disconnectAccount(): Promise<void> {
    try {
      const response = await stripeApiClient.delete(API_CONFIG.ENDPOINTS.STRIPE.DISCONNECT);

      if (response.data.error) {
        throw new Error(response.data.message || 'Failed to disconnect Stripe account');
      }
    } catch (error: any) {
      console.error('Disconnect Stripe account error:', error);
      throw new Error(error.response?.data?.message || 'Failed to disconnect Stripe account');
    }
  }

  // Create Payment Intent
  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await stripeApiClient.post(API_CONFIG.ENDPOINTS.STRIPE.CREATE_PAYMENT, paymentData);

      if (response.data.error) {
        throw new Error(response.data.message || 'Failed to create payment');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Create payment error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create payment');
    }
  }

  // Redirect to Stripe Connect onboarding
  redirectToStripeConnect(): void {
    this.connectAccount()
      .then((data) => {
        window.location.href = data.onboarding_url;
      })
      .catch((error) => {
        console.error('Failed to redirect to Stripe Connect:', error);
        throw error;
      });
  }
}

export default new StripeAPI();
