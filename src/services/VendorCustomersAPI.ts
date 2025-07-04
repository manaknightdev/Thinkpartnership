import apiClient from '@/config/axios';
import API_CONFIG from '@/config/api';

export interface VendorCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  join_date: string;
  total_requests: number;
  total_spent: number;
  last_request_date: string;
  status: string;
}

export interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface VendorCustomersResponse {
  error: boolean;
  customers: VendorCustomer[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface CustomerDetailsResponse {
  error: boolean;
  customer?: VendorCustomer & {
    address?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    bio?: string;
    preferences?: any;
    recent_requests?: Array<{
      id: number;
      service_title: string;
      status: number;
      created_at: string;
      amount: number;
    }>;
    order_history?: Array<{
      id: number;
      service_title: string;
      status: number;
      completed_at: string;
      amount: number;
      rating?: number;
      review?: string;
    }>;
  };
  message?: string;
}

export interface CustomerStats {
  error: boolean;
  stats: {
    total_customers: number;
    new_customers_this_month: number;
    repeat_customers: number;
    average_order_value: number;
    customer_retention_rate: number;
    top_customers: Array<{
      id: number;
      name: string;
      email: string;
      total_spent: number;
      total_orders: number;
    }>;
  };
}

class VendorCustomersAPI {
  // Get vendor customers
  async getCustomers(filters: CustomerFilters = {}): Promise<VendorCustomersResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_CUSTOMERS.LIST}?${params.toString()}`
    );
    return response.data;
  }

  // Get customer details
  async getCustomerDetails(customerId: number): Promise<CustomerDetailsResponse> {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_CUSTOMERS.LIST}/${customerId}`
    );
    return response.data;
  }

  // Search customers
  async searchCustomers(query: string, filters: CustomerFilters = {}): Promise<VendorCustomersResponse> {
    const params = new URLSearchParams();
    params.append('search', query);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_CUSTOMERS.LIST}/search?${params.toString()}`
    );
    return response.data;
  }

  // Get customer statistics
  async getCustomerStats(): Promise<CustomerStats> {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_CUSTOMERS.LIST}/stats`
    );
    return response.data;
  }

  // Get customer order history
  async getCustomerOrderHistory(customerId: number, page: number = 1, limit: number = 10): Promise<{
    error: boolean;
    orders: Array<{
      id: number;
      service_title: string;
      status: number;
      created_at: string;
      completed_at?: string;
      amount: number;
      rating?: number;
      review?: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_CUSTOMERS.LIST}/${customerId}/orders?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Get customer request history
  async getCustomerRequestHistory(customerId: number, page: number = 1, limit: number = 10): Promise<{
    error: boolean;
    requests: Array<{
      id: number;
      service_title: string;
      status: number;
      created_at: string;
      description: string;
      budget_range?: string;
      vendor_quote?: number;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_CUSTOMERS.LIST}/${customerId}/requests?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Export customers to CSV
  async exportCustomers(filters: CustomerFilters = {}): Promise<Blob> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_CUSTOMERS.LIST}/export?${params.toString()}`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  // Add customer note
  async addCustomerNote(customerId: number, note: string): Promise<{
    error: boolean;
    message: string;
    note_id?: number;
  }> {
    const response = await apiClient.post(
      `${API_CONFIG.ENDPOINTS.VENDOR_CUSTOMERS.LIST}/${customerId}/notes`,
      { note }
    );
    return response.data;
  }

  // Get customer notes
  async getCustomerNotes(customerId: number): Promise<{
    error: boolean;
    notes: Array<{
      id: number;
      note: string;
      created_at: string;
      created_by: string;
    }>;
  }> {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_CUSTOMERS.LIST}/${customerId}/notes`
    );
    return response.data;
  }

  // Update customer status
  async updateCustomerStatus(customerId: number, status: string): Promise<{
    error: boolean;
    message: string;
  }> {
    const response = await apiClient.put(
      `${API_CONFIG.ENDPOINTS.VENDOR_CUSTOMERS.LIST}/${customerId}/status`,
      { status }
    );
    return response.data;
  }
}

export default new VendorCustomersAPI();
