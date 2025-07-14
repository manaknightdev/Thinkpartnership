// Environment Configuration Helper
export const ENV = {
  // Current environment
  NODE_ENV: import.meta.env.MODE,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  APP_ENV: import.meta.env.VITE_APP_ENV,
} as const;

// Helper function to log current environment (useful for debugging)
export const logEnvironment = () => {
  console.log('🌍 Environment Configuration:', {
    mode: ENV.NODE_ENV,
    isDev: ENV.IS_DEV,
    isProd: ENV.IS_PROD,
    apiBaseUrl: ENV.API_BASE_URL,
    appEnv: ENV.APP_ENV,
  });
};

// Export environment info for debugging
export default ENV;
