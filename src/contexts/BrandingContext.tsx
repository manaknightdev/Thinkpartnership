import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ClientAPI, { BrandingSettings } from '@/services/ClientAPI';

// Helper function to convert relative URLs to full URLs
const getFullImageUrl = (url: string): string => {
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
};

interface BrandingContextType {
  branding: BrandingSettings | null;
  loading: boolean;
  updateBranding: (newBranding: Partial<BrandingSettings>) => void;
  refreshBranding: () => Promise<void>;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

interface BrandingProviderProps {
  children: ReactNode;
}

export const BrandingProvider: React.FC<BrandingProviderProps> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBranding = async () => {
    try {
      setLoading(true);
      const brandingData = await ClientAPI.getBrandingSettings();

      // Convert relative logo URL to full URL
      if (brandingData.logo_url) {
        brandingData.logo_url = getFullImageUrl(brandingData.logo_url);
      }

      setBranding(brandingData);
      
      // Apply primary color to CSS variables
      if (brandingData.primary_color) {
        const hslColor = hexToHsl(brandingData.primary_color);
        document.documentElement.style.setProperty('--primary', hslColor);
      }

      // Apply font family
      if (brandingData.font_family) {
        document.documentElement.style.setProperty('--font-family', brandingData.font_family);
      }
    } catch (error) {
      console.error('Error loading branding:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBranding = (newBranding: Partial<BrandingSettings>) => {
    // Convert relative logo URL to full URL if provided
    const updatedBranding = { ...newBranding };
    if (updatedBranding.logo_url) {
      updatedBranding.logo_url = getFullImageUrl(updatedBranding.logo_url);
    }

    setBranding(prev => prev ? { ...prev, ...updatedBranding } : null);

    // Apply primary color if updated
    if (newBranding.primary_color) {
      const hslColor = hexToHsl(newBranding.primary_color);
      document.documentElement.style.setProperty('--primary', hslColor);
    }

    // Apply font family if updated
    if (newBranding.font_family) {
      document.documentElement.style.setProperty('--font-family', newBranding.font_family);
    }
  };

  const refreshBranding = async () => {
    await loadBranding();
  };

  // Helper function to convert hex to HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  useEffect(() => {
    loadBranding();
  }, []);

  const value: BrandingContextType = {
    branding,
    loading,
    updateBranding,
    refreshBranding,
  };

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};
