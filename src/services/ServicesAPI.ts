import apiClient from '@/config/axios';
import API_CONFIG from '@/config/api';

export interface ServiceFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  location?: string;
  service_type?: string;
  sort?: string;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  base_price: number;
  service_type?: string;
  unit_type?: string;
  min_quantity?: number;
  max_quantity?: number;
  vendor: string;
  vendor_image: string;
  vendor_rating: number;
  vendor_verified: boolean;
  vendor_city?: string;
  vendor_province?: string;
  completed_orders: number;
  category: string;
  category_slug: string;
  response_time: string;
  rating: number;
  total_reviews: number;
  tags: string[];
  category_tags: string[];
  images: string[];
  image: string;
}

export interface ServiceDetails extends Service {
  short_description: string;
  pricing_tiers: any[];
  features: string[];
  service_areas: string[];
  requirements: string;
  total_orders: number;
  vendor: {
    id: number;
    name: string;
    contact: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    image: string;
    rating: number;
    completed_orders: number;
    verified: boolean;
    description: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  };
  reviews: Array<{
    id: number;
    rating: number;
    title: string;
    comment: string;
    customer_name: string;
    created_at: string;
    would_recommend: boolean;
    vendor_response: string;
    vendor_response_date: string;
  }>;
}

export interface ServicesResponse {
  error: boolean;
  services: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: ServiceFilters;
}

export interface ServiceDetailsResponse {
  error: boolean;
  service: ServiceDetails;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  status: number;
  sort_order: number;
}

export interface CategoriesResponse {
  error: boolean;
  categories: Category[];
}

class ServicesAPI {
  // Get all services with filters
  async getServices(filters: ServiceFilters = {}): Promise<ServicesResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.SERVICES.LIST}?${params.toString()}`
    );
    return response.data;
  }

  // Get service details by ID
  async getServiceDetails(serviceId: string | number): Promise<ServiceDetailsResponse> {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.SERVICES.DETAILS}/${serviceId}`
    );
    return response.data;
  }

  // Get all categories
  async getCategories(): Promise<CategoriesResponse> {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.SERVICES.CATEGORIES);
    return response.data;
  }
}

export default new ServicesAPI();
