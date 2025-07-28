import adminApiClient from '@/config/adminAxios';
import { API_CONFIG } from '@/config/api';

export interface AdminWalletBalance {
  available_balance: string | number;
  pending_balance: string | number;
  total_earnings: string | number;
  total_withdrawals: string | number;
  currency: string;
}

export interface AdminWalletTransaction {
  id: string;
  type: 'commission' | 'withdrawal' | 'fee' | 'refund' | 'platform_revenue';
  amount: string | number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
  client_name?: string;
  vendor_name?: string;
  customer_name?: string;
  service_title?: string;
  stripe_transaction_id?: string;
  reference_id?: string;
}

export interface AdminWithdrawalRequest {
  amount: number;
  description?: string;
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

class AdminWalletAPI {
  // Get admin wallet balance and overview
  static async getWalletBalance(): Promise<AdminWalletBalance> {
    try {
      const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_WALLET.BALANCE);
      
      if (response.data.error) {
        throw new Error(response.data.message || 'Failed to fetch wallet balance');
      }
      
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Get Admin Wallet Balance error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch wallet balance');
    }
  }

  // Get admin wallet transactions with pagination
  static async getWalletTransactions(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    search?: string;
  }): Promise<{
    transactions: AdminWalletTransaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_WALLET.TRANSACTIONS, { params });
      
      if (response.data.error) {
        throw new Error(response.data.message || 'Failed to fetch transactions');
      }
      
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Get Admin Wallet Transactions error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }

  // Request withdrawal
  static async requestWithdrawal(data: AdminWithdrawalRequest): Promise<APIResponse> {
    try {
      const response = await adminApiClient.post(API_CONFIG.ENDPOINTS.ADMIN_WALLET.WITHDRAW, data);
      return response.data;
    } catch (error: any) {
      console.error('Admin Withdrawal Request error:', error);
      throw new Error(error.response?.data?.message || 'Failed to request withdrawal');
    }
  }

  // Get withdrawal history
  static async getWithdrawals(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{
    withdrawals: AdminWalletTransaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_WALLET.WITHDRAWALS, { params });
      
      if (response.data.error) {
        throw new Error(response.data.message || 'Failed to fetch withdrawals');
      }
      
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Get Admin Withdrawals error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch withdrawals');
    }
  }

  // Export wallet data
  static async exportWalletData(params?: {
    start_date?: string;
    end_date?: string;
    type?: string;
    format?: 'csv' | 'xlsx';
  }): Promise<{
    error: boolean;
    message?: string;
    download_url?: string;
  }> {
    try {
      const response = await adminApiClient.post(API_CONFIG.ENDPOINTS.ADMIN_WALLET.EXPORT, params);
      return response.data;
    } catch (error: any) {
      console.error('Export Admin Wallet Data error:', error);
      throw new Error(error.response?.data?.message || 'Failed to export wallet data');
    }
  }
}

export default AdminWalletAPI;
