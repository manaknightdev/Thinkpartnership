import vendorApiClient from '@/config/vendorAxios';
import API_CONFIG from '@/config/api';

export interface VendorService {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  base_price: number;
  pricing_tiers: PricingTier[];
  features: string[];
  tags: string[];
  images: string[];
  response_time: string;
  delivery_time: string;
  service_areas: string[];
  requirements: string;
  rating: number;
  total_reviews: number;
  total_orders: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
}

export interface CreateServiceData {
  title: string;
  description: string;
  short_description?: string;
  category_id: number;
  base_price: number;
  pricing_tiers?: PricingTier[];
  features?: string[];
  tags?: string[];
  images?: string[];
  response_time?: string;
  delivery_time?: string;
  service_areas?: string[];
  requirements?: string;
}

export interface UpdateServiceData {
  title?: string;
  description?: string;
  short_description?: string;
  category_id?: number;
  base_price?: number;
  pricing_tiers?: PricingTier[];
  features?: string[];
  tags?: string[];
  images?: string[];
  response_time?: string;
  delivery_time?: string;
  service_areas?: string[];
  requirements?: string;
  status?: number;
}

export interface VendorServicesResponse {
  error: boolean;
  services: VendorService[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface ServiceResponse {
  error: boolean;
  service?: VendorService;
  message: string;
}

export interface ServiceFilters {
  page?: number;
  limit?: number;
  status?: number;
}

class VendorServicesAPI {
  // Get vendor services
  async getServices(filters: ServiceFilters = {}): Promise<VendorServicesResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await vendorApiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_SERVICES.LIST}?${params.toString()}`
    );
    return response.data;
  }

  // Create new service
  async createService(data: CreateServiceData): Promise<ServiceResponse> {
    const response = await vendorApiClient.post(API_CONFIG.ENDPOINTS.VENDOR_SERVICES.CREATE, data);
    return response.data;
  }

  // Update service
  async updateService(serviceId: number, data: UpdateServiceData): Promise<ServiceResponse> {
    const response = await vendorApiClient.put(
      `${API_CONFIG.ENDPOINTS.VENDOR_SERVICES.UPDATE}/${serviceId}`,
      data
    );
    return response.data;
  }

  // Delete service
  async deleteService(serviceId: number): Promise<{ error: boolean; message: string }> {
    const response = await vendorApiClient.delete(
      `${API_CONFIG.ENDPOINTS.VENDOR_SERVICES.DELETE}/${serviceId}`
    );
    return response.data;
  }

  // Get service details
  async getServiceDetails(serviceId: number): Promise<ServiceResponse> {
    const response = await vendorApiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_SERVICES.LIST}/${serviceId}`
    );
    return response.data;
  }

  // Toggle service status (activate/deactivate)
  async toggleServiceStatus(serviceId: number, status: number): Promise<ServiceResponse> {
    const response = await vendorApiClient.put(
      `${API_CONFIG.ENDPOINTS.VENDOR_SERVICES.UPDATE}/${serviceId}/status`,
      { status }
    );
    return response.data;
  }

  // Upload single service image
  async uploadServiceImage(file: File): Promise<{
    error: boolean;
    id?: number;
    url?: string;
    message: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await vendorApiClient.post(
      API_CONFIG.ENDPOINTS.VENDOR_SERVICES.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  // Get service categories
  async getCategories(): Promise<{
    error: boolean;
    categories: Array<{
      id: number;
      name: string;
      slug: string;
      description?: string;
      status: number;
    }>;
  }> {
    const response = await vendorApiClient.get(API_CONFIG.ENDPOINTS.SERVICES.CATEGORIES);
    return response.data;
  }

  // Duplicate service
  async duplicateService(serviceId: number): Promise<ServiceResponse> {
    const response = await vendorApiClient.post(
      `${API_CONFIG.ENDPOINTS.VENDOR_SERVICES.CREATE}/${serviceId}/duplicate`
    );
    return response.data;
  }

  // Get service analytics
  async getServiceAnalytics(serviceId: number, period: string = '30d'): Promise<{
    error: boolean;
    analytics: {
      views: number;
      requests: number;
      orders: number;
      revenue: number;
      rating: number;
      reviews: number;
    };
  }> {
    const response = await vendorApiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_SERVICES.LIST}/${serviceId}/analytics?period=${period}`
    );
    return response.data;
  }
}

export default new VendorServicesAPI();
