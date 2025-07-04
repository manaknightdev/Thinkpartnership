// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5172',
  ENDPOINTS: {
    // Customer Authentication
    AUTH: {
      REGISTER: '/api/marketplace/auth/register',
      LOGIN: '/api/marketplace/auth/login',
      PROFILE: '/api/marketplace/auth/profile',
    },
    // Vendor Authentication
    VENDOR_AUTH: {
      REGISTER: '/api/marketplace/vendor/auth/register',
      LOGIN: '/api/marketplace/vendor/auth/login',
      PROFILE: '/api/marketplace/vendor/auth/profile',
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
    // Vendor Services
    VENDOR_SERVICES: {
      LIST: '/api/marketplace/vendor/services',
      CREATE: '/api/marketplace/vendor/services',
      UPDATE: '/api/marketplace/vendor/services',
      DELETE: '/api/marketplace/vendor/services',
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
  },
  TIMEOUT: 10000,
};

export default API_CONFIG;
