// API Configuration
const getBaseUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Fallback based on environment
  if (import.meta.env.DEV) {
    return 'http://localhost:5172';
  }

  return 'https://baas.mytechpassport.com';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    // Customer Authentication
    AUTH: {
      REGISTER: '/api/marketplace/auth/register',
      LOGIN: '/api/marketplace/auth/login',
      PROFILE: '/api/marketplace/auth/profile',
    },
    // Customer Stripe Integration
    STRIPE: {
      CONNECT: '/api/marketplace/auth/stripe/connect',
      ACCOUNT_STATUS: '/api/marketplace/auth/stripe/account-status',
      DISCONNECT: '/api/marketplace/auth/stripe/disconnect',
      CREATE_PAYMENT: '/api/marketplace/auth/stripe/create-payment',
    },
    // Vendor Authentication
    VENDOR_AUTH: {
      REGISTER: '/api/marketplace/vendor/auth/register',
      LOGIN: '/api/marketplace/vendor/auth/login',
      PROFILE: '/api/marketplace/vendor/auth/profile',
    },
    // Vendor Stripe Integration
    VENDOR_STRIPE: {
      CONNECT: '/api/marketplace/vendor/auth/stripe/connect',
      ACCOUNT_STATUS: '/api/marketplace/vendor/auth/stripe/account-status',
      DISCONNECT: '/api/marketplace/vendor/auth/stripe/disconnect',
    },
    // Client Authentication
    CLIENT_AUTH: {
      REGISTER: '/api/marketplace/client/auth/register',
      LOGIN: '/api/marketplace/client/auth/login',
      PROFILE: '/api/marketplace/client/auth/profile',
    },
    // Client Stripe Integration
    CLIENT_STRIPE: {
      CONNECT: '/api/marketplace/client/auth/stripe/connect',
      ACCOUNT_STATUS: '/api/marketplace/client/auth/stripe/account-status',
      DISCONNECT: '/api/marketplace/client/auth/stripe/disconnect',
    },
    // Client Referrals
    CLIENT_REFERRALS: {
      STATS: '/api/marketplace/client/referrals/stats',
      LIST: '/api/marketplace/client/referrals',
      CODES: '/api/marketplace/client/referrals/codes',
      LINKS: '/api/marketplace/client/referrals/links',
      ANALYTICS: '/api/marketplace/client/referrals/analytics',
    },
    // Client Invites
    CLIENT_INVITES: {
      STATS: '/api/marketplace/client/invites/stats',
      LIST: '/api/marketplace/client/invites',
      SEND: '/api/marketplace/client/invites/send',
      BULK_SEND: '/api/marketplace/client/invites/bulk-send',
      TEMPLATES: '/api/marketplace/client/invites/templates',
      ANALYTICS: '/api/marketplace/client/invites/analytics',
    },
    // Admin Authentication
    ADMIN_AUTH: {
      LOGIN: '/api/marketplace/admin/auth/login',
      PROFILE: '/api/marketplace/admin/auth/profile',
      LOGIN_AS_CLIENT: '/api/marketplace/admin/auth/login-as-client',
      RETURN_FROM_IMPERSONATION: '/api/marketplace/admin/auth/return-from-impersonation',
    },
    // Admin Stripe Integration
    ADMIN_STRIPE: {
      CONNECT: '/api/marketplace/admin/auth/stripe/connect',
      ACCOUNT_STATUS: '/api/marketplace/admin/auth/stripe/account-status',
      DISCONNECT: '/api/marketplace/admin/auth/stripe/disconnect',
    },
    // Services
    SERVICES: {
      LIST: '/api/marketplace/services',
      DETAILS: '/api/marketplace/services',
      CATEGORIES: '/api/marketplace/categories',
    },
    // Service Requests
    SERVICE_REQUESTS: {
      CREATE: '/api/marketplace/service-requests',
      LIST: '/api/marketplace/service-requests',
      DETAILS: '/api/marketplace/service-requests',
    },
    // Customer Chat
    CHAT: {
      LIST: '/api/marketplace/chats',
      MESSAGES: '/api/marketplace/chats/:chatId/messages',
      SEND_MESSAGE: '/api/marketplace/chats/:chatId/messages',
      START_CHAT: '/api/marketplace/chats/start',
    },
    // Vendor Services
    VENDOR_SERVICES: {
      LIST: '/api/marketplace/vendor/services',
      CREATE: '/api/marketplace/vendor/services',
      UPDATE: '/api/marketplace/vendor/services',
      DELETE: '/api/marketplace/vendor/services',
      UPLOAD_IMAGE: '/v1/api/thinkpartnership/vendor/lambda/upload',
    },
    // Vendor Requests
    VENDOR_REQUESTS: {
      LIST: '/api/marketplace/vendor/requests',
      DETAILS: '/api/marketplace/vendor/requests',
      QUOTE: '/api/marketplace/vendor/requests',
    },
    // Vendor Customers
    VENDOR_CUSTOMERS: {
      LIST: '/api/marketplace/vendor/customers',
    },
    // Vendor Messages
    VENDOR_MESSAGES: {
      LIST: '/api/marketplace/vendor/messages',
      DETAILS: '/api/marketplace/vendor/messages',
      SEND: '/api/marketplace/vendor/messages',
    },
    // Vendor Orders
    VENDOR_ORDERS: {
      LIST: '/api/marketplace/vendor/orders',
      UPDATE_STATUS: '/api/marketplace/vendor/orders',
    },
    // Vendor Analytics
    VENDOR_ANALYTICS: {
      DASHBOARD: '/api/marketplace/vendor/analytics/dashboard',
    },
    // Vendor Wallet
    VENDOR_WALLET: {
      BALANCE: '/api/marketplace/vendor/wallet/balance',
      TRANSACTIONS: '/api/marketplace/vendor/wallet/transactions',
      EARNINGS_STATS: '/api/marketplace/vendor/wallet/earnings-stats',
      PAYMENT_METHODS: '/api/marketplace/vendor/wallet/payment-methods',
      WITHDRAW: '/api/marketplace/vendor/wallet/withdraw',
      WITHDRAWALS: '/api/marketplace/vendor/wallet/withdrawals',
      EXPORT: '/api/marketplace/vendor/wallet/export',
    },
    // Vendor Referrals
    VENDOR_REFERRALS: {
      STATS: '/api/marketplace/vendor/referrals/stats',
      LIST: '/api/marketplace/vendor/referrals',
      CODES: '/api/marketplace/vendor/referrals/codes',
      LINKS: '/api/marketplace/vendor/referrals/links',
      ANALYTICS: '/api/marketplace/vendor/referrals/analytics',
    },
    // Vendor Invites
    VENDOR_INVITES: {
      STATS: '/api/marketplace/vendor/invites/stats',
      LIST: '/api/marketplace/vendor/invites',
      SEND: '/api/marketplace/vendor/invites/send',
      BULK_SEND: '/api/marketplace/vendor/invites/bulk-send',
      TEMPLATES: '/api/marketplace/vendor/invites/templates',
      ANALYTICS: '/api/marketplace/vendor/invites/analytics',
    },
    // Vendor Featured Placement
    VENDOR_FEATURED: {
      PACKAGES: '/api/marketplace/vendor/featured-placement/packages',
      ACTIVE: '/api/marketplace/vendor/featured-placement/active',
      PURCHASE: '/api/marketplace/vendor/featured-placement/purchase',
      ANALYTICS: '/api/marketplace/vendor/featured-placement/analytics',
    },
    // Admin Dashboard
    ADMIN_DASHBOARD: {
      STATS: '/api/marketplace/admin/dashboard/stats',
      REVENUE_ANALYTICS: '/api/marketplace/admin/analytics/revenue',
    },
    // Admin Management
    ADMIN_CLIENTS: {
      LIST: '/api/marketplace/admin/clients',
      UPDATE_STATUS: '/api/marketplace/admin/clients',
      SUSPEND: '/api/marketplace/admin/clients',
      TERMINATE: '/api/marketplace/admin/clients',
    },
    ADMIN_VENDORS: {
      LIST: '/api/marketplace/admin/vendors',
    },
    ADMIN_CUSTOMERS: {
      LIST: '/api/marketplace/admin/customers',
    },
    ADMIN_TRANSACTIONS: {
      LIST: '/api/marketplace/admin/transactions',
      DETAILS: '/api/marketplace/admin/transactions/:id',
      UPDATE_STATUS: '/api/marketplace/admin/transactions/:id/status',
      EXPORT: '/api/marketplace/admin/transactions/export',
    },
    ADMIN_VENDOR_APPROVALS: {
      LIST: '/api/marketplace/admin/vendor-approvals',
      DETAILS: '/api/marketplace/admin/vendor-approvals/:id',
      APPROVE: '/api/marketplace/admin/vendor-approvals/:id/approve',
      REJECT: '/api/marketplace/admin/vendor-approvals/:id/reject',
    },
    ADMIN_REVENUE_RULES: {
      LIST: '/api/marketplace/admin/revenue/rules',
      CREATE: '/api/marketplace/admin/revenue/rules',
      UPDATE: '/api/marketplace/admin/revenue/rules/:id',
      DELETE: '/api/marketplace/admin/revenue/rules/:id',
      UPDATE_DEFAULT: '/api/marketplace/admin/revenue/rules/default',
    },
    ADMIN_VENDOR_APPROVALS: {
      LIST: '/api/marketplace/admin/vendor-approvals',
      UPDATE_STATUS: '/api/marketplace/admin/vendor-approvals',
    },
    ADMIN_REVENUE: {
      RULES: '/api/marketplace/admin/revenue/rules',
      MANUAL_COMMISSION: '/api/marketplace/admin/commissions/manual',
    },
    ADMIN_REPORTS: {
      PERFORMANCE: '/api/marketplace/admin/reports/performance',
      EXPORT: '/api/marketplace/admin/reports/export',
    },
    // Admin Wallet
    ADMIN_WALLET: {
      BALANCE: '/api/marketplace/admin/wallet/balance',
      TRANSACTIONS: '/api/marketplace/admin/wallet/transactions',
      WITHDRAW: '/api/marketplace/admin/wallet/withdraw',
      WITHDRAWALS: '/api/marketplace/admin/wallet/withdrawals',
      EXPORT: '/api/marketplace/admin/wallet/export',
    },
  },
  TIMEOUT: 10000,
};

export default API_CONFIG;
