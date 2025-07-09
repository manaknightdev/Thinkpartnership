import vendorApiClient from '@/config/vendorAxios';

export interface Notification {
  id: number;
  vendor_id: number;
  type: 'new_request' | 'payment_received' | 'review_received' | 'message_received' | 'system_update' | 'referral_signup' | 'service_approved' | 'service_rejected';
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action_url?: string;
  action_text?: string;
  created_at: string;
  read_at?: string;
}

export interface NotificationSettings {
  email_new_requests: boolean;
  email_payments: boolean;
  email_reviews: boolean;
  email_messages: boolean;
  email_system_updates: boolean;
  email_referrals: boolean;
  push_new_requests: boolean;
  push_payments: boolean;
  push_reviews: boolean;
  push_messages: boolean;
  push_system_updates: boolean;
  push_referrals: boolean;
  sms_urgent_only: boolean;
  sms_payments: boolean;
  digest_frequency: 'immediate' | 'hourly' | 'daily' | 'weekly' | 'never';
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  timezone: string;
}

export interface NotificationStats {
  total_notifications: number;
  unread_count: number;
  today_count: number;
  this_week_count: number;
  high_priority_count: number;
  urgent_count: number;
}

export interface NotificationTemplate {
  id: number;
  type: string;
  name: string;
  subject: string;
  email_template: string;
  push_template: string;
  sms_template?: string;
  is_active: boolean;
  variables: string[];
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

class VendorNotificationsAPI {
  // Get notifications list
  static async getNotifications(filters?: {
    page?: number;
    limit?: number;
    type?: string;
    is_read?: boolean;
    priority?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<APIResponse<{ notifications: Notification[] }>> {
    try {
      const response = await vendorApiClient.get('/vendor/notifications', { params: filters });
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch notifications'
      };
    }
  }

  // Get notification statistics
  static async getNotificationStats(): Promise<APIResponse<NotificationStats>> {
    try {
      const response = await vendorApiClient.get('/vendor/notifications/stats');
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch notification stats'
      };
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: number): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.put(`/vendor/notifications/${notificationId}/read`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to mark notification as read'
      };
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.put('/vendor/notifications/mark-all-read');
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to mark all notifications as read'
      };
    }
  }

  // Delete notification
  static async deleteNotification(notificationId: number): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.delete(`/vendor/notifications/${notificationId}`);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to delete notification'
      };
    }
  }

  // Delete all notifications
  static async deleteAllNotifications(): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.delete('/vendor/notifications/delete-all');
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to delete all notifications'
      };
    }
  }

  // Get notification settings
  static async getNotificationSettings(): Promise<APIResponse<NotificationSettings>> {
    try {
      const response = await vendorApiClient.get('/vendor/notifications/settings');
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch notification settings'
      };
    }
  }

  // Update notification settings
  static async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.put('/vendor/notifications/settings', settings);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to update notification settings'
      };
    }
  }

  // Test notification
  static async testNotification(type: string, channel: 'email' | 'push' | 'sms'): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.post('/vendor/notifications/test', { type, channel });
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to send test notification'
      };
    }
  }

  // Get notification templates
  static async getNotificationTemplates(): Promise<APIResponse<{ templates: NotificationTemplate[] }>> {
    try {
      const response = await vendorApiClient.get('/vendor/notifications/templates');
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch notification templates'
      };
    }
  }

  // Update notification template
  static async updateNotificationTemplate(templateId: number, data: Partial<NotificationTemplate>): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.put(`/vendor/notifications/templates/${templateId}`, data);
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to update notification template'
      };
    }
  }

  // Subscribe to push notifications
  static async subscribeToPush(subscription: any): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.post('/vendor/notifications/push-subscribe', { subscription });
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to subscribe to push notifications'
      };
    }
  }

  // Unsubscribe from push notifications
  static async unsubscribeFromPush(): Promise<APIResponse> {
    try {
      const response = await vendorApiClient.post('/vendor/notifications/push-unsubscribe');
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to unsubscribe from push notifications'
      };
    }
  }

  // Get notification analytics
  static async getNotificationAnalytics(filters?: {
    period?: 'week' | 'month' | 'quarter' | 'year';
    date_from?: string;
    date_to?: string;
  }): Promise<APIResponse<{
    chart_data: Array<{
      date: string;
      sent: number;
      opened: number;
      clicked: number;
    }>;
    engagement_stats: {
      open_rate: number;
      click_rate: number;
      most_engaged_type: string;
    };
  }>> {
    try {
      const response = await vendorApiClient.get('/vendor/notifications/analytics', { params: filters });
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to fetch notification analytics'
      };
    }
  }
}

export default VendorNotificationsAPI;
