import vendorApiClient from '@/config/vendorAxios';
import API_CONFIG from '@/config/api';

export interface VendorMessage {
  id: number;
  message: string;
  sender_type: number;
  message_type: number;
  attachments?: any;
  quote_amount?: number;
  quote_details?: any;
  created_at: string;
  read_by_customer: boolean;
  read_by_vendor: boolean;
}

export interface VendorChat {
  id: number;
  customer_id: number;
  customer_email: string;
  customer_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  status: number;
  created_at: string;
}

export interface SendVendorMessageRequest {
  message: string;
  message_type?: number;
  attachments?: any;
}

class VendorMessagesAPI {
  // Get all vendor chats
  async getChats(): Promise<{ error: boolean; chats: VendorChat[] }> {
    try {
      const response = await vendorApiClient.get(API_CONFIG.ENDPOINTS.VENDOR_MESSAGES.LIST);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching vendor chats:', error);
      throw error.response?.data || { error: true, message: 'Failed to fetch chats' };
    }
  }

  // Get messages for a specific chat
  async getMessages(chatId: number): Promise<{ error: boolean; messages: VendorMessage[] }> {
    try {
      const response = await vendorApiClient.get(
        `${API_CONFIG.ENDPOINTS.VENDOR_MESSAGES.DETAILS}/${chatId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching chat messages:', error);
      throw error.response?.data || { error: true, message: 'Failed to fetch messages' };
    }
  }

  // Send a message in a chat
  async sendMessage(chatId: number, messageData: SendVendorMessageRequest): Promise<{ error: boolean; message: string; data: any }> {
    try {
      const response = await vendorApiClient.post(
        `${API_CONFIG.ENDPOINTS.VENDOR_MESSAGES.SEND}/${chatId}`,
        messageData
      );
      return response.data;
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw error.response?.data || { error: true, message: 'Failed to send message' };
    }
  }
}

export default new VendorMessagesAPI();
