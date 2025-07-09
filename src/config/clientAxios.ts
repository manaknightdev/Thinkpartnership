import axios from 'axios';
import API_CONFIG from './api';

// Create axios instance for client portal
const clientApiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add client auth token
clientApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('client_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle client-specific errors
clientApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear client token and redirect to client login
      localStorage.removeItem('client_token');
      localStorage.removeItem('client_id');
      localStorage.removeItem('client_user');
      window.location.href = '/client/login';
    }
    return Promise.reject(error);
  }
);

export default clientApiClient;
