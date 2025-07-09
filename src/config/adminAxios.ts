import axios from 'axios';
import API_CONFIG from './api';

// Create axios instance for admin portal
const adminApiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add admin auth token
adminApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle admin-specific errors
adminApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear admin token and redirect to admin login
      localStorage.removeItem('admin_auth_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_user_data');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default adminApiClient;
