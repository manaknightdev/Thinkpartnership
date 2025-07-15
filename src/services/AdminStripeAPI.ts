import adminApiClient from '@/config/adminAxios';
import { API_CONFIG } from '@/config/api';

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
  company?: {
    name?: string;
  };
}

export interface StripeConnectResponse {
  account_id: string;
  onboarding_url: string;
}

class AdminStripeAPI {
  // Connect Stripe Account
  async connectAccount(): Promise<StripeConnectResponse> {
    try {
      const response = await adminApiClient.post(API_CONFIG.ENDPOINTS.ADMIN_STRIPE.CONNECT);
      
      if (response.data.error) {
        throw new Error(response.data.message || 'Failed to connect Stripe account');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Connect Admin Stripe account error:', error);
      throw new Error(error.response?.data?.message || 'Failed to connect Stripe account');
    }
  }

  // Get Stripe Account Status
  async getAccountStatus(): Promise<StripeAccountStatus> {
    try {
      const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_STRIPE.ACCOUNT_STATUS);
      
      if (response.data.error) {
        throw new Error(response.data.message || 'Failed to get account status');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Get Admin Stripe account status error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get account status');
    }
  }

  // Disconnect Stripe Account
  async disconnectAccount(): Promise<void> {
    try {
      const response = await adminApiClient.delete(API_CONFIG.ENDPOINTS.ADMIN_STRIPE.DISCONNECT);
      
      if (response.data.error) {
        throw new Error(response.data.message || 'Failed to disconnect Stripe account');
      }
    } catch (error: any) {
      console.error('Disconnect Admin Stripe account error:', error);
      throw new Error(error.response?.data?.message || 'Failed to disconnect Stripe account');
    }
  }

  // Redirect to Stripe Connect onboarding
  redirectToStripeConnect(): void {
    this.connectAccount()
      .then((data) => {
        window.location.href = data.onboarding_url;
      })
      .catch((error) => {
        console.error('Failed to redirect to Admin Stripe Connect:', error);
        throw error;
      });
  }
}

export default new AdminStripeAPI();
