import apiClient from '@/config/axios';
import API_CONFIG from '@/config/api';

export interface Order {
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

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
}

export interface OrdersResponse {
  error: boolean;
  data: {
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  message?: string;
}

export interface CreateOrderData {
  service_id: number;
  service_name: string;
  vendor_id: number;
  amount: number;
  payment_intent_id: string;
  service_type?: 'fixed' | 'custom';
}

export interface CreateOrderResponse {
  error: boolean;
  data?: {
    order_id: string;
    status: string;
    message: string;
  };
  message?: string;
}

class OrdersAPI {
  // Create order after successful payment
  async createOrder(data: CreateOrderData): Promise<CreateOrderResponse> {
    try {
      const response = await apiClient.post('/api/marketplace/auth/orders/create', data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to create order'
      };
    }
  }

  // Get customer orders
  async getCustomerOrders(filters: OrderFilters = {}): Promise<OrdersResponse> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/api/marketplace/auth/orders?${params.toString()}`);
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

  // Get order details
  async getOrderDetails(orderId: string): Promise<{ error: boolean; data?: Order; message?: string }> {
    try {
      const response = await apiClient.get(`/api/marketplace/auth/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch order details'
      };
    }
  }
}

export default new OrdersAPI();
