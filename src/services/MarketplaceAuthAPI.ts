import axios from 'axios';
import { API_CONFIG } from '@/config/api';

export interface MarketplaceRegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_refresh?: boolean;
  referral_code?: string;
  vendor_id?: string;
  invite_code?: string;
}

export interface MarketplaceLoginData {
  email: string;
  password: string;
  is_refresh?: boolean;
}

export interface MarketplaceAuthResponse {
  error: boolean;
  message: string;
  role?: string;
  token?: string;
  access_token?: string;
  refresh_token?: string;
  expire_at?: number;
  user_id?: number;
  customer_id?: number;
  client_id?: number;
  client_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface MarketplaceUserProfile {
  error: boolean;
  user?: {
    id: number;
    email: string;
    role: string;
    status: number;
    first_name: string;
    last_name: string;
    phone: string;
    photo: string;
    created_at: string;
    client_id?: number;
    customer_id?: number;
  };
}

class MarketplaceAuthAPI {
  private getClientAwareApiClient(clientSlug?: string) {
    const baseURL = API_CONFIG.BASE_URL;
    
    const client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add client context to requests
    client.interceptors.request.use((config) => {
      // Add client context for multi-client detection
      if (clientSlug) {
        // If clientSlug is a number (client ID), use it as client parameter
        if (/^\d+$/.test(clientSlug)) {
          // It's a client ID, add as client parameter
          if (!config.params) {
            config.params = {};
          }
          config.params.client = clientSlug;
          console.log(`🎯 Adding client ID parameter: ${clientSlug}`);
        } else {
          // It's a slug, use as Host header
          config.headers['Host'] = `${clientSlug}.localhost:5172`;
          console.log(`🌐 Setting Host header: ${clientSlug}.localhost:5172`);
        }
      }

      // Add auth token if available
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    return client;
  }

  // Register new customer with client context
  async register(data: MarketplaceRegisterData, clientSlug?: string): Promise<MarketplaceAuthResponse> {
    console.log('🔧 MarketplaceAuthAPI.register called with clientSlug:', clientSlug);
    const client = this.getClientAwareApiClient(clientSlug);
    const response = await client.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  }

  // Login customer with client context
  async login(data: MarketplaceLoginData, clientSlug?: string): Promise<MarketplaceAuthResponse> {
    const client = this.getClientAwareApiClient(clientSlug);
    const response = await client.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  }

  // Get user profile with client context
  async getProfile(clientSlug?: string): Promise<MarketplaceUserProfile> {
    const client = this.getClientAwareApiClient(clientSlug);
    const response = await client.get(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
    return response.data;
  }

  // Attach current user to a client as marketplace customer
  async attachToClient(clientId: number, details?: { first_name?: string; last_name?: string; phone?: string }): Promise<{ error: boolean; message: string }> {
    const client = this.getClientAwareApiClient();
    const response = await client.post('/api/marketplace/customers/attach-to-client', {
      client_id: clientId,
      ...details,
    });
    return response.data;
  }

  // List clients
  async listClients(): Promise<{ error: boolean; clients: Array<{ id: number; company_name: string; subdomain?: string; logo_url?: string }> }> {
    const client = this.getClientAwareApiClient();
    const response = await client.get('/api/marketplace/clients');
    return response.data;
  }

  // Store auth data in localStorage
  storeAuthData(authResponse: MarketplaceAuthResponse) {
    const token = authResponse.token || authResponse.access_token;
    if (token) {
      localStorage.setItem('auth_token', token);
    }
    if (authResponse.refresh_token) {
      localStorage.setItem('refresh_token', authResponse.refresh_token);
    }
    
    const userData = {
      user_id: authResponse.user_id,
      customer_id: authResponse.customer_id,
      client_id: authResponse.client_id,
      client_name: authResponse.client_name,
      email: authResponse.email,
      first_name: authResponse.first_name,
      last_name: authResponse.last_name,
      role: authResponse.role,
    };
    localStorage.setItem('user_data', JSON.stringify(userData));
  }

  // Clear auth data
  clearAuthData() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // Get stored user data
  getUserData() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // Get client ID from stored user data
  getClientId(): number | null {
    const userData = this.getUserData();
    return userData?.client_id || null;
  }

  // Get customer ID from stored user data
  getCustomerId(): number | null {
    const userData = this.getUserData();
    return userData?.customer_id || null;
  }
}

export default new MarketplaceAuthAPI();
