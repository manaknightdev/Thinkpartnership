import vendorApiClient from '@/config/vendorAxios';
import API_CONFIG from '@/config/api';

export interface SubscriptionService {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  base_price: number;
  billing_cycle: 'monthly' | 'quarterly' | 'annually';
  referral_percentage?: number;
  tax_inclusive?: boolean;
  custom_tax_rate?: number | null;
  features: string[];
  tags: string[];
  images: string[];
  service_areas: string[];
  requirements: string;
  category_id: number;
  rating: number;
  total_reviews: number;
  total_subscribers: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionServiceData {
  title: string;
  description: string;
  short_description?: string;
  category_id: number;
  base_price: number;
  billing_cycle: 'monthly' | 'quarterly' | 'annually';
  referral_percentage?: number;
  features?: string[];
  tags?: string[];
  images?: string[];
  service_areas?: string[];
  requirements?: string;
  tax_inclusive?: boolean;
  custom_tax_rate?: number | null;
}

export interface UpdateSubscriptionServiceData {
  title?: string;
  description?: string;
  short_description?: string;
  category_id?: number;
  base_price?: number;
  billing_cycle?: 'monthly' | 'quarterly' | 'annually';
  referral_percentage?: number;
  features?: string[];
  tags?: string[];
  images?: string[];
  service_areas?: string[];
  requirements?: string;
  tax_inclusive?: boolean;
  custom_tax_rate?: number | null;
}

export interface SubscriptionServiceResponse {
  error: boolean;
  message?: string;
  service?: SubscriptionService;
}

export interface SubscriptionServicesResponse {
  error: boolean;
  message?: string;
  services: SubscriptionService[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ServiceFilters {
  page?: number;
  limit?: number;
  category_id?: number;
  status?: number;
}

export interface ImageUploadResponse {
  error: boolean;
  message?: string;
  url?: string;
}

export interface CategoriesResponse {
  error: boolean;
  message?: string;
  categories: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
}

class VendorSubscriptionServicesAPI {
  // Get vendor subscription services
  async getServices(filters: ServiceFilters = {}): Promise<SubscriptionServicesResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await vendorApiClient.get(
      `/api/marketplace/vendor/subscription-services?${params.toString()}`
    );
    return response.data;
  }

  // Create new subscription service
  async createService(data: CreateSubscriptionServiceData): Promise<SubscriptionServiceResponse> {
    const response = await vendorApiClient.post('/api/marketplace/vendor/subscription-services', data);
    return response.data;
  }

  // Update subscription service
  async updateService(serviceId: number, data: UpdateSubscriptionServiceData): Promise<SubscriptionServiceResponse> {
    const response = await vendorApiClient.put(`/api/marketplace/vendor/subscription-services/${serviceId}`, data);
    return response.data;
  }

  // Delete subscription service
  async deleteService(serviceId: number): Promise<{ error: boolean; message?: string }> {
    const response = await vendorApiClient.delete(`/api/marketplace/vendor/subscription-services/${serviceId}`);
    return response.data;
  }

  // Get subscription service details
  async getServiceDetails(serviceId: number): Promise<SubscriptionServiceResponse> {
    const response = await vendorApiClient.get(`/api/marketplace/vendor/subscription-services/${serviceId}`);
    return response.data;
  }

  // Upload service image (reuse existing endpoint)
  async uploadServiceImage(file: File): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await vendorApiClient.post(API_CONFIG.ENDPOINTS.VENDOR_SERVICES.UPLOAD_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        error: false,
        url: response.data.url || response.data.file_url
      };
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to upload image'
      };
    }
  }

  // Get categories (reuse existing endpoint)
  async getCategories(): Promise<CategoriesResponse> {
    const response = await vendorApiClient.get('/api/marketplace/categories');
    return response.data;
  }

  // Get billing cycle display text
  static getBillingCycleText(cycle: string): string {
    switch (cycle) {
      case 'monthly':
        return 'Monthly';
      case 'quarterly':
        return 'Quarterly (3 months)';
      case 'annually':
        return 'Annually (12 months)';
      default:
        return cycle;
    }
  }

  // Get billing cycle pricing suffix
  static getBillingCycleSuffix(cycle: string): string {
    switch (cycle) {
      case 'monthly':
        return '/month';
      case 'quarterly':
        return '/quarter';
      case 'annually':
        return '/year';
      default:
        return '';
    }
  }

  // Calculate effective monthly price for comparison
  static getEffectiveMonthlyPrice(price: number, cycle: string): number {
    const validPrice = Number(price) || 0;
    const validCycle = cycle || 'monthly';
    
    switch (validCycle) {
      case 'monthly':
        return validPrice;
      case 'quarterly':
        return validPrice / 3;
      case 'annually':
        return validPrice / 12;
      default:
        return validPrice;
    }
  }
}

const vendorSubscriptionServicesAPI = new VendorSubscriptionServicesAPI();

// Export both the instance and the class for static methods
export { VendorSubscriptionServicesAPI };
export default vendorSubscriptionServicesAPI;