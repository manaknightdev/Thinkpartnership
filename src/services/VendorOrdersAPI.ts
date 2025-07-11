import vendorApiClient from '@/config/vendorAxios';
import API_CONFIG from '@/config/api';

export interface VendorOrder {
  id: string;
  customer_id: number;
  vendor_id: number;
  service_id: number;
  service_name: string;
  service_type: 'fixed' | 'custom';
  amount: number;
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_intent_id?: string;
  customer_name: string;
  customer_email: string;
  vendor_name: string;
  order_date: string;
  completion_date?: string;
  notes?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface VendorOrderFilters {
  page?: number;
  limit?: number;
  status?: string;
}

export interface VendorOrdersResponse {
  error: boolean;
  data: {
    orders: VendorOrder[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  message?: string;
}

export interface UpdateOrderStatusData {
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled';
  notes?: string;
}

class VendorOrdersAPI {
  // Get vendor orders
  async getOrders(filters: VendorOrderFilters = {}): Promise<VendorOrdersResponse> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await vendorApiClient.get(`/api/marketplace/vendor/auth/orders?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        data: {
          orders: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            pages: 0
          }
        },
        message: error.response?.data?.message || 'Failed to fetch orders'
      };
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, data: UpdateOrderStatusData): Promise<{ error: boolean; message: string }> {
    try {
      const response = await vendorApiClient.put(`/api/marketplace/vendor/auth/orders/${orderId}/status`, data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to update order status'
      };
    }
  }

  // Get order details
  async getOrderDetails(orderId: string): Promise<{ error: boolean; data?: VendorOrder; message?: string }> {
    try {
      const response = await vendorApiClient.get(`/api/marketplace/vendor/auth/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch order details'
      };
    }
  }

  // Get order statistics
  async getOrderStats(): Promise<{ 
    error: boolean; 
    data?: { 
      total: number; 
      completed: number; 
      processing: number; 
      paid: number; 
      total_earnings: number; 
    }; 
    message?: string 
  }> {
    try {
      const response = await vendorApiClient.get('/api/marketplace/vendor/auth/orders/stats');
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch order statistics'
      };
    }
  }
}

export default new VendorOrdersAPI();
