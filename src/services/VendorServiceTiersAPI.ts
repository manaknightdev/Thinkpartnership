import vendorApiClient from '@/config/vendorAxios';

export interface ServiceTier {
  id: number;
  service_id: number;
  tier_name: string;
  tier_description: string;
  price: number;
  features: string[];
  is_featured: boolean;
  featured_until?: string;
  featured_position?: number;
  created_at: string;
  updated_at: string;
  service_title?: string;
}

export interface FeaturedPlacement {
  id: number;
  service_id: number;
  placement_type: 'homepage' | 'category' | 'search_top' | 'premium_badge';
  position: number;
  duration_days: number;
  price_paid: number;
  status: 'active' | 'expired' | 'pending';
  starts_at: string;
  expires_at: string;
  created_at: string;
  service_title?: string;
  category_name?: string;
}

export interface PlacementPackage {
  id: number;
  name: string;
  description: string;
  placement_type: string;
  duration_days: number;
  price: number;
  features: string[];
  is_popular: boolean;
}

export interface CreateTierData {
  service_id: number;
  tier_name: string;
  tier_description: string;
  price: number;
  features: string[];
}

export interface PurchasePlacementData {
  service_id: number;
  package_id: number;
  duration_days: number;
  placement_type: string;
}

export interface APIResponse<T = any> {
  error: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class VendorServiceTiersAPI {
  // Get service tiers for vendor's services
  static async getServiceTiers(filters?: {
    page?: number;
    limit?: number;
    service_id?: number;
    is_featured?: boolean;
  }): Promise<APIResponse<{ tiers: ServiceTier[] }>> {
    try {
      const response = await vendorApiClient.get('/vendor/service-tiers', { params: filters });
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch service tiers'
      };
    }
  }

  // Create new service tier
  static async createServiceTier(data: CreateTierData): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.post('/vendor/service-tiers', data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to create service tier'
      };
    }
  }

  // Update service tier
  static async updateServiceTier(tierId: number, data: Partial<CreateTierData>): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.put(`/vendor/service-tiers/${tierId}`, data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to update service tier'
      };
    }
  }

  // Delete service tier
  static async deleteServiceTier(tierId: number): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.delete(`/vendor/service-tiers/${tierId}`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to delete service tier'
      };
    }
  }

  // Get featured placements
  static async getFeaturedPlacements(filters?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<APIResponse<{ placements: FeaturedPlacement[] }>> {
    try {
      const response = await vendorApiClient.get('/vendor/featured-placements', { params: filters });
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch featured placements'
      };
    }
  }

  // Get available placement packages
  static async getPlacementPackages(): Promise<APIResponse<{ packages: PlacementPackage[] }>> {
    try {
      const response = await vendorApiClient.get('/vendor/placement-packages');
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch placement packages'
      };
    }
  }

  // Purchase featured placement
  static async purchasePlacement(data: PurchasePlacementData): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.post('/vendor/featured-placements/purchase', data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to purchase placement'
      };
    }
  }

  // Cancel featured placement
  static async cancelPlacement(placementId: number): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.delete(`/vendor/featured-placements/${placementId}`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to cancel placement'
      };
    }
  }

  // Get placement analytics
  static async getPlacementAnalytics(placementId: number): Promise<APIResponse<{
    views: number;
    clicks: number;
    conversions: number;
    ctr: number;
    conversion_rate: number;
  }>> {
    try {
      const response = await vendorApiClient.get(`/vendor/featured-placements/${placementId}/analytics`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch placement analytics'
      };
    }
  }

  // Get vendor's services for tier creation
  static async getVendorServices(): Promise<APIResponse<{ services: Array<{
    id: number;
    title: string;
    category_name: string;
    base_price: number;
  }> }>> {
    try {
      const response = await vendorApiClient.get('/vendor/services/simple');
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch vendor services'
      };
    }
  }
}

export default VendorServiceTiersAPI;
