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

// Settings removed from scope

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
      const response = await vendorApiClient.get('/api/marketplace/vendor/notifications', { params: filters });
      const { error, message, notifications, pagination } = response.data || {};
      if (error) {
        return { error: true, message: message || 'Failed to fetch notifications' };
      }
      return {
        error: false,
        message: 'OK',
        data: { notifications: notifications || [] },
        pagination
      };
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
      const response = await vendorApiClient.get('/api/marketplace/vendor/notifications/stats');
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
      const response = await vendorApiClient.put(`/api/marketplace/vendor/notifications/${notificationId}/read`);
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
      const response = await vendorApiClient.put('/api/marketplace/vendor/notifications/mark-all-read');
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
      const response = await vendorApiClient.delete(`/api/marketplace/vendor/notifications/${notificationId}`);
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
      const response = await vendorApiClient.delete('/api/marketplace/vendor/notifications/delete-all');
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to delete all notifications'
      };
    }
  }

  // Settings/test APIs removed

  // Templates/push APIs removed

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
      const response = await vendorApiClient.get('/api/marketplace/vendor/notifications/analytics', { params: filters });
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
