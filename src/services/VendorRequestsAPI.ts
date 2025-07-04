import apiClient from '@/config/axios';
import API_CONFIG from '@/config/api';

export interface VendorRequest {
  id: number;
  request_number: string;
  user_id: number;
  service_id: number;
  vendor_id: number;
  description: string;
  preferred_date: string;
  budget_range: string;
  location: string;
  urgency: string;
  status: number;
  vendor_quote: number;
  quote_description: string;
  quote_expires_at: string;
  customer_response: string;
  created_at: string;
  updated_at: string;
  // Customer details
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  // Service details
  service_title: string;
  service_category: string;
}

export interface RequestFilters {
  page?: number;
  limit?: number;
  status?: number;
  urgency?: string;
  date_from?: string;
  date_to?: string;
}

export interface VendorRequestsResponse {
  error: boolean;
  requests: VendorRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface RequestDetailsResponse {
  error: boolean;
  request?: VendorRequest;
  message?: string;
}

export interface SendQuoteData {
  vendor_quote: number;
  quote_description: string;
  quote_expires_at?: string;
  estimated_completion_time?: string;
  terms_conditions?: string;
}

export interface QuoteResponse {
  error: boolean;
  message: string;
  quote_id?: number;
}

export interface UpdateRequestStatusData {
  status: number;
  notes?: string;
}

class VendorRequestsAPI {
  // Get vendor requests
  async getRequests(filters: RequestFilters = {}): Promise<VendorRequestsResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_REQUESTS.LIST}?${params.toString()}`
    );
    return response.data;
  }

  // Get request details
  async getRequestDetails(requestId: number): Promise<RequestDetailsResponse> {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_REQUESTS.DETAILS}/${requestId}`
    );
    return response.data;
  }

  // Send quote for request
  async sendQuote(requestId: number, data: SendQuoteData): Promise<QuoteResponse> {
    const response = await apiClient.post(
      `${API_CONFIG.ENDPOINTS.VENDOR_REQUESTS.QUOTE}/${requestId}/quote`,
      data
    );
    return response.data;
  }

  // Update quote
  async updateQuote(requestId: number, data: SendQuoteData): Promise<QuoteResponse> {
    const response = await apiClient.put(
      `${API_CONFIG.ENDPOINTS.VENDOR_REQUESTS.QUOTE}/${requestId}/quote`,
      data
    );
    return response.data;
  }

  // Accept request (start work)
  async acceptRequest(requestId: number): Promise<{ error: boolean; message: string }> {
    const response = await apiClient.post(
      `${API_CONFIG.ENDPOINTS.VENDOR_REQUESTS.DETAILS}/${requestId}/accept`
    );
    return response.data;
  }

  // Decline request
  async declineRequest(requestId: number, reason?: string): Promise<{ error: boolean; message: string }> {
    const response = await apiClient.post(
      `${API_CONFIG.ENDPOINTS.VENDOR_REQUESTS.DETAILS}/${requestId}/decline`,
      { reason }
    );
    return response.data;
  }

  // Complete request
  async completeRequest(requestId: number, notes?: string): Promise<{ error: boolean; message: string }> {
    const response = await apiClient.post(
      `${API_CONFIG.ENDPOINTS.VENDOR_REQUESTS.DETAILS}/${requestId}/complete`,
      { notes }
    );
    return response.data;
  }

  // Update request status
  async updateRequestStatus(requestId: number, data: UpdateRequestStatusData): Promise<{ error: boolean; message: string }> {
    const response = await apiClient.put(
      `${API_CONFIG.ENDPOINTS.VENDOR_REQUESTS.DETAILS}/${requestId}/status`,
      data
    );
    return response.data;
  }

  // Get request statistics
  async getRequestStats(): Promise<{
    error: boolean;
    stats: {
      total_requests: number;
      pending_requests: number;
      active_requests: number;
      completed_requests: number;
      declined_requests: number;
      total_revenue: number;
      average_quote: number;
      response_rate: number;
    };
  }> {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_REQUESTS.LIST}/stats`
    );
    return response.data;
  }

  // Get request timeline/history
  async getRequestTimeline(requestId: number): Promise<{
    error: boolean;
    timeline: Array<{
      id: number;
      action: string;
      description: string;
      created_at: string;
      created_by: string;
    }>;
  }> {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_REQUESTS.DETAILS}/${requestId}/timeline`
    );
    return response.data;
  }

  // Search requests
  async searchRequests(query: string, filters: RequestFilters = {}): Promise<VendorRequestsResponse> {
    const params = new URLSearchParams();
    params.append('search', query);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_REQUESTS.LIST}/search?${params.toString()}`
    );
    return response.data;
  }

  // Export requests to CSV
  async exportRequests(filters: RequestFilters = {}): Promise<Blob> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.VENDOR_REQUESTS.LIST}/export?${params.toString()}`,
      { responseType: 'blob' }
    );
    return response.data;
  }
}

export default new VendorRequestsAPI();
