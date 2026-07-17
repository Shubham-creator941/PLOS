import { apiClient } from './client';
import { AuthResponseSchema, type AuthResponse, UserSchema, type User } from './schemas/auth.schema';

export const authApi = {
  login: async (credentials: Record<string, string>, signal?: AbortSignal): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', credentials, { signal });
    return AuthResponseSchema.parse(data);
  },
  logout: async (signal?: AbortSignal): Promise<void> => {
    await apiClient.post('/auth/logout', {}, { signal });
  },
  getProfile: async (signal?: AbortSignal): Promise<User> => {
    const { data } = await apiClient.get('/auth/profile', { signal });
    return UserSchema.parse(data);
  },
  refresh: async (signal?: AbortSignal): Promise<{ token: string }> => {
    const { data } = await apiClient.post('/auth/refresh', {}, { signal });
    return data;
  },
  updatePreferences: async (preferences: Record<string, any>): Promise<void> => {
    await apiClient.patch('/auth/preferences', preferences);
  }
};
