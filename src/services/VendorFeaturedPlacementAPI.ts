import vendorApiClient from '@/config/vendorAxios';
import API_CONFIG from '@/config/api';

export interface FeaturedPackage {
  id: string;
  name: string;
  duration: number; // days
  dailyRate: number;
  totalPrice: number;
  description: string;
  benefits: string[];
  popular?: boolean;
  savings?: string;
}

export interface ActivePlacement {
  id: string;
  packageName: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  totalViews: number;
  clickThrough: number;
  status: 'active' | 'expired' | 'pending';
}

export interface FeaturedAnalytics {
  total_featured_views: number;
  click_through_rate: number;
  roi_percentage: number;
  performance_insights: Array<{
    type: string;
    title: string;
    description: string;
  }>;
}

export interface PurchaseData {
  package_id: string;
  service_id: string;
}

interface APIResponse<T = any> {
  error: boolean;
  message?: string;
  data?: T;
  packages?: T;
  placements?: T;
  analytics?: T;
  placement?: T;
}

class VendorFeaturedPlacementAPI {
  // Get available featured placement packages
  static async getPackages(): Promise<APIResponse<FeaturedPackage[]>> {
    try {
      const response = await vendorApiClient.get(API_CONFIG.ENDPOINTS.VENDOR_FEATURED.PACKAGES);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch featured packages'
      };
    }
  }

  // Get active featured placements
  static async getActivePlacements(): Promise<APIResponse<ActivePlacement[]>> {
    try {
      const response = await vendorApiClient.get(API_CONFIG.ENDPOINTS.VENDOR_FEATURED.ACTIVE);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch active placements'
      };
    }
  }

  // Purchase featured placement
  static async purchasePlacement(data: PurchaseData): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.post(API_CONFIG.ENDPOINTS.VENDOR_FEATURED.PURCHASE, data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to purchase featured placement'
      };
    }
  }

  // Get featured placement analytics
  static async getAnalytics(): Promise<APIResponse<FeaturedAnalytics>> {
    try {
      const response = await vendorApiClient.get(API_CONFIG.ENDPOINTS.VENDOR_FEATURED.ANALYTICS);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch analytics'
      };
    }
  }
}

export default VendorFeaturedPlacementAPI;
