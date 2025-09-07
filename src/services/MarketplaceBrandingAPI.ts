import axios from 'axios';
import API_CONFIG from '@/config/api';

export interface MarketplaceBrandingData {
  company_name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  font_family?: string;
  // Marketplace content text fields
  hero_heading?: string;
  hero_subheading?: string;
  hero_search_placeholder?: string;
  featured_section_title?: string;
  featured_section_subtitle?: string;
  cta_heading?: string;
  cta_subheading?: string;
  cta_button_text?: string;
}

interface BrandingResponse {
  error: boolean;
  branding?: MarketplaceBrandingData;
  message?: string;
}

// Create a basic API client for marketplace branding (no auth required for public branding)
const marketplaceBrandingClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class MarketplaceBrandingAPI {
  /**
   * Get marketplace branding data for the current client context
   * This can be called from the marketplace without authentication
   */
  static async getBrandingData(clientId?: string | number): Promise<MarketplaceBrandingData | null> {
    try {
      // If no clientId provided, try to detect from URL or stored auth data
      let client = clientId;
      
      if (!client) {
        // Try to get from stored marketplace auth data
        const marketplaceAuth = localStorage.getItem('auth_token');
        if (marketplaceAuth) {
          try {
            const authData = JSON.parse(localStorage.getItem('marketplace_user_data') || '{}');
            client = authData.client_id;
          } catch (e) {
            // Silent fail
          }
        }
        
        // Try to detect from URL params
        if (!client) {
          const urlParams = new URLSearchParams(window.location.search);
          client = urlParams.get('client');
        }
      }

      // If we have a client context, try to get their branding
      if (client) {
        const response = await marketplaceBrandingClient.get(`/api/marketplace/client/${client}/public-branding`);
        if (!response.data.error && response.data.branding) {
          return response.data.branding;
        }
      }

      // Return default branding
      return {
        company_name: 'RealPartnersOS',
        primary_color: '#22C55E',
        secondary_color: '#3B82F6',
        font_family: 'Inter, sans-serif',
        hero_heading: 'Find the perfect service for your home',
        hero_subheading: 'Connect with trusted professionals. Quality guaranteed, satisfaction promised.',
        hero_search_placeholder: 'What service do you need? Try \'home cleaning\', \'plumbing repair\', \'painting\'...',
        featured_section_title: 'Featured Services',
        featured_section_subtitle: 'Top-rated services from trusted professionals in your area.',
        cta_heading: 'Ready to Get Started?',
        cta_subheading: 'Connect with service providers in your area. Quality work from trusted professionals.',
        cta_button_text: 'Browse All Services'
      };

    } catch (error: any) {
      console.error('Error fetching marketplace branding:', error);
      
      // Return default branding on error
      return {
        company_name: 'RealPartnersOS',
        primary_color: '#22C55E',
        secondary_color: '#3B82F6',
        font_family: 'Inter, sans-serif',
        hero_heading: 'Find the perfect service for your home',
        hero_subheading: 'Connect with trusted professionals. Quality guaranteed, satisfaction promised.',
        hero_search_placeholder: 'What service do you need? Try \'home cleaning\', \'plumbing repair\', \'painting\'...',
        featured_section_title: 'Featured Services',
        featured_section_subtitle: 'Top-rated services from trusted professionals in your area.',
        cta_heading: 'Ready to Get Started?',
        cta_subheading: 'Connect with service providers in your area. Quality work from trusted professionals.',
        cta_button_text: 'Browse All Services'
      };
    }
  }

  /**
   * Helper function to get full image URL
   */
  static getFullImageUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url; // Already a full URL
    }
    if (url.startsWith('/uploads/')) {
      // Use local development server for development, production server for production
      const baseUrl = import.meta.env.DEV
        ? 'http://localhost:5172'
        : 'https://baas.mytechpassport.com';
      return `${baseUrl}${url}`;
    }
    return url;
  }
}

export default MarketplaceBrandingAPI;