import vendorApiClient from '@/config/vendorAxios';

export interface PromotionPackage {
  id: number;
  name: string;
  description: string;
  duration_days: number;
  price: number;
  benefits: string[];
  is_popular: boolean;
}

export interface VendorService {
  id: number;
  title: string;
  description: string;
  base_price: number;
  service_type: 'flat_fee' | 'custom' | 'subscription';
  category_name: string;
  promotion_status: 'none' | 'pending' | 'approved' | 'active' | 'expired';
  promotion_id: number | null;
  can_promote: boolean;
}

export interface CurrentPromotion {
  id: number;
  service_id: number;
  service_name: string;
  service_type: string;
  package_name: string;
  duration_days: number;
  amount: number;
  status: 'pending' | 'approved' | 'active' | 'expired' | 'rejected';
  approval_status: 'pending' | 'approved' | 'rejected';
  start_date: string | null;
  end_date: string | null;
  days_remaining: number;
  total_views: number;
  total_clicks: number;
  created_at: string;
}

interface APIResponse<T = any> {
  error: boolean;
  message?: string;
  packages?: T;
  services?: T;
  promotion?: T;
}

class VendorPaidPromotionAPI {
  // Get available promotion packages
  static async getPackages(): Promise<APIResponse<PromotionPackage[]>> {
    try {
      const response = await vendorApiClient.get('/api/marketplace/vendor/paid-promotion/packages');
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch promotion packages'
      };
    }
  }

  // Get vendor services that can be promoted
  static async getServices(): Promise<APIResponse<VendorService[]>> {
    try {
      const response = await vendorApiClient.get('/api/marketplace/vendor/paid-promotion/services');
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch services'
      };
    }
  }

  // Get current promotion status
  static async getCurrentPromotion(): Promise<APIResponse<CurrentPromotion | null>> {
    try {
      const response = await vendorApiClient.get('/api/marketplace/vendor/paid-promotion/current');
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch current promotion'
      };
    }
  }

  // Request paid promotion for a service
  static async requestPromotion(data: {
    service_id: number;
    service_type: string;
    package_id: number;
  }): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.post('/api/marketplace/vendor/paid-promotion/request', data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to request promotion'
      };
    }
  }

  // Cancel promotion request
  static async cancelPromotion(promotionId: number): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.delete(`/api/marketplace/vendor/paid-promotion/${promotionId}`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to cancel promotion'
      };
    }
  }
}

export default VendorPaidPromotionAPI;
