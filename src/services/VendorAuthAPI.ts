import vendorApiClient from '@/config/vendorAxios';
import API_CONFIG from '@/config/api';

export interface VendorRegisterData {
  email: string;
  password: string;
  business_name: string;
  contact_name: string;
  phone: string;
  business_address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  description?: string;
  is_refresh?: boolean;
}

export interface VendorLoginData {
  email: string;
  password: string;
  is_refresh?: boolean;
}

export interface VendorAuthResponse {
  error: boolean;
  message: string;
  role?: string;
  token?: string;
  access_token?: string;
  refresh_token?: string;
  expire_at?: number;
  user_id?: number;
  vendor_id?: number;
  client_id?: number;
  client_name?: string;
  business_name?: string;
  contact_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  is_vendor_access?: boolean;
}

export interface MarketplaceVendorAuthResponse extends VendorAuthResponse {
  access_token: string;
  client_id: number;
  client_name: string;
  first_name: string;
  last_name: string;
  is_vendor_access: boolean;
}

export interface VendorProfile {
  error: boolean;
  vendor?: {
    id: number;
    user_id: number;
    email: string;
    role: string;
    status: number;
    business_name: string;
    contact_name: string;
    phone: string;
    business_address: string;
    city: string;
    province: string;
    postal_code: string;
    business_license: string;
    insurance_info: string;
    description: string;
    logo_image: string;
    cover_image: string;
    website_url: string;
    service_areas: string[];
    rating: number;
    total_reviews: number;
    completed_orders: number;
    verified: boolean;
    vendor_status: number;
    created_at: string;
  };
  message?: string;
}

export interface UpdateVendorProfileData {
  business_name?: string;
  contact_name?: string;
  phone?: string;
  business_address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  business_license?: string;
  insurance_info?: string;
  description?: string;
  logo_image?: string;
  cover_image?: string;
  website_url?: string;
  service_areas?: string[];
}

class VendorAuthAPI {
  // Register new vendor
  async register(data: VendorRegisterData): Promise<VendorAuthResponse> {
    const response = await vendorApiClient.post(API_CONFIG.ENDPOINTS.VENDOR_AUTH.REGISTER, data);
    return response.data;
  }

  // Login vendor
  async login(data: VendorLoginData): Promise<VendorAuthResponse> {
    const response = await vendorApiClient.post(API_CONFIG.ENDPOINTS.VENDOR_AUTH.LOGIN, data);
    return response.data;
  }

  // Get vendor profile
  async getProfile(): Promise<VendorProfile> {
    const response = await vendorApiClient.get(API_CONFIG.ENDPOINTS.VENDOR_AUTH.PROFILE);
    return response.data;
  }

  // Update vendor profile
  async updateProfile(data: UpdateVendorProfileData): Promise<{ error: boolean; message: string }> {
    const response = await vendorApiClient.put(API_CONFIG.ENDPOINTS.VENDOR_AUTH.PROFILE, data);
    return response.data;
  }

  // Get marketplace access for vendor
  async getMarketplaceAccess(): Promise<MarketplaceVendorAuthResponse> {
    const response = await vendorApiClient.post('/api/marketplace/vendor/auth/marketplace-login');
    return response.data;
  }

  // Store authentication data in localStorage with vendor-specific keys
  storeAuthData(authResponse: VendorAuthResponse): void {
    if (authResponse.token) {
      localStorage.setItem('vendor_auth_token', authResponse.token);
    }
    if (authResponse.refresh_token) {
      localStorage.setItem('vendor_refresh_token', authResponse.refresh_token);
    }
    if (authResponse.user_id) {
      localStorage.setItem('vendor_user_id', authResponse.user_id.toString());
    }
    if (authResponse.vendor_id) {
      localStorage.setItem('vendor_id', authResponse.vendor_id.toString());
    }
    if (authResponse.role) {
      localStorage.setItem('vendor_role', authResponse.role);
    }
    if (authResponse.business_name) {
      localStorage.setItem('vendor_business_name', authResponse.business_name);
    }
    if (authResponse.email) {
      localStorage.setItem('vendor_email', authResponse.email);
    }
  }

  // Clear authentication data
  clearAuthData(): void {
    localStorage.removeItem('vendor_auth_token');
    localStorage.removeItem('vendor_refresh_token');
    localStorage.removeItem('vendor_user_id');
    localStorage.removeItem('vendor_id');
    localStorage.removeItem('vendor_role');
    localStorage.removeItem('vendor_business_name');
    localStorage.removeItem('vendor_email');
  }

  // Check if vendor is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('vendor_auth_token');
    const role = localStorage.getItem('vendor_role');
    return !!(token && role === 'vendor');
  }

  // Get stored vendor data
  getStoredVendorData(): {
    token: string | null;
    user_id: string | null;
    vendor_id: string | null;
    business_name: string | null;
    email: string | null;
  } {
    return {
      token: localStorage.getItem('vendor_auth_token'),
      user_id: localStorage.getItem('vendor_user_id'),
      vendor_id: localStorage.getItem('vendor_id'),
      business_name: localStorage.getItem('vendor_business_name'),
      email: localStorage.getItem('vendor_email'),
    };
  }

  // Logout vendor
  logout(): void {
    this.clearAuthData();
    // Redirect to vendor login page
    window.location.href = '/vendor/login';
  }

  async forgotPassword(email: string): Promise<any> {
    const response = await vendorApiClient.post('/api/marketplace/vendor/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(email: string, code: string, password: string): Promise<any> {
    const response = await vendorApiClient.post('/api/marketplace/vendor/auth/reset-password', { email, code, password });
    return response.data;
  }
}

export default new VendorAuthAPI();
