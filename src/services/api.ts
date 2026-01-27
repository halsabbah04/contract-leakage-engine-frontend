import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Base API client configuration
 * Proxied through Vite dev server to backend at http://localhost:7071
 */

const API_BASE_URL = '/api';

// Create axios instance with defaults
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 minutes for analysis operations
});

// Request interceptor - add auth headers if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
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

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Helper to handle API errors
export interface ApiError {
  error: string;
  details?: string;
  status_code: number;
}

export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'error' in error && typeof (error as ApiError).error === 'string';
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    if (isApiError(apiError)) {
      return apiError.details || apiError.error;
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}
