import apiClient from '@/config/axios';
import API_CONFIG from '@/config/api';

export interface CreateServiceRequestData {
  service_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_address: string;
  service_city: string;
  service_postal_code: string;
  preferred_date?: string;
  preferred_time?: string;
  urgency?: number;
  description: string;
  selected_tier?: string;
  estimated_price?: number;
  attachments?: string[];
}

export interface ServiceRequest {
  id: number;
  request_number: string;
  service_title: string;
  service_price: number;
  vendor_name: string;
  vendor_image: string;
  vendor_phone: string;
  status: number;
  urgency: number;
  preferred_date: string;
  preferred_time: string;
  description: string;
  vendor_response: string;
  vendor_quote: number;
  scheduled_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceRequestResponse {
  error: boolean;
  message: string;
  request: {
    id: number;
    request_number: string;
    status: string;
  };
}

export interface ServiceRequestsResponse {
  error: boolean;
  requests: ServiceRequest[];
}

export interface ServiceRequestDetailsResponse {
  error: boolean;
  request: ServiceRequest & {
    service_details: {
      title: string;
      description: string;
      images: string[];
    };
    vendor_details: {
      name: string;
      contact: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      province: string;
      rating: number;
      verified: boolean;
    };
    timeline: Array<{
      status: string;
      date: string;
      description: string;
    }>;
  };
}

class ServiceRequestsAPI {
  // Create a new service request
  async createServiceRequest(data: CreateServiceRequestData): Promise<CreateServiceRequestResponse> {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.SERVICE_REQUESTS.CREATE, data);
    return response.data;
  }

  // Get all service requests for the authenticated customer
  async getServiceRequests(): Promise<ServiceRequestsResponse> {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.SERVICE_REQUESTS.LIST);
    return response.data;
  }

  // Get service request details by ID
  async getServiceRequestDetails(requestId: string | number): Promise<ServiceRequestDetailsResponse> {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.SERVICE_REQUESTS.DETAILS}/${requestId}`
    );
    return response.data;
  }

  // Get status text for display
  getStatusText(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'Pending',
      1: 'Accepted',
      2: 'In Progress',
      3: 'Completed',
      4: 'Cancelled',
      5: 'Rejected',
    };
    return statusMap[status] || 'Unknown';
  }

  // Get urgency text for display
  getUrgencyText(urgency: number): string {
    const urgencyMap: { [key: number]: string } = {
      1: 'Urgent',
      2: 'High',
      3: 'Normal',
      4: 'Low',
    };
    return urgencyMap[urgency] || 'Normal';
  }

  // Get status color for UI
  getStatusColor(status: number): string {
    const colorMap: { [key: number]: string } = {
      0: 'yellow',
      1: 'blue',
      2: 'orange',
      3: 'green',
      4: 'red',
      5: 'red',
    };
    return colorMap[status] || 'gray';
  }
}

export default new ServiceRequestsAPI();
