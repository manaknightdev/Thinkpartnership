/**
 * Cart API Service
 * Handles shopping cart operations for flat fee services
 */

import apiClient from '@/config/axios';
import { ServiceDetails } from './ServicesAPI';
import { TaxCalculation } from './TaxAPI';

export interface CartItem {
  id: number;
  customer_id: number;
  service_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  service: ServiceDetails;
}

export interface CartSummary {
  total_items: number;
  total_amount: number;
  vendors: {
    vendor_id: number;
    vendor_name: string;
    items: CartItem[];
    subtotal: number;
    tax_calculation?: TaxCalculation;
    total: number;
  }[];
  grand_total: number;
  grand_tax_amount: number;
  grand_subtotal: number;
}

export interface AddToCartRequest {
  service_id: number;
  quantity?: number;
}

export interface CartResponse {
  error: boolean;
  message?: string;
  data?: {
    cart_items: CartItem[];
    summary: CartSummary;
  };
}

export interface CartItemResponse {
  error: boolean;
  message?: string;
  data?: CartItem;
}

export interface CartCheckoutRequest {
  payment_intent_id: string;
  billing_address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface CartCheckoutResponse {
  error: boolean;
  message?: string;
  data?: {
    orders: {
      order_id: number;
      order_number: string;
      vendor_id: number;
      vendor_name: string;
      amount: number;
      items: CartItem[];
    }[];
    total_amount: number;
    payment_intent_id: string;
  };
}

class CartAPI {
  /**
   * Get all cart items for authenticated user
   */
  async getCart(): Promise<CartResponse> {
    try {
      const response = await apiClient.get('/api/marketplace/auth/cart');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch cart items'
      };
    }
  }

  /**
   * Add service to cart
   */
  async addToCart(request: AddToCartRequest): Promise<CartItemResponse> {
    try {
      const response = await apiClient.post('/api/marketplace/auth/cart/add', request);
      return response.data;
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to add item to cart'
      };
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(itemId: number, quantity: number): Promise<CartItemResponse> {
    try {
      const response = await apiClient.put(`/api/marketplace/auth/cart/items/${itemId}`, { quantity });
      return response.data;
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to update cart item'
      };
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(itemId: number): Promise<{ error: boolean; message?: string }> {
    try {
      const response = await apiClient.delete(`/api/marketplace/auth/cart/items/${itemId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to remove item from cart'
      };
    }
  }

  /**
   * Clear all cart items
   */
  async clearCart(): Promise<{ error: boolean; message?: string }> {
    try {
      const response = await apiClient.delete('/api/marketplace/auth/cart/clear');
      return response.data;
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to clear cart'
      };
    }
  }

  /**
   * Get cart items count
   */
  async getCartCount(): Promise<{ error: boolean; count?: number; message?: string }> {
    try {
      const response = await apiClient.get('/api/marketplace/auth/cart/count');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching cart count:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to get cart count'
      };
    }
  }

  /**
   * Create payment intent for cart checkout
   */
  async createCartPaymentIntent(): Promise<{ 
    error: boolean; 
    client_secret?: string; 
    amount?: number;
    message?: string 
  }> {
    try {
      const response = await apiClient.post('/api/marketplace/auth/cart/create-payment-intent');
      return response.data;
    } catch (error: any) {
      console.error('Error creating cart payment intent:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to create payment intent'
      };
    }
  }

  /**
   * Checkout cart - create multiple orders
   */
  async checkoutCart(request: CartCheckoutRequest): Promise<CartCheckoutResponse> {
    try {
      const response = await apiClient.post('/api/marketplace/auth/cart/checkout', request);
      return response.data;
    } catch (error: any) {
      console.error('Error checking out cart:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to checkout cart'
      };
    }
  }

  /**
   * Get cart validation (check if services are still available and prices are current)
   */
  async validateCart(): Promise<{
    error: boolean;
    valid?: boolean;
    issues?: {
      type: 'price_changed' | 'service_unavailable' | 'vendor_suspended';
      item_id: number;
      service_name: string;
      message: string;
    }[];
    message?: string;
  }> {
    try {
      const response = await apiClient.get('/api/marketplace/auth/cart/validate');
      return response.data;
    } catch (error: any) {
      console.error('Error validating cart:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to validate cart'
      };
    }
  }
}

export default new CartAPI();