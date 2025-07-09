import axios from 'axios';
import API_CONFIG from './api';

// Create axios instance for vendor portal
const vendorApiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add vendor auth token
vendorApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vendor_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle vendor-specific errors
vendorApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear vendor token and redirect to vendor login
      localStorage.removeItem('vendor_auth_token');
      localStorage.removeItem('vendor_refresh_token');
      localStorage.removeItem('vendor_user_id');
      localStorage.removeItem('vendor_id');
      localStorage.removeItem('vendor_role');
      localStorage.removeItem('vendor_business_name');
      localStorage.removeItem('vendor_email');
      window.location.href = '/vendor/login';
    }
    return Promise.reject(error);
  }
);

export default vendorApiClient;
