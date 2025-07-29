import apiClient from '@/config/axios';

export interface UserProfile {
  id: number;
  email: string;
  role: number;
  status: number;
  first_name: string;
  last_name: string;
  phone: string;
  photo: string;
  created_at: string;
  // Additional fields that might be added later
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  bio?: string;
  total_orders?: number;
  total_spent?: number;
  favorite_categories?: string[];
  email_notifications?: boolean;
  sms_notifications?: boolean;
  marketing_emails?: boolean;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  photo?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  bio?: string;
  email_notifications?: boolean;
  sms_notifications?: boolean;
  marketing_emails?: boolean;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface UserProfileResponse {
  error: boolean;
  user: UserProfile;
  message?: string;
}

export interface UpdateProfileResponse {
  error: boolean;
  user: UserProfile;
  message?: string;
}

export interface ChangePasswordResponse {
  error: boolean;
  message: string;
}

export interface UploadAvatarResponse {
  error: boolean;
  avatar_url: string;
  message?: string;
}

class UserAPI {
  // Get current user profile
  static async getProfile(): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.get('/api/marketplace/auth/profile');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      return {
        error: true,
        user: {} as UserProfile,
        message: error.response?.data?.message || 'Failed to fetch user profile'
      };
    }
  }

  // Update user profile
  static async updateProfile(data: UpdateProfileData): Promise<UpdateProfileResponse> {
    try {
      const response = await apiClient.put('/api/marketplace/auth/profile', data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      return {
        error: true,
        user: {} as UserProfile,
        message: error.response?.data?.message || 'Failed to update user profile'
      };
    }
  }

  // Change password
  static async changePassword(data: ChangePasswordData): Promise<ChangePasswordResponse> {
    try {
      const response = await apiClient.post('/api/marketplace/auth/change-password', data);
      return response.data;
    } catch (error: any) {
      console.error('Error changing password:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to change password'
      };
    }
  }

  // Upload avatar
  static async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post('/api/marketplace/auth/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      return {
        error: true,
        avatar_url: '',
        message: error.response?.data?.message || 'Failed to upload avatar'
      };
    }
  }

  // Delete account
  static async deleteAccount(password: string): Promise<ChangePasswordResponse> {
    try {
      const response = await apiClient.delete('/customer/account', {
        data: { password }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error deleting account:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to delete account'
      };
    }
  }

  // Get user statistics
  static async getUserStats(): Promise<{
    error: boolean;
    stats: {
      total_orders: number;
      total_spent: number;
      active_requests: number;
      completed_orders: number;
      favorite_categories: string[];
    };
    message?: string;
  }> {
    try {
      const response = await apiClient.get('/customer/stats');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
      return {
        error: true,
        stats: {
          total_orders: 0,
          total_spent: 0,
          active_requests: 0,
          completed_orders: 0,
          favorite_categories: []
        },
        message: error.response?.data?.message || 'Failed to fetch user statistics'
      };
    }
  }
}

export default UserAPI;
