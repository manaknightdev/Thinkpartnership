import vendorApiClient from '@/config/vendorAxios';
import API_CONFIG from '@/config/api';

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  monthly_price: number;
  service_limit: number;
  commission_rate: number;
  features: {
    analytics: string;
    support: string;
    featured_placement: boolean | string;
    custom_branding?: boolean;
    featured_duration_days?: number;
    unlimited_services?: boolean;
  };
  is_active: boolean;
  sort_order: number;
}

export interface VendorSubscription {
  id: number;
  vendor_id: number;
  plan_id: number;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'past_due' | 'paused';
  stripe_subscription_id?: string;
  current_period_start: string;
  current_period_end: string;
  services_used: number;
  auto_renew: boolean;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionUsage {
  current_services: number;
  service_limit: number;
  flat_fee_services: number;
  custom_services: number;
  can_add_service: boolean;
  days_remaining: number;
}

export interface APIResponse<T = any> {
  error: boolean;
  message?: string;
  data?: T;
}

class VendorSubscriptionAPI {
  /**
   * Get all available subscription plans
   */
  async getPlans(): Promise<APIResponse<{ plans: SubscriptionPlan[] }>> {
    try {
      const response = await vendorApiClient.get('/api/marketplace/vendor/subscription/plans');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching subscription plans:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch subscription plans'
      };
    }
  }

  /**
   * Get vendor's current subscription
   */
  async getCurrentSubscription(): Promise<APIResponse<{ subscription: VendorSubscription | null }>> {
    try {
      const response = await vendorApiClient.get('/api/marketplace/vendor/subscription/current');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching current subscription:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch current subscription'
      };
    }
  }

  /**
   * Get subscription usage and limits
   */
  async getSubscriptionUsage(): Promise<APIResponse<{ usage: SubscriptionUsage }>> {
    try {
      const response = await vendorApiClient.get('/api/marketplace/vendor/subscription/usage');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching subscription usage:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch subscription usage'
      };
    }
  }

  /**
   * Subscribe to a plan
   */
  async subscribeToPlan(planId: number): Promise<APIResponse<{ subscription: VendorSubscription; checkout_url?: string }>> {
    try {
      const response = await vendorApiClient.post('/api/marketplace/vendor/subscription/subscribe', {
        plan_id: planId
      });
      return response.data;
    } catch (error: any) {
      console.error('Error subscribing to plan:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to subscribe to plan'
      };
    }
  }

  /**
   * Change subscription plan (upgrade/downgrade)
   */
  async changePlan(planId: number): Promise<APIResponse<{ subscription: VendorSubscription }>> {
    try {
      const response = await vendorApiClient.put('/api/marketplace/vendor/subscription/change-plan', {
        plan_id: planId
      });
      return response.data;
    } catch (error: any) {
      console.error('Error changing subscription plan:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to change subscription plan'
      };
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(immediate: boolean = false): Promise<APIResponse<{ subscription: VendorSubscription }>> {
    try {
      const response = await vendorApiClient.delete('/api/marketplace/vendor/subscription/cancel', {
        data: { immediate }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to cancel subscription'
      };
    }
  }

  /**
   * Reactivate cancelled subscription
   */
  async reactivateSubscription(): Promise<APIResponse<{ subscription: VendorSubscription }>> {
    try {
      const response = await vendorApiClient.post('/api/marketplace/vendor/subscription/reactivate');
      return response.data;
    } catch (error: any) {
      console.error('Error reactivating subscription:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to reactivate subscription'
      };
    }
  }

  /**
   * Check if vendor can add a new service
   */
  async checkServiceLimit(): Promise<APIResponse<{ can_add: boolean; current_count: number; limit: number }>> {
    try {
      const response = await vendorApiClient.get('/api/marketplace/vendor/subscription/check-service-limit');
      return response.data;
    } catch (error: any) {
      console.error('Error checking service limit:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to check service limit'
      };
    }
  }

  /**
   * Get subscription history
   */
  async getSubscriptionHistory(): Promise<APIResponse<{ history: any[] }>> {
    try {
      const response = await vendorApiClient.get('/api/marketplace/vendor/subscription/history');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching subscription history:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch subscription history'
      };
    }
  }
}

export default new VendorSubscriptionAPI();