import adminApiClient from '@/config/adminAxios';
import API_CONFIG from '@/config/api';

export interface AdminLoginData {
  email: string;
  password: string;
  is_refresh?: boolean;
}

export interface AdminAuthResponse {
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

export interface AdminProfile {
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

export interface AdminDashboardStats {
  error: boolean;
  stats: {
    total_clients: number;
    total_vendors: number;
    total_customers: number;
    total_transactions: number;
    total_platform_revenue: string;
    month_revenue: string;
    active_clients: number;
    active_vendors: number;
    pending_vendors: number;
    pending_clients: number;
    pending_orders: number;
  };
}

export interface AdminRevenueAnalytics {
  error: boolean;
  revenue_data: Array<{
    month: string;
    total_revenue: string;
    platform_revenue: string;
    transactions: number;
  }>;
}

export interface AdminClient {
  id: number;
  email: string;
  company_name: string;
  status: number;
  total_vendors: number;
  total_revenue: number;
  created_at: string;
}

export interface AdminVendor {
  id: number;
  name: string;
  business_name: string;
  email: string;
  phone?: string;
  location?: string;
  status: string;
  services?: string;
  total_services: number;
  rating: number;
  total_reviews?: number;
  totalJobs: number;
  revenue: string;
  joinDate: string;
  lastActive: string;
  verified?: boolean;
  client_id?: number;
  client_name: string;
  client_email?: string;
  client_marketplace: string;
  client: string;
}

export interface AdminCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  status: number;
  total_orders: number;
  total_spent: number;
  created_at: string;
}

export interface AdminTransaction {
  id: string;
  vendor: string;
  customer: string;
  service: string;
  amount: string;
  date: string;
  status: string;
  paymentMethod: string;
  vendor_id?: number;
  customer_id?: number;
  service_id?: number;
  payment_status?: number;
  created_at?: string;
}

interface Transaction {
  id: string;
  vendor: string;
  customer: string;
  service: string;
  amount: string;
  date: string;
  status: string;
  paymentMethod: string;
  vendor_id?: number;
  customer_id?: number;
  service_id?: number;
  payment_status?: number;
  commission_amount?: string;
  created_at?: string;
  updated_at?: string;
}

interface VendorApproval {
  id: string;
  name: string;
  email: string;
  business_name: string;
  phone: string;
  location: string;
  services: string;
  status: string;
  application_date: string;
  documents?: string[];
  verification_status?: string;
  rejection_reason?: string;
  approved_by?: string;
  approved_at?: string;
}

interface RevenueRule {
  id: string;
  service_category: string;
  platform_commission: number;
  client_commission: number;
  vendor_commission: number;
  is_default?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminVendorApproval {
  id: number;
  vendor_id: number;
  vendor_name: string;
  business_name: string;
  status: string;
  submitted_at: string;
  documents: Array<{
    type: string;
    url: string;
  }>;
}

export interface AdminRevenueRule {
  id: number;
  service_category: string;
  platform_share: number;
  default_client_share: number;
  default_vendor_share: number;
  created_at: string;
}

class AdminAPI {
  // Authentication Methods
  async login(data: AdminLoginData): Promise<AdminAuthResponse> {
    const response = await adminApiClient.post(API_CONFIG.ENDPOINTS.ADMIN_AUTH.LOGIN, data);
    return response.data;
  }

  // Admin Login as Client
  async loginAsClient(clientId: number): Promise<{
    error: boolean;
    message: string;
    token?: string;
    refresh_token?: string;
    client_id?: number;
    user?: {
      id: number;
      email: string;
      company_name: string;
      contact_name: string;
      role: string;
    };
  }> {
    const response = await adminApiClient.post(API_CONFIG.ENDPOINTS.ADMIN_AUTH.LOGIN_AS_CLIENT, {
      client_id: clientId
    });
    return response.data;
  }

  // Return from client impersonation
  async returnFromImpersonation(): Promise<AdminAuthResponse> {
    const response = await adminApiClient.post(API_CONFIG.ENDPOINTS.ADMIN_AUTH.RETURN_FROM_IMPERSONATION);
    return response.data;
  }

  // Profile Methods
  async getProfile(): Promise<AdminProfile> {
    const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_AUTH.PROFILE);
    return response.data;
  }

  async updateProfile(data: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    photo?: string;
  }): Promise<AdminProfile> {
    const response = await adminApiClient.put(API_CONFIG.ENDPOINTS.ADMIN_AUTH.PROFILE, data);
    return response.data;
  }

  // Dashboard Methods
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_DASHBOARD.STATS);
    return response.data;
  }

  async getRevenueAnalytics(): Promise<AdminRevenueAnalytics> {
    const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_DASHBOARD.REVENUE_ANALYTICS);
    return response.data;
  }

  // Client Management Methods
  async getAllClients(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: number;
  }): Promise<{
    error: boolean;
    clients: AdminClient[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_count: number;
      per_page: number;
    };
  }> {
    const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_CLIENTS.LIST, { params });
    return response.data;
  }

  async updateClientStatus(clientId: number, status: number): Promise<{
    error: boolean;
    message: string;
  }> {
    const response = await adminApiClient.put(`${API_CONFIG.ENDPOINTS.ADMIN_CLIENTS.UPDATE_STATUS}/${clientId}/status`, { status });
    return response.data;
  }

  async suspendClient(clientId: number, reason?: string): Promise<{
    error: boolean;
    message: string;
  }> {
    const response = await adminApiClient.put(`${API_CONFIG.ENDPOINTS.ADMIN_CLIENTS.SUSPEND}/${clientId}/suspend`, { reason });
    return response.data;
  }

  async unsuspendClient(clientId: number): Promise<{
    error: boolean;
    message: string;
  }> {
    const response = await adminApiClient.put(`${API_CONFIG.ENDPOINTS.ADMIN_CLIENTS.UNSUSPEND}/${clientId}/unsuspend`);
    return response.data;
  }

  async terminateClient(clientId: number, reason?: string): Promise<{
    error: boolean;
    message: string;
  }> {
    const response = await adminApiClient.put(`${API_CONFIG.ENDPOINTS.ADMIN_CLIENTS.TERMINATE}/${clientId}/terminate`, { reason });
    return response.data;
  }

  // Vendor Management Methods
  async getAllVendors(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: number;
  }): Promise<{
    error: boolean;
    vendors: AdminVendor[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_count: number;
      per_page: number;
    };
  }> {
    const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_VENDORS.LIST, { params });
    return response.data;
  }

  // Customer Management Methods
  async getAllCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: number;
  }): Promise<{
    error: boolean;
    customers: AdminCustomer[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_count: number;
      per_page: number;
    };
  }> {
    const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_CUSTOMERS.LIST, { params });
    return response.data;
  }

  // Transaction Management Methods
  async getAllTransactions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    vendor?: string;
    date_range?: string;
    amount_range?: string;
    payment_method?: string;
  }): Promise<{
    error: boolean;
    transactions: AdminTransaction[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_count: number;
      per_page: number;
    };
  }> {
    const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_TRANSACTIONS.LIST, { params });
    return response.data;
  }

  // Vendor Approval Methods
  async getVendorApprovals(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{
    error: boolean;
    approvals: AdminVendorApproval[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_count: number;
      per_page: number;
    };
  }> {
    const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_VENDOR_APPROVALS.LIST, { params });
    return response.data;
  }

  async updateVendorApprovalStatus(approvalId: number, status: string, notes?: string): Promise<{
    error: boolean;
    message: string;
  }> {
    const response = await adminApiClient.put(`${API_CONFIG.ENDPOINTS.ADMIN_VENDOR_APPROVALS.UPDATE_STATUS}/${approvalId}/status`, {
      status,
      notes
    });
    return response.data;
  }

  // Revenue Rule Methods
  async getRevenueRules(): Promise<{
    error: boolean;
    rules: AdminRevenueRule[];
  }> {
    const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_REVENUE.RULES);
    return response.data;
  }

  async createRevenueRule(data: {
    service_category: string;
    platform_share: number;
    default_client_share: number;
    default_vendor_share: number;
  }): Promise<{
    error: boolean;
    message: string;
    rule?: AdminRevenueRule;
  }> {
    const response = await adminApiClient.post(API_CONFIG.ENDPOINTS.ADMIN_REVENUE.RULES, data);
    return response.data;
  }

  async addManualCommission(data: {
    vendor_id?: number;
    client_id?: number;
    amount: number;
    description: string;
    type: string;
  }): Promise<{
    error: boolean;
    message: string;
  }> {
    const response = await adminApiClient.post(API_CONFIG.ENDPOINTS.ADMIN_REVENUE.MANUAL_COMMISSION, data);
    return response.data;
  }

  // Reports Methods
  async getPerformanceReport(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<{
    error: boolean;
    report: {
      total_revenue: number;
      total_transactions: number;
      average_transaction_value: number;
      growth_metrics: {
        revenue_growth: number;
        user_growth: number;
        transaction_growth: number;
      };
      top_performers: {
        vendors: Array<{ name: string; revenue: number; }>;
        clients: Array<{ name: string; revenue: number; }>;
        services: Array<{ title: string; orders: number; }>;
      };
    };
  }> {
    const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_REPORTS.PERFORMANCE, { params });
    return response.data;
  }

  async exportData(params: {
    type: string;
    start_date?: string;
    end_date?: string;
  }): Promise<{
    error: boolean;
    download_url?: string;
    message: string;
  }> {
    const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_REPORTS.EXPORT, { params });
    return response.data;
  }

  // Store auth data in localStorage
  storeAuthData(authResponse: AdminAuthResponse) {
    if (authResponse.token) {
      localStorage.setItem('admin_auth_token', authResponse.token);
    }
    if (authResponse.refresh_token) {
      localStorage.setItem('admin_refresh_token', authResponse.refresh_token);
    }
    
    const userData = {
      user_id: authResponse.user_id,
      email: authResponse.email,
      first_name: authResponse.first_name,
      last_name: authResponse.last_name,
      role: authResponse.role,
    };
    localStorage.setItem('admin_user_data', JSON.stringify(userData));
  }

  // Clear auth data
  clearAuthData() {
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user_data');
  }

  // Check if admin is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('admin_auth_token');
  }

  // Get stored admin data
  getUserData() {
    const userData = localStorage.getItem('admin_user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // Transaction Management Methods
  async getAllTransactions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    vendor?: string;
    date_range?: string;
    amount_range?: string;
    payment_method?: string;
  }): Promise<{
    error: boolean;
    message?: string;
    transactions?: Transaction[];
    pagination?: PaginationInfo;
  }> {
    const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_TRANSACTIONS.LIST, { params });
    return response.data;
  }

  async getTransactionDetails(transactionId: string): Promise<{
    error: boolean;
    message?: string;
    transaction?: Transaction;
  }> {
    const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_TRANSACTIONS.DETAILS.replace(':id', transactionId));
    return response.data;
  }

  async updateTransactionStatus(transactionId: string, status: string): Promise<ApiResponse> {
    const response = await adminApiClient.put(API_CONFIG.ENDPOINTS.ADMIN_TRANSACTIONS.UPDATE_STATUS.replace(':id', transactionId), { status });
    return response.data;
  }

  async exportTransactions(params?: {
    search?: string;
    status?: string;
    vendor?: string;
    date_range?: string;
    amount_range?: string;
    payment_method?: string;
  }): Promise<{
    error: boolean;
    message?: string;
    download_url?: string;
  }> {
    const response = await adminApiClient.post(API_CONFIG.ENDPOINTS.ADMIN_TRANSACTIONS.EXPORT, params);
    return response.data;
  }

  // Vendor Approval Management Methods
  async getVendorApprovals(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    location?: string;
  }): Promise<{
    error: boolean;
    message?: string;
    vendor_approvals?: VendorApproval[];
    pagination?: PaginationInfo;
  }> {
    const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_VENDOR_APPROVALS.LIST, { params });
    return response.data;
  }

  async approveVendor(vendorId: string): Promise<ApiResponse> {
    const response = await adminApiClient.put(API_CONFIG.ENDPOINTS.ADMIN_VENDOR_APPROVALS.APPROVE.replace(':id', vendorId));
    return response.data;
  }

  async rejectVendor(vendorId: string, reason?: string): Promise<ApiResponse> {
    const response = await adminApiClient.put(API_CONFIG.ENDPOINTS.ADMIN_VENDOR_APPROVALS.REJECT.replace(':id', vendorId), { reason });
    return response.data;
  }

  async getVendorApprovalDetails(vendorId: string): Promise<{
    error: boolean;
    message?: string;
    vendor?: VendorApproval;
  }> {
    const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_VENDOR_APPROVALS.DETAILS.replace(':id', vendorId));
    return response.data;
  }

  // Revenue Rules Management Methods
  async getRevenueRules(): Promise<{
    error: boolean;
    message?: string;
    rules?: RevenueRule[];
  }> {
    const response = await adminApiClient.get(API_CONFIG.ENDPOINTS.ADMIN_REVENUE_RULES.LIST);
    return response.data;
  }

  async createRevenueRule(ruleData: {
    service_category: string;
    platform_commission: number;
    client_commission: number;
    vendor_commission: number;
  }): Promise<ApiResponse> {
    const response = await adminApiClient.post(API_CONFIG.ENDPOINTS.ADMIN_REVENUE_RULES.CREATE, ruleData);
    return response.data;
  }

  async updateRevenueRule(ruleId: string, ruleData: {
    service_category?: string;
    platform_commission?: number;
    client_commission?: number;
    vendor_commission?: number;
  }): Promise<ApiResponse> {
    const response = await adminApiClient.put(API_CONFIG.ENDPOINTS.ADMIN_REVENUE_RULES.UPDATE.replace(':id', ruleId), ruleData);
    return response.data;
  }

  async deleteRevenueRule(ruleId: string): Promise<ApiResponse> {
    const response = await adminApiClient.delete(API_CONFIG.ENDPOINTS.ADMIN_REVENUE_RULES.DELETE.replace(':id', ruleId));
    return response.data;
  }

  async updateDefaultRevenueRules(defaultRules: {
    platform_commission: number;
    client_commission?: number;
  }): Promise<ApiResponse> {
    const response = await adminApiClient.put(API_CONFIG.ENDPOINTS.ADMIN_REVENUE_RULES.UPDATE_DEFAULT, defaultRules);
    return response.data;
  }

  // New method for 4-way commission structure
  async createPlatformRevenueRule(ruleData: {
    platform_share: number;
    client_share: number;
    vendor_a_share: number;
    vendor_b_share: number;
    vendor_b_share_no_referrer: number;
  }): Promise<ApiResponse> {
    const response = await adminApiClient.post(API_CONFIG.ENDPOINTS.ADMIN_REVENUE.RULES, ruleData);
    return response.data;
  }
}

export default new AdminAPI();
