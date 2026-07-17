import axios from 'axios';
import { AppError } from '@/utils/errors';

// Standardized error normalization
const normalizeError = (error: unknown): AppError => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    const code = error.response?.data?.code || error.code || 'UNKNOWN_NETWORK_ERROR';
    const details = error.response?.data?.details || undefined;
    return new AppError(message, code, details);
  }
  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR');
  }
  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR', error);
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    // Inject Authorization header if token exists
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(normalizeError(error))
);

// Response interceptor with refresh logic and retry policy
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Automatic retry for 503/504 (Network/Server overload) up to 2 times
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 503 || status === 504) {
        if (!originalRequest._retryCount) originalRequest._retryCount = 0;
        if (originalRequest._retryCount < 2) {
          originalRequest._retryCount += 1;
          // Exponential backoff
          await new Promise(res => setTimeout(res, 1000 * Math.pow(2, originalRequest._retryCount)));
          return apiClient(originalRequest);
        }
      }
    }

    // Refresh interceptor for 401 Unauthorized
    if (axios.isAxiosError(error) && error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      try {
        // Attempt to refresh token
        const refreshResponse = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`, 
          {},
          { withCredentials: true } // Assuming httpOnly cookie for refresh token
        );
        
        const newToken = refreshResponse.data.token;
        if (newToken) {
          localStorage.setItem('auth_token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear session and force logout
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_expires_at');
        // Let the UI intercept this or dispatch an event (handled via AuthProvider)
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(normalizeError(refreshError));
      }
    }

    return Promise.reject(normalizeError(error));
  }
);
