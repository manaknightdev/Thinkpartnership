import apiClient from '@/config/axios';
import API_CONFIG from '@/config/api';

export interface ChatMessage {
  id: number;
  message: string;
  sender_type: 'customer' | 'vendor';
  message_type: number;
  attachments?: any;
  quote_amount?: number;
  quote_details?: any;
  created_at: string;
  read_by_customer: boolean;
  read_by_vendor: boolean;
}

export interface Chat {
  id: number;
  vendor: {
    id: number;
    name: string;
    contact: string;
    photo?: string;
  };
  service: {
    id: number;
    title: string;
    slug: string;
  };
  subject: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  status: number;
  created_at: string;
}

export interface StartChatRequest {
  service_id: number;
  vendor_id: number;
  initial_message?: string;
}

export interface SendMessageRequest {
  message: string;
  message_type?: number;
  attachments?: any;
}

class ChatAPI {
  // Get all customer chats
  async getChats(): Promise<{ error: boolean; chats: Chat[] }> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.CHAT.LIST);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching chats:', error);
      throw error.response?.data || { error: true, message: 'Failed to fetch chats' };
    }
  }

  // Get messages for a specific chat
  async getChatMessages(chatId: number): Promise<{ error: boolean; messages: ChatMessage[] }> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.CHAT.MESSAGES.replace(':chatId', chatId.toString()));
      return response.data;
    } catch (error: any) {
      console.error('Error fetching chat messages:', error);
      throw error.response?.data || { error: true, message: 'Failed to fetch messages' };
    }
  }

  // Send a message in a chat
  async sendMessage(chatId: number, messageData: SendMessageRequest): Promise<{ error: boolean; message: string; data: any }> {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.CHAT.SEND_MESSAGE.replace(':chatId', chatId.toString()), messageData);
      return response.data;
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw error.response?.data || { error: true, message: 'Failed to send message' };
    }
  }

  // Start a new chat with a vendor
  async startChat(chatData: StartChatRequest): Promise<{ error: boolean; message: string; data: any }> {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.CHAT.START_CHAT, chatData);
      return response.data;
    } catch (error: any) {
      console.error('Error starting chat:', error);
      throw error.response?.data || { error: true, message: 'Failed to start chat' };
    }
  }
}

export default new ChatAPI();
