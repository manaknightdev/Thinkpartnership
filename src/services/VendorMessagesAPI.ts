import vendorApiClient from '@/config/vendorAxios';
import API_CONFIG from '@/config/api';
import TaxAPI, { TaxCalculation } from './TaxAPI';

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
  quote_amount?: number;
  quote_details?: any;
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

  // Send a quote message in a chat
  async sendQuote(chatId: number, quoteData: {
    service: string;
    price: number;
    description: string;
    validUntil?: string;
    estimatedDuration?: string;
    customerProvince?: string;
    taxInclusive?: boolean;
    customTaxRate?: number;
  }): Promise<{ error: boolean; message: string; data: any; taxCalculation?: TaxCalculation }> {
    try {
      // Calculate tax for this quote
      let taxCalculation: TaxCalculation | null = null;
      let finalQuoteAmount = quoteData.price;

      if (quoteData.customerProvince) {
        try {
          taxCalculation = await TaxAPI.calculateQuoteTax(
            quoteData.price,
            quoteData.customerProvince,
            quoteData.taxInclusive || false,
            quoteData.customTaxRate
          );
          finalQuoteAmount = taxCalculation.total_amount;
        } catch (error) {
          console.warn('Could not calculate tax for quote, using fallback:', error);
          // Use client-side fallback calculation
          taxCalculation = TaxAPI.calculateClientTax(
            quoteData.price,
            quoteData.customerProvince,
            quoteData.taxInclusive || false,
            quoteData.customTaxRate
          );
          finalQuoteAmount = taxCalculation.total_amount;
        }
      }

      const messageData: SendVendorMessageRequest = {
        message: `I've prepared a quote for your project: ${quoteData.service}`,
        message_type: 3, // Quote message type
        quote_amount: finalQuoteAmount,
        quote_details: {
          service: quoteData.service,
          description: quoteData.description,
          validUntil: quoteData.validUntil,
          estimatedDuration: quoteData.estimatedDuration,
          basePrice: quoteData.price,
          taxCalculation: taxCalculation,
          customerProvince: quoteData.customerProvince,
          taxInclusive: quoteData.taxInclusive,
          customTaxRate: quoteData.customTaxRate
        }
      };

      const response = await vendorApiClient.post(
        `${API_CONFIG.ENDPOINTS.VENDOR_MESSAGES.SEND}/${chatId}`,
        messageData
      );
      
      return { 
        ...response.data, 
        taxCalculation: taxCalculation || undefined 
      };
    } catch (error: any) {
      console.error('Error sending quote:', error);
      throw error.response?.data || { error: true, message: 'Failed to send quote' };
    }
  }
}

export default new VendorMessagesAPI();
