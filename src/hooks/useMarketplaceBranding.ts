import { useState, useEffect } from 'react';
import MarketplaceBrandingAPI, { MarketplaceBrandingData } from '@/services/MarketplaceBrandingAPI';
import MarketplaceAuthAPI from '@/services/MarketplaceAuthAPI';

export const useMarketplaceBranding = () => {
  const [branding, setBranding] = useState<MarketplaceBrandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBranding = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get client ID from multiple sources
        let clientId: string | number | undefined;

        // 1. From stored marketplace auth data
        const marketplaceUserData = MarketplaceAuthAPI.getUserData();
        if (marketplaceUserData?.client_id) {
          clientId = marketplaceUserData.client_id;
        }

        // 2. From URL params
        if (!clientId) {
          const urlParams = new URLSearchParams(window.location.search);
          const clientParam = urlParams.get('client');
          if (clientParam) {
            clientId = clientParam;
          }
        }

        // 3. From subdomain (if applicable)
        if (!clientId) {
          const hostname = window.location.hostname;
          if (hostname.includes('.') && !hostname.startsWith('www.')) {
            const parts = hostname.split('.');
            const tld = parts.slice(-2).join('.');
            const isPlatformDomain = ['netlify.app', 'vercel.app', 'localhost'].includes(tld);
            if (!isPlatformDomain && parts.length >= 3) {
              const subdomain = parts[0];
              if (subdomain !== 'www') {
                clientId = subdomain;
              }
            }
          }
        }

        console.log('🎨 Loading marketplace branding for client:', clientId);

        const brandingData = await MarketplaceBrandingAPI.getBrandingData(clientId);
        setBranding(brandingData);

        // Apply CSS variables for colors and fonts
        if (brandingData) {
          if (brandingData.primary_color) {
            document.documentElement.style.setProperty('--primary', brandingData.primary_color);
          }
          if (brandingData.font_family) {
            document.documentElement.style.setProperty('--font-family', brandingData.font_family);
          }
          // Update page title
          if (brandingData.company_name) {
            document.title = `${brandingData.company_name} - Marketplace`;
          }
        }

      } catch (err: any) {
        console.error('Error loading marketplace branding:', err);
        setError(err.message || 'Failed to load branding');
        
        // Set default branding on error
        setBranding({
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
        });
      } finally {
        setLoading(false);
      }
    };

    loadBranding();
  }, []);

  return {
    branding,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      // Re-trigger the effect by changing dependency (if needed)
    }
  };
};