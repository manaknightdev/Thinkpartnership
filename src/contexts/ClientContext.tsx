import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_CONFIG } from '@/config/api';

// Client information interface
export interface ClientInfo {
  id: string;
  company_name: string;
  subdomain?: string;
  custom_domain?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  font_family?: string;
  marketplace_enabled?: boolean;
}

// Client context interface
interface ClientContextType {
  client: ClientInfo | null;
  clientSlug: string | null;
  isMultiClient: boolean;
  isLoading: boolean;
  error: string | null;
  inviteCode: string | null;
  detectClientFromUrl: () => Promise<void>;
  setClient: (client: ClientInfo | null) => void;
  getClientUrl: (path: string) => string;
  isClientRoute: (path: string) => boolean;
  getInviteCode: () => string | null;
  isInviteOnlyRoute: (path: string) => boolean;
  requiresClientContext: (path: string) => boolean;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClient = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};

interface ClientProviderProps {
  children: ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const [client, setClientState] = useState<ClientInfo | null>(null);
  const [clientSlug, setClientSlug] = useState<string | null>(null);
  const [isMultiClient, setIsMultiClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Extract client identifier from current URL
   */
  const extractClientFromUrl = (): string | null => {
    const hostname = window.location.hostname;
    const pathname = location.pathname;
    const urlParams = new URLSearchParams(location.search);

    // Method 1: Strong signal - explicit client param (from invite/referral links)
    const clientParam = urlParams.get('client');
    if (clientParam) {
      console.log(`🎫 Found client parameter in URL: ${clientParam}`);
      return clientParam; // Prefer explicit client id
    }

    // Method 1.5: Check for referral codes that might contain client information
    const refParam = urlParams.get('ref');
    const vendor = urlParams.get('vendor');
    if (refParam || vendor) {
      console.log(`🎫 Found referral parameters - ref: ${refParam}, vendor: ${vendor}`);
      // For now, let the backend handle client detection from referral codes
      // We'll return null here and let the backend API resolve the client context
      return null;
    }

    // Method 2: Subdomain-based detection, but ignore platform subdomains (e.g., *.netlify.app)
    if (hostname.includes('.') && !hostname.startsWith('www.')) {
      const parts = hostname.split('.');
      const tld = parts.slice(-2).join('.');
      const isPlatformDomain = ['netlify.app', 'vercel.app'].includes(tld);
      if (!isPlatformDomain && parts.length >= 3) {
        const subdomain = parts[0];
        if (subdomain !== 'www' && subdomain !== 'localhost') {
          return subdomain;
        }
      }
    }

    // Method 3: Path-based client (e.g., /client/clientname/marketplace)
    const pathPatterns = [
      /^\/client\/([^\/]+)/,  // /client/clientname
      /^\/([^\/]+)\/marketplace/, // /clientname/marketplace
      /^\/([^\/]+)\/vendor/, // /clientname/vendor
      /^\/([^\/]+)\/admin/   // /clientname/admin
    ];

    for (const pattern of pathPatterns) {
      const match = pathname.match(pattern);
      if (match) {
        return match[1];
      }
    }

    // Method 4: Referral code hint (legacy)
    const ref = urlParams.get('ref');
    if (ref) {
      if (ref.includes('CLIENT-CUST') || ref.includes('CLIENT-VEND') || ref.includes('client-')) {
        return 'acme';
      }
    }

    // Method 5: Custom domain
    if (!hostname.includes('localhost') && !hostname.includes('thinkpartnership')) {
      return hostname;
    }

    return null;
  };

  /**
   * Fetch client information from API
   */
  const fetchClientInfo = async (identifier: string): Promise<ClientInfo | null> => {
    try {
      // Try to get client info from API using proper base URL
      const apiUrl = `${API_CONFIG.BASE_URL}/api/marketplace/client/info?identifier=${encodeURIComponent(identifier)}`;
      console.log(`🌐 Fetching client info from: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`📡 Response status: ${response.status}`);

      if (response.ok) {
        const responseText = await response.text();
        console.log(`📄 Raw response: ${responseText.substring(0, 200)}...`);

        try {
          const data = JSON.parse(responseText);
          console.log(`✅ Successfully parsed client data:`, data);

          // Our API returns {error: false, client: {...}} format
          if (data && !data.error && data.client) {
            return data.client;
          } else {
            console.log(`⚠️ API returned error or no client data:`, data);
            return null;
          }
        } catch (parseError) {
          console.error('❌ Failed to parse JSON response:', parseError);
          console.log('Raw response was:', responseText);
          return null;
        }
      } else {
        const errorText = await response.text();
        console.error(`❌ API request failed with status ${response.status}:`, errorText);
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching client info:', error);
      return null;
    }
  };

  /**
   * Extract invite code from URL parameters
   */
  const extractInviteCode = (): string | null => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('invite') || urlParams.get('code') || urlParams.get('ref');
  };

  /**
   * Check if current route requires invite-only access
   */
  const isInviteOnlyRoute = (path: string): boolean => {
    const inviteRoutes = ['/signup', '/register', '/invite'];
    return inviteRoutes.some(route => path.includes(route));
  };

  /**
   * Check if current route requires client context (only signup/register routes)
   */
  const requiresClientContext = (path: string): boolean => {
    console.log(`🔍 Checking if path requires client context: ${path}`);

    // Routes that should NOT require client context (always accessible)
    const excludedRoutes = [
      '/client',
      '/admin',
      '/onboarding',
      '/select-client'
    ];

    // Check if path is excluded first
    if (excludedRoutes.some(route => path.startsWith(route))) {
      console.log(`✅ Path is excluded (always accessible): ${path}`);
      return false;
    }

    // Login pages should always be accessible
    if (path.includes('/login')) {
      console.log(`✅ Login page is always accessible: ${path}`);
      return false;
    }

    // Legacy routes with referral codes should be allowed (they'll detect client from ref param)
    const urlParams = new URLSearchParams(window.location.search);
    const hasReferralCode = urlParams.get('ref') || urlParams.get('invite') || urlParams.get('code') || urlParams.get('client');
    if (hasReferralCode) {
      console.log(`✅ Has referral/invite code, allowing access: ${path}`, {
        ref: urlParams.get('ref'),
        invite: urlParams.get('invite'),
        code: urlParams.get('code'),
        client: urlParams.get('client')
      });
      return false; // Allow access, client will be detected from referral code
    }

    // Only signup/register routes require client context
    const signupRoutes = [
      '/signup',
      '/register'
    ];

    // Check if path is a signup/register route
    const requiresContext = signupRoutes.some(route => path.includes(route));
    console.log(`${requiresContext ? '❌' : '✅'} Path ${requiresContext ? 'requires' : 'does not require'} client context: ${path}`);
    return requiresContext;
  };

  /**
   * Get current invite code
   */
  const getInviteCode = (): string | null => {
    return inviteCode;
  };

  /**
   * Detect client from current URL and load client information
   */
  const detectClientFromUrl = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Extract invite code from URL
      const currentInviteCode = extractInviteCode();
      setInviteCode(currentInviteCode);

      // Check for invite/referral parameters first - this should bypass client context requirements
      const urlParams = new URLSearchParams(location.search);
      const hasInviteParams = urlParams.get('ref') || urlParams.get('invite') || urlParams.get('code') || urlParams.get('client');

      if (hasInviteParams) {
        console.log('🎫 Invite parameters detected, forcing client detection');
      }

      const identifier = extractClientFromUrl();

      if (identifier) {
        console.log(`🔍 Detected client identifier: ${identifier}`);
        if (currentInviteCode) {
          console.log(`🎫 Invite code detected: ${currentInviteCode}`);
        }

        setClientSlug(identifier);
        setIsMultiClient(true);

        // Fetch client information
        const clientInfo = await fetchClientInfo(identifier);
        if (clientInfo) {
          setClientState(clientInfo);
          console.log(`✅ Loaded client: ${clientInfo.company_name}`);

          // Apply client branding
          applyClientBranding(clientInfo);
        } else {
          setError(`Client not found: ${identifier}`);
          setClientState(null);
        }
      } else {
        // No client identifier found
        console.log('🏢 No client identifier found');
        console.log('Current URL:', window.location.href);
        console.log('Current pathname:', location.pathname);
        console.log('Current search params:', location.search);

        setClientSlug(null);
        setIsMultiClient(false);
        setClientState(null);

        // Only redirect if user is trying to access a route that requires client context
        if (requiresClientContext(location.pathname)) {
          console.log('⚠️ Route requires client context, redirecting to client selection');
          navigate('/select-client');
        } else {
          console.log('✅ Route does not require client context, allowing access');
        }
      }
    } catch (err) {
      console.error('Error detecting client:', err);
      setError('Failed to detect client context');
      setClientState(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Apply client branding to the page
   */
  const applyClientBranding = (clientInfo: ClientInfo) => {
    if (clientInfo.primary_color) {
      document.documentElement.style.setProperty('--primary', clientInfo.primary_color);
    }
    
    if (clientInfo.font_family) {
      document.documentElement.style.setProperty('--font-family', clientInfo.font_family);
    }

    // Update page title
    if (clientInfo.company_name) {
      document.title = `${clientInfo.company_name} - Marketplace`;
    }
  };

  /**
   * Generate client-aware URL
   */
  const getClientUrl = (path: string): string => {
    if (!isMultiClient || !clientSlug) {
      return path;
    }

    // If we're using subdomain, just return the path
    if (window.location.hostname.includes('.') && window.location.hostname.startsWith(clientSlug)) {
      return path;
    }

    // If we're using path-based routing, prepend client slug
    if (path.startsWith('/marketplace') || path.startsWith('/vendor') || path.startsWith('/admin')) {
      return `/${clientSlug}${path}`;
    }

    return path;
  };

  /**
   * Check if a path is a client-specific route
   */
  const isClientRoute = (path: string): boolean => {
    const clientRoutes = ['/marketplace', '/vendor', '/admin'];
    return clientRoutes.some(route => path.startsWith(route));
  };

  /**
   * Set client information
   */
  const setClient = (newClient: ClientInfo | null) => {
    setClientState(newClient);
    if (newClient) {
      applyClientBranding(newClient);
    }
  };

  // Detect client on mount and when location changes
  useEffect(() => {
    detectClientFromUrl();
  }, [location.pathname, location.search]);

  // Redirect to client-specific routes if needed
  useEffect(() => {
    if (!isLoading && isMultiClient && client && clientSlug) {
      const currentPath = location.pathname;
      
      // If we're on a root path and should be on a client path
      if (currentPath === '/' || currentPath === '/marketplace') {
        const newPath = getClientUrl('/marketplace');
        if (newPath !== currentPath) {
          navigate(newPath, { replace: true });
        }
      }
    }
  }, [isLoading, isMultiClient, client, clientSlug, location.pathname, navigate]);

  const contextValue: ClientContextType = {
    client,
    clientSlug,
    isMultiClient,
    isLoading,
    error,
    inviteCode,
    detectClientFromUrl,
    setClient,
    getClientUrl,
    isClientRoute,
    getInviteCode,
    isInviteOnlyRoute,
    requiresClientContext,
  };

  return (
    <ClientContext.Provider value={contextValue}>
      {children}
    </ClientContext.Provider>
  );
};

export default ClientContext;
