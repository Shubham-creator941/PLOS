import { apiClient } from './client';
import { AuthResponseSchema, type AuthResponse, UserSchema, type User } from './schemas/auth.schema';

export const authApi = {
  login: async (credentials: Record<string, string>, signal?: AbortSignal): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', credentials, { signal });
    // map standard backend response { data: { learner, token } } to AuthResponse { user, token }
    const backendData = data.data;
    const mapped = {
      token: backendData.token,
      user: {
        id: backendData.learner.learner_id,
        name: backendData.learner.full_name,
        email: backendData.learner.email
      }
    };
    return AuthResponseSchema.parse(mapped);
  },
  logout: async (signal?: AbortSignal): Promise<void> => {
    await apiClient.post('/auth/logout', {}, { signal });
  },
  getProfile: async (signal?: AbortSignal): Promise<User> => {
    const { data } = await apiClient.get('/auth/profile', { signal });
    const backendData = data.data;
    const mapped = {
      id: backendData.learner_id,
      name: backendData.full_name,
      email: backendData.email
    };
    return UserSchema.parse(mapped);
  },
  refresh: async (signal?: AbortSignal): Promise<{ token: string }> => {
    const { data } = await apiClient.post('/auth/refresh', {}, { signal });
    return data;
  },
  updatePreferences: async (preferences: Record<string, any>): Promise<void> => {
    await apiClient.patch('/auth/preferences', preferences);
  }
};
