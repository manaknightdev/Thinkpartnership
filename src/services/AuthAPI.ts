import apiClient from '@/config/axios';
import API_CONFIG from '@/config/api';

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_refresh?: boolean;
  referral_code?: string;
  vendor_id?: string;
}

export interface LoginData {
  email: string;
  password: string;
  is_refresh?: boolean;
}

export interface AuthResponse {
  error: boolean;
  message: string;
  role?: string;
  token?: string;
  refresh_token?: string;
  expire_at?: number;
  user_id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface UserProfile {
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
  };
}

class AuthAPI {
  // Notify app of auth state changes within the same tab
  private emitAuthChanged(isAuthenticated: boolean) {
    try {
      window.dispatchEvent(
        new CustomEvent('auth:changed', { detail: { isAuthenticated } })
      );
    } catch (e) {
      // noop: window might not exist in some environments
    }
  }

  // Register new customer
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  }

  // Login customer
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  }

  // Get user profile
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
    return response.data;
  }

  // Store auth data in localStorage
  storeAuthData(authResponse: AuthResponse) {
    if (authResponse.token) {
      localStorage.setItem('auth_token', authResponse.token);
    }
    if (authResponse.refresh_token) {
      localStorage.setItem('refresh_token', authResponse.refresh_token);
    }
    
    const userData = {
      user_id: authResponse.user_id,
      email: authResponse.email,
      first_name: authResponse.first_name,
      last_name: authResponse.last_name,
      role: authResponse.role,
    };
    localStorage.setItem('user_data', JSON.stringify(userData));

    // Emit in-tab auth change event so dependent contexts (e.g., cart) can refresh immediately
    this.emitAuthChanged(true);
  }

  // Clear auth data
  clearAuthData() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');

    // Emit in-tab auth change event
    this.emitAuthChanged(false);
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
}

export default new AuthAPI();
