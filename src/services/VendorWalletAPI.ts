import vendorApiClient from '@/config/vendorAxios';
import API_CONFIG from '@/config/api';

export interface WalletBalance {
  available_balance: number;
  pending_balance: number;
  total_earnings: number;
  total_withdrawals: number;
  currency: string;
}

export interface Transaction {
  id: number;
  type: 'earning' | 'withdrawal' | 'fee' | 'refund' | 'bonus';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
  updated_at: string;
  customer_name?: string;
  service_title?: string;
  stripe_transaction_id?: string;
  reference_id?: string;
}

export interface PaymentMethod {
  id: number;
  type: 'bank_account' | 'card';
  last4: string;
  bank_name?: string;
  account_type?: string;
  card_brand?: string;
  is_default: boolean;
  status: 'active' | 'inactive' | 'pending_verification';
  created_at: string;
}

export interface WithdrawalRequest {
  amount: number;
  payment_method_id: number;
  description?: string;
}

export interface EarningsStats {
  today: number;
  this_week: number;
  this_month: number;
  this_year: number;
  last_30_days: number;
  growth_percentage: number;
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

class VendorWalletAPI {
  // Get wallet balance and overview
  static async getWalletBalance(): Promise<APIResponse<WalletBalance>> {
    try {
      const response = await vendorApiClient.get(API_CONFIG.ENDPOINTS.VENDOR_WALLET.BALANCE);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch wallet balance'
      };
    }
  }

  // Get transaction history
  static async getTransactions(filters?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<APIResponse<{ transactions: Transaction[] }>> {
    try {
      const response = await vendorApiClient.get(API_CONFIG.ENDPOINTS.VENDOR_WALLET.TRANSACTIONS, { params: filters });
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch transactions'
      };
    }
  }

  // Get earnings statistics
  static async getEarningsStats(): Promise<APIResponse<EarningsStats>> {
    try {
      const response = await vendorApiClient.get(API_CONFIG.ENDPOINTS.VENDOR_WALLET.EARNINGS_STATS);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch earnings stats'
      };
    }
  }

  // Get payment methods
  static async getPaymentMethods(): Promise<APIResponse<{ payment_methods: PaymentMethod[] }>> {
    try {
      const response = await vendorApiClient.get(API_CONFIG.ENDPOINTS.VENDOR_WALLET.PAYMENT_METHODS);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch payment methods'
      };
    }
  }

  // Add payment method
  static async addPaymentMethod(data: {
    type: 'bank_account' | 'card';
    account_number?: string;
    routing_number?: string;
    account_holder_name?: string;
    bank_name?: string;
    card_token?: string;
  }): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.post(API_CONFIG.ENDPOINTS.VENDOR_WALLET.PAYMENT_METHODS, data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to add payment method'
      };
    }
  }

  // Remove payment method
  static async removePaymentMethod(paymentMethodId: number): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.delete(`${API_CONFIG.ENDPOINTS.VENDOR_WALLET.PAYMENT_METHODS}/${paymentMethodId}`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to remove payment method'
      };
    }
  }

  // Set default payment method
  static async setDefaultPaymentMethod(paymentMethodId: number): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.put(`${API_CONFIG.ENDPOINTS.VENDOR_WALLET.PAYMENT_METHODS}/${paymentMethodId}/default`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to set default payment method'
      };
    }
  }

  // Request withdrawal
  static async requestWithdrawal(data: WithdrawalRequest): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.post(API_CONFIG.ENDPOINTS.VENDOR_WALLET.WITHDRAW, data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to request withdrawal'
      };
    }
  }

  // Get withdrawal history
  static async getWithdrawals(filters?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<APIResponse<{ withdrawals: Transaction[] }>> {
    try {
      const response = await vendorApiClient.get(API_CONFIG.ENDPOINTS.VENDOR_WALLET.WITHDRAWALS, { params: filters });
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch withdrawals'
      };
    }
  }

  // Export transactions
  static async exportTransactions(filters?: {
    date_from?: string;
    date_to?: string;
    format?: 'csv' | 'pdf';
  }): Promise<APIResponse<{ download_url: string }>> {
    try {
      const response = await vendorApiClient.post(API_CONFIG.ENDPOINTS.VENDOR_WALLET.EXPORT, filters);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to export transactions'
      };
    }
  }
}

export default VendorWalletAPI;
