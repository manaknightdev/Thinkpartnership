import clientApiClient from '@/config/clientAxios';
import { API_CONFIG } from '@/config/api';

// Types for Client API
export interface ClientLoginData {
  email: string;
  password: string;
  is_refresh?: boolean;
}

export interface ClientRegisterData {
  email: string;
  password: string;
  company_name: string;
  contact_name: string;
  phone?: string;
  business_address: string;
  city: string;
  province: string;
  postal_code: string;
  business_type: string;
  is_refresh?: boolean;
}

export interface ClientAuthResponse {
  error: boolean;
  message: string;
  token?: string;
  access_token?: string;
  refresh_token?: string;
  expire_at?: number;
  user_id?: number;
  client_id?: string | number;
  client_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  is_client_access?: boolean;
  is_admin_impersonation?: boolean;
  user?: ClientProfile;
}

export interface ClientProfile {
  id: string;
  email: string;
  company_name: string;
  contact_name: string;
  phone?: string;
  business_address: string;
  city: string;
  province: string;
  postal_code: string;
  business_type: string;
  status: string;
  created_at: string;
}

export interface DashboardStats {
  total_revenue: number;
  active_vendors: number;
  total_customers: number;
  pending_orders: number;
  monthly_growth: number;
  vendor_growth: number;
  customer_growth: number;
  order_growth: number;
}

export interface ClientVendor {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  status: string;
  services_count: number;
  total_revenue: number;
  total_referrals?: number;
  total_invites_accepted?: number;
  total_referral_commission?: number;
  completed_jobs?: number;
  rating?: number;
  total_reviews?: number;
  verified?: boolean;
  join_date?: string;
  created_at: string;
}

export interface ReportsVendorData extends ClientVendor {
  total_referrals: number;
  total_invites_accepted: number;
  total_referral_commission: number;
}

export interface ReportsSummary {
  total_vendors: number;
  total_revenue: number;
  total_referrals: number;
  total_completed_jobs: number;
}

export interface ClientCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: string;
  completed_orders: number;
  total_spent: string | number;
  join_date: string;
  total_requests: number;
  last_order_date: string | null;
  vendors_used: number;
}

export interface ClientOrder {
  id: string;
  customer: string;
  vendor: string;
  service: string;
  date: string;
  amount: string;
  status: string;
  notes?: string;
  customer_name?: string;
  vendor_name?: string;
  service_title?: string;
  created_at?: string;
}

export interface ClientInvite {
  id: string;
  email: string;
  type: 'customer' | 'vendor';
  status: string;
  sent_at: string;
  accepted_at?: string;
}

export interface WalletBalance {
  balance: number;
  pending_balance: number;
  total_earned: number;
  currency: string;
}

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
}

export interface RevenueRule {
  id: string;
  service: string;
  clientShare: string;
  vendorShare: string;
  platformShare: string;
}

export interface BrandingSettings {
  logo_url?: string;
  favicon_url?: string;
  primary_color: string;
  secondary_color: string;
  company_name: string;
  marketplace_subdomain?: string;
  font_family?: string;
  tagline?: string;
  custom_domain?: string;
  theme_settings: Record<string, any>;
  // Marketplace content text fields
  hero_heading?: string;
  hero_subheading?: string;
  hero_search_placeholder?: string;
  featured_section_title?: string;
  featured_section_subtitle?: string;
  cta_heading?: string;
  cta_subheading?: string;
  cta_button_text?: string;
}

export interface ClientCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  image: string | null;
  sort_order: number;
  status: number;
  client_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryData {
  name: string;
  description: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

class ClientAPI {
  // Authentication Methods
  async register(data: ClientRegisterData): Promise<ClientAuthResponse> {
    const response = await clientApiClient.post('/api/marketplace/client/auth/register', data);
    return response.data;
  }

  async login(data: ClientLoginData): Promise<ClientAuthResponse> {
    const response = await clientApiClient.post('/api/marketplace/client/auth/login', data);
    return response.data;
  }

  // Profile Methods
  async getProfile(): Promise<ClientProfile> {
    const response = await clientApiClient.get('/api/marketplace/client/auth/profile');
    return response.data;
  }

  // Marketplace Access
  async getMarketplaceAccess(): Promise<ClientAuthResponse> {
    const response = await clientApiClient.post('/api/marketplace/client/auth/marketplace-login');
    return response.data;
  }

  // Dashboard Methods
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await clientApiClient.get('/api/marketplace/client/dashboard/stats');
    const apiStats = response.data.stats;

    // Map API response to frontend interface
    return {
      total_revenue: apiStats.total_revenue || 0,
      active_vendors: apiStats.active_vendors || 0,
      total_customers: apiStats.total_customers || 0,
      pending_orders: apiStats.pending_vendors || 0, // Map pending_vendors to pending_orders
      monthly_growth: 0, // TODO: Calculate from month_revenue vs previous month
      vendor_growth: 0, // TODO: Calculate vendor growth
      customer_growth: 0, // TODO: Calculate customer growth
      order_growth: 0 // TODO: Calculate order growth
    };
  }

  // Vendor Management Methods
  async getVendors(): Promise<ClientVendor[]> {
    const response = await clientApiClient.get('/api/marketplace/client/vendors');
    return response.data.vendors || response.data;
  }

  async updateVendorStatus(vendorId: string, status: string): Promise<any> {
    const response = await clientApiClient.put(`/api/marketplace/client/vendors/${vendorId}/status`, { status });
    return response.data;
  }

  // Customer Management Methods
  async getCustomers(): Promise<ClientCustomer[]> {
    const response = await clientApiClient.get('/api/marketplace/client/customers');
    return response.data.customers || response.data;
  }

  // Order Management Methods
  async getOrders(): Promise<ClientOrder[]> {
    const response = await clientApiClient.get('/api/marketplace/client/orders');
    return response.data.orders || [];
  }

  async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<any> {
    const response = await clientApiClient.put(`/api/marketplace/client/orders/${orderId}/status`, { status, notes });
    return response.data;
  }

  // Revenue Rules Methods
  async getRevenueRules(): Promise<RevenueRule[]> {
    const response = await clientApiClient.get('/api/marketplace/client/revenue-rules');
    return response.data;
  }

  async updateRevenueRules(rules: RevenueRule[]): Promise<any> {
    const response = await clientApiClient.put('/api/marketplace/client/revenue-rules', { rules });
    return response.data;
  }

  async createRevenueRule(rule: Omit<RevenueRule, 'id'>): Promise<RevenueRule> {
    const response = await clientApiClient.post('/api/marketplace/client/revenue-rules', rule);
    return response.data;
  }

  async deleteRevenueRule(ruleId: string): Promise<any> {
    const response = await clientApiClient.delete(`/api/marketplace/client/revenue-rules/${ruleId}`);
    return response.data;
  }

  // Invite System Methods
  async sendInvites(invites: { email: string; type: 'customer' | 'vendor'; message?: string }[]): Promise<any> {
    const response = await clientApiClient.post('/api/marketplace/client/invites', { invites });
    return response.data;
  }

  async getInvites(): Promise<ClientInvite[]> {
    const response = await clientApiClient.get('/api/marketplace/client/invites');
    return response.data;
  }

  async sendSingleInvite(data: {
    email: string;
    type: 'customer' | 'vendor';
    name?: string;
    message?: string;
  }): Promise<any> {
    const response = await clientApiClient.post('/api/marketplace/client/invites/send', data);
    return response.data;
  }

  // Wallet Methods
  async getWalletBalance(): Promise<WalletBalance> {
    const response = await clientApiClient.get('/api/marketplace/client/wallet');
    return response.data;
  }

  async getWalletTransactions(): Promise<WalletTransaction[]> {
    const response = await clientApiClient.get('/api/marketplace/client/wallet/transactions');
    return response.data;
  }

  // Branding Methods
  async getBrandingSettings(): Promise<BrandingSettings> {
    const response = await clientApiClient.get('/api/marketplace/client/branding');
    return response.data.branding || {};
  }

  async updateBrandingSettings(settings: Partial<BrandingSettings>): Promise<any> {
    const response = await clientApiClient.put('/api/marketplace/client/branding', settings);
    return response.data;
  }

  // File Upload Methods
  async uploadFile(file: File, caption?: string): Promise<{ url: string; id: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (caption) {
      formData.append('caption', caption);
    }

    const response = await clientApiClient.post('/v1/api/thinkpartnership/client/lambda/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // S3 Upload for Branding (uses the same S3 backend as vendor services)
  async uploadBrandingFile(file: File): Promise<{ error: boolean; url?: string; message?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // First try the dedicated S3 upload endpoint
      try {
        const response = await clientApiClient.post('/v1/api/thinkpartnership/client/lambda/s3/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return {
          error: false,
          url: response.data.url || response.data.file_url
        };
      } catch (s3Error) {
        // Fallback to the regular upload endpoint (which may also use S3 internally)
        console.warn('S3 endpoint not available, falling back to regular upload:', s3Error);
        
        const fallbackResponse = await clientApiClient.post('/v1/api/thinkpartnership/client/lambda/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return {
          error: false,
          url: fallbackResponse.data.url || fallbackResponse.data.file_url
        };
      }
    } catch (error: any) {
      console.error('Error uploading branding file:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to upload file'
      };
    }
  }

  // Reports Methods
  async getReportsVendors(period: string = 'all'): Promise<{ vendors: ReportsVendorData[], summary: ReportsSummary }> {
    const response = await clientApiClient.get('/api/marketplace/client/reports/vendors', {
      params: { period }
    });
    return response.data;
  }

  // Category Management Methods
  async getClientCategories(): Promise<{ error: boolean; categories: ClientCategory[]; message?: string }> {
    try {
      const response = await clientApiClient.get('/api/marketplace/client/categories');
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        categories: [],
        message: error.response?.data?.message || 'Failed to load categories'
      };
    }
  }

  async createClientCategory(data: CreateCategoryData): Promise<{ error: boolean; message: string; category?: ClientCategory }> {
    try {
      const response = await clientApiClient.post('/api/marketplace/client/categories', data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to create category'
      };
    }
  }

  async updateClientCategory(categoryId: number, data: UpdateCategoryData): Promise<{ error: boolean; message: string }> {
    try {
      const response = await clientApiClient.put(`/api/marketplace/client/categories/${categoryId}`, data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to update category'
      };
    }
  }

  async deleteClientCategory(categoryId: number): Promise<{ error: boolean; message: string }> {
    try {
      const response = await clientApiClient.delete(`/api/marketplace/client/categories/${categoryId}`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to delete category'
      };
    }
  }

  // Auth Helper Methods
  storeAuthData(authResponse: ClientAuthResponse) {
    if (authResponse.token) {
      localStorage.setItem('client_token', authResponse.token);
    }
    if (authResponse.client_id) {
      localStorage.setItem('client_id', String(authResponse.client_id));
    }
    if (authResponse.user) {
      localStorage.setItem('client_user', JSON.stringify(authResponse.user));
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem('client_token');
  }

  getStoredUser(): ClientProfile | null {
    const user = localStorage.getItem('client_user');
    return user ? JSON.parse(user) : null;
  }

  clearAuthData() {
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_id');
    localStorage.removeItem('client_user');
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  // Check if current session is admin impersonation
  isAdminImpersonation(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;

    try {
      // Decode JWT token to check for impersonation flag
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.is_impersonation === true;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  // Get the admin user ID who is impersonating (if any)
  getImpersonatingAdminId(): number | null {
    const token = this.getStoredToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.impersonated_by || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Return to admin portal (for admin impersonation)
  async returnToAdminPortal(): Promise<void> {
    const adminId = this.getImpersonatingAdminId();
    
    if (!adminId) {
      throw new Error('Not an admin impersonation session');
    }

    try {
      // Call the backend to get a fresh admin token using the client token
      const response = await clientApiClient.post(API_CONFIG.ENDPOINTS.ADMIN_AUTH.RETURN_FROM_IMPERSONATION);

      if (response.data.error) {
        throw new Error(response.data.message || 'Failed to return to admin portal');
      }

      // Clear client auth data
      this.clearAuthData();

      // Store admin auth data
      const AdminAPI = (await import('./AdminAPI')).default;
      AdminAPI.storeAuthData({
        error: false,
        message: response.data.message || 'Successfully returned to admin portal',
        token: response.data.token,
        refresh_token: response.data.refresh_token,
        role: response.data.role,
        user_id: response.data.user_id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email
      });

      // Redirect to admin portal clients page
      window.location.href = '/admin-portal/clients';
    } catch (error: any) {
      console.error('Error returning to admin portal:', error);
      
      // Clear client auth data on error
      this.clearAuthData();
      
      // Show specific error message based on error type
      if (error.response?.status === 401) {
        throw new Error('Your admin session has expired. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to return to admin portal.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.message || 'Failed to return to admin portal. Please log in again.');
      }
    }
  }

  // Service Approval Methods
  async getPendingServices(params?: { type?: string; page?: number; limit?: number }): Promise<any> {
    const response = await clientApiClient.get('/api/marketplace/client/pending-services', { params });
    return response.data;
  }

  async reviewService(serviceId: number, data: { action: 'approve' | 'reject'; service_type: string; comments?: string }): Promise<any> {
    const response = await clientApiClient.post(`/api/marketplace/client/services/${serviceId}/review`, data);
    return response.data;
  }

  // Paid Promotion Approval Methods
  async getPendingPromotions(): Promise<any> {
    const response = await clientApiClient.get('/api/marketplace/client/paid-promotion/pending');
    return response.data;
  }

  async reviewPromotion(promotionId: number, data: { action: 'approve' | 'reject'; comments?: string }): Promise<any> {
    const response = await clientApiClient.post(`/api/marketplace/client/paid-promotion/${promotionId}/review`, data);
    return response.data;
  }
}

export default new ClientAPI();
