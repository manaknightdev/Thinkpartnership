import clientApiClient from '@/config/clientAxios';
import API_CONFIG from '@/config/api';

export interface ClientReferral {
  id: number;
  referrer_id: number;
  referred_user_id: number;
  referral_code: string;
  referral_type: 'customer' | 'vendor';
  status: 'pending' | 'completed' | 'expired';
  commission_earned: number;
  commission_rate: number;
  referred_user_name: string;
  referred_user_email: string;
  signup_date: string;
  first_purchase_date?: string;
  total_spent: number;
  created_at: string;
}

export interface ClientReferralStats {
  total_referrals: number;
  active_referrals: number;
  total_commission_earned: number;
  pending_commission: number;
  this_month_referrals: number;
  this_month_commission: number;
  conversion_rate: number;
  average_commission_per_referral: number;
}

export interface ClientReferralCode {
  id: number;
  code: string;
  description: string;
  commission_rate: number;
  max_uses?: number;
  current_uses: number;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

export interface ClientReferralLink {
  id: number;
  name: string;
  url: string;
  referral_code: string;
  referral_type: 'customer' | 'vendor';
  clicks: number;
  conversions: number;
  conversion_rate: number;
  created_at: string;
}

export interface CreateClientReferralCodeData {
  code: string;
  description: string;
  commission_rate: number;
  max_uses?: number;
  expires_at?: string;
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

class ClientReferralAPI {
  // Get referral statistics
  static async getReferralStats(): Promise<APIResponse<ClientReferralStats>> {
    try {
      const response = await clientApiClient.get(API_CONFIG.ENDPOINTS.CLIENT_REFERRALS.STATS);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch referral stats'
      };
    }
  }

  // Get referrals list
  static async getReferrals(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<APIResponse<{ referrals: ClientReferral[] }>> {
    try {
      const response = await clientApiClient.get(API_CONFIG.ENDPOINTS.CLIENT_REFERRALS.LIST, { params: filters });
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch referrals'
      };
    }
  }

  // Get referral codes
  static async getReferralCodes(): Promise<APIResponse<{ codes: ClientReferralCode[] }>> {
    try {
      const response = await clientApiClient.get(API_CONFIG.ENDPOINTS.CLIENT_REFERRALS.CODES);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch referral codes'
      };
    }
  }

  // Create referral code
  static async createReferralCode(data: CreateClientReferralCodeData): Promise<APIResponse> {
    try {
      const response = await clientApiClient.post(API_CONFIG.ENDPOINTS.CLIENT_REFERRALS.CODES, data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to create referral code'
      };
    }
  }

  // Update referral code
  static async updateReferralCode(codeId: number, data: Partial<CreateClientReferralCodeData>): Promise<APIResponse> {
    try {
      const response = await clientApiClient.put(`${API_CONFIG.ENDPOINTS.CLIENT_REFERRALS.CODES}/${codeId}`, data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to update referral code'
      };
    }
  }

  // Delete referral code
  static async deleteReferralCode(codeId: number): Promise<APIResponse> {
    try {
      const response = await clientApiClient.delete(`${API_CONFIG.ENDPOINTS.CLIENT_REFERRALS.CODES}/${codeId}`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to delete referral code'
      };
    }
  }

  // Toggle referral code status
  static async toggleReferralCode(codeId: number): Promise<APIResponse> {
    try {
      const response = await clientApiClient.put(`${API_CONFIG.ENDPOINTS.CLIENT_REFERRALS.CODES}/${codeId}/toggle`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to toggle referral code'
      };
    }
  }

  // Get referral links
  static async getReferralLinks(): Promise<APIResponse<{ links: ClientReferralLink[] }>> {
    try {
      const response = await clientApiClient.get(API_CONFIG.ENDPOINTS.CLIENT_REFERRALS.LINKS);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch referral links'
      };
    }
  }

  // Generate referral link
  static async generateReferralLink(data: {
    name: string;
    referral_code: string;
    referral_type: 'customer' | 'vendor';
    target_url?: string;
  }): Promise<APIResponse<{ link: ClientReferralLink }>> {
    try {
      const response = await clientApiClient.post(API_CONFIG.ENDPOINTS.CLIENT_REFERRALS.LINKS, data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to generate referral link'
      };
    }
  }

  // Get referral analytics
  static async getReferralAnalytics(filters?: {
    period?: 'week' | 'month' | 'quarter' | 'year';
    date_from?: string;
    date_to?: string;
  }): Promise<APIResponse<{
    chart_data: Array<{
      date: string;
      referrals: number;
      commission: number;
    }>;
    top_performing_codes: Array<{
      code: string;
      referrals: number;
      commission: number;
    }>;
  }>> {
    try {
      const response = await clientApiClient.get(API_CONFIG.ENDPOINTS.CLIENT_REFERRALS.ANALYTICS, { params: filters });
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch referral analytics'
      };
    }
  }
}

export default ClientReferralAPI;
