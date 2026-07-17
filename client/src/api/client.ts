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
  (error) => {
    return Promise.reject(normalizeError(error));
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(normalizeError(error));
  }
);
