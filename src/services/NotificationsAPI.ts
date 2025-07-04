import apiClient from '@/config/axios';

export interface Notification {
  id: number;
  user_id: number;
  type: 'service_request' | 'payment' | 'message' | 'system' | 'order_update';
  title: string;
  message: string;
  data?: any; // Additional data as JSON
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationsResponse {
  error: boolean;
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  unread_count: number;
  message?: string;
}

export interface NotificationResponse {
  error: boolean;
  notification: Notification;
  message?: string;
}

export interface MarkReadResponse {
  error: boolean;
  message: string;
}

class NotificationsAPI {
  // Get all notifications for the current user
  static async getNotifications(page: number = 1, limit: number = 20): Promise<NotificationsResponse> {
    try {
      const response = await apiClient.get('/api/marketplace/notifications', {
        params: { page, limit }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      return {
        error: true,
        notifications: [],
        pagination: { page: 1, limit: 20, total: 0, total_pages: 0 },
        unread_count: 0,
        message: error.response?.data?.message || 'Failed to fetch notifications'
      };
    }
  }

  // Get unread notifications count
  static async getUnreadCount(): Promise<{ error: boolean; count: number; message?: string }> {
    try {
      const response = await apiClient.get('/api/marketplace/notifications/unread-count');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching unread count:', error);
      return {
        error: true,
        count: 0,
        message: error.response?.data?.message || 'Failed to fetch unread count'
      };
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: number): Promise<MarkReadResponse> {
    try {
      const response = await apiClient.patch(`/api/marketplace/notifications/${notificationId}/read`);
      return response.data;
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to mark notification as read'
      };
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(): Promise<MarkReadResponse> {
    try {
      const response = await apiClient.patch('/api/marketplace/notifications/mark-all-read');
      return response.data;
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to mark all notifications as read'
      };
    }
  }

  // Delete notification
  static async deleteNotification(notificationId: number): Promise<MarkReadResponse> {
    try {
      const response = await apiClient.delete(`/api/marketplace/notifications/${notificationId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to delete notification'
      };
    }
  }

  // Get notifications by type
  static async getNotificationsByType(type: string, page: number = 1, limit: number = 20): Promise<NotificationsResponse> {
    try {
      const response = await apiClient.get('/api/marketplace/notifications', {
        params: { type, page, limit }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching notifications by type:', error);
      return {
        error: true,
        notifications: [],
        pagination: { page: 1, limit: 20, total: 0, total_pages: 0 },
        unread_count: 0,
        message: error.response?.data?.message || 'Failed to fetch notifications'
      };
    }
  }

  // Create notification (for testing purposes)
  static async createNotification(data: {
    type: string;
    title: string;
    message: string;
    data?: any;
  }): Promise<NotificationResponse> {
    try {
      const response = await apiClient.post('/api/marketplace/notifications', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating notification:', error);
      return {
        error: true,
        notification: {} as Notification,
        message: error.response?.data?.message || 'Failed to create notification'
      };
    }
  }
}

export default NotificationsAPI;
