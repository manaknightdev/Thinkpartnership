import vendorApiClient from '@/config/vendorAxios';
import API_CONFIG from '@/config/api';

export interface Invitation {
  id: number;
  inviter_id: number;
  invitee_email: string;
  invitee_name?: string;
  invitation_type: 'customer' | 'vendor';
  status: 'pending' | 'accepted' | 'expired' | 'declined';
  invite_code: string;
  message?: string;
  expires_at: string;
  sent_at: string;
  accepted_at?: string;
  reminder_count: number;
  last_reminder_sent?: string;
}

export interface InviteStats {
  total_sent: number;
  total_accepted: number;
  total_pending: number;
  total_expired: number;
  acceptance_rate: number;
  this_month_sent: number;
  this_month_accepted: number;
}

export interface InviteTemplate {
  id: number;
  name: string;
  subject: string;
  message: string;
  invitation_type: 'customer' | 'vendor';
  is_default: boolean;
  created_at: string;
}

export interface BulkInviteData {
  emails: string[];
  invitation_type: 'customer' | 'vendor';
  template_id?: number;
  custom_message?: string;
  expires_in_days?: number;
}

export interface SendInviteData {
  email: string;
  name?: string;
  invitation_type: 'customer' | 'vendor';
  message?: string;
  expires_in_days?: number;
}

export interface CreateTemplateData {
  name: string;
  subject: string;
  message: string;
  invitation_type: 'customer' | 'vendor';
  is_default?: boolean;
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

class VendorInviteAPI {
  // Get invitation statistics
  static async getInviteStats(): Promise<APIResponse<InviteStats>> {
    try {
      const response = await vendorApiClient.get(API_CONFIG.ENDPOINTS.VENDOR_INVITES.STATS);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch invite stats'
      };
    }
  }

  // Get invitations list
  static async getInvitations(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<APIResponse<{ invitations: Invitation[] }>> {
    try {
      const response = await vendorApiClient.get(API_CONFIG.ENDPOINTS.VENDOR_INVITES.LIST, { params: filters });
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch invitations'
      };
    }
  }

  // Send single invitation
  static async sendInvitation(data: SendInviteData): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.post(API_CONFIG.ENDPOINTS.VENDOR_INVITES.SEND, data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to send invitation'
      };
    }
  }

  // Send bulk invitations
  static async sendBulkInvitations(data: BulkInviteData): Promise<APIResponse<{
    sent: number;
    failed: number;
    errors: string[];
  }>> {
    try {
      const response = await vendorApiClient.post(API_CONFIG.ENDPOINTS.VENDOR_INVITES.BULK_SEND, data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to send bulk invitations'
      };
    }
  }

  // Resend invitation
  static async resendInvitation(invitationId: number): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.post(`${API_CONFIG.ENDPOINTS.VENDOR_INVITES.LIST}/${invitationId}/resend`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to resend invitation'
      };
    }
  }

  // Cancel invitation
  static async cancelInvitation(invitationId: number): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.delete(`${API_CONFIG.ENDPOINTS.VENDOR_INVITES.LIST}/${invitationId}`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to cancel invitation'
      };
    }
  }

  // Get invitation templates
  static async getInviteTemplates(): Promise<APIResponse<{ templates: InviteTemplate[] }>> {
    try {
      const response = await vendorApiClient.get(API_CONFIG.ENDPOINTS.VENDOR_INVITES.TEMPLATES);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch invite templates'
      };
    }
  }

  // Create invitation template
  static async createInviteTemplate(data: CreateTemplateData): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.post(API_CONFIG.ENDPOINTS.VENDOR_INVITES.TEMPLATES, data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to create invite template'
      };
    }
  }

  // Update invitation template
  static async updateInviteTemplate(templateId: number, data: Partial<CreateTemplateData>): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.put(`${API_CONFIG.ENDPOINTS.VENDOR_INVITES.TEMPLATES}/${templateId}`, data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to update invite template'
      };
    }
  }

  // Delete invitation template
  static async deleteInviteTemplate(templateId: number): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.delete(`${API_CONFIG.ENDPOINTS.VENDOR_INVITES.TEMPLATES}/${templateId}`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to delete invite template'
      };
    }
  }

  // Get invitation analytics
  static async getInviteAnalytics(filters?: {
    period?: 'week' | 'month' | 'quarter' | 'year';
    date_from?: string;
    date_to?: string;
  }): Promise<APIResponse<{
    chart_data: Array<{
      date: string;
      sent: number;
      accepted: number;
    }>;
    top_performing_templates: Array<{
      template_name: string;
      sent: number;
      accepted: number;
      acceptance_rate: number;
    }>;
  }>> {
    try {
      const response = await vendorApiClient.get(API_CONFIG.ENDPOINTS.VENDOR_INVITES.ANALYTICS, { params: filters });
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch invite analytics'
      };
    }
  }

  // Import contacts from CSV
  static async importContacts(file: File): Promise<APIResponse<{
    imported: number;
    failed: number;
    errors: string[];
  }>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await vendorApiClient.post('/vendor/invites/import-contacts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to import contacts'
      };
    }
  }
}

export default VendorInviteAPI;
