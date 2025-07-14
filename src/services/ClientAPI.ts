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
  client_id?: string;
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
  created_at: string;
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
  primary_color: string;
  secondary_color: string;
  company_name: string;
  tagline?: string;
  custom_domain?: string;
  theme_settings: Record<string, any>;
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

  // Dashboard Methods
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await clientApiClient.get('/api/marketplace/client/dashboard/stats');
    return response.data;
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

  // Auth Helper Methods
  storeAuthData(authResponse: ClientAuthResponse) {
    if (authResponse.token) {
      localStorage.setItem('client_token', authResponse.token);
    }
    if (authResponse.client_id) {
      localStorage.setItem('client_id', authResponse.client_id);
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
}

export default new ClientAPI();
