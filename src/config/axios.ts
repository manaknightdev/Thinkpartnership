import axios from 'axios';
import API_CONFIG from './api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');

      // Only redirect to login if we're on a protected page
      const currentPath = window.location.pathname;
      const publicPaths = ['/marketplace', '/marketplace/services', '/marketplace/categories'];
      const isPublicPath = publicPaths.some(path =>
        currentPath === path || currentPath.startsWith(path + '/')
      );

      // Don't redirect if we're on a public marketplace page
      if (!isPublicPath) {
        window.location.href = '/marketplace/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
