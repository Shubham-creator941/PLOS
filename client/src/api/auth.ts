import { apiClient } from './client';
import { AuthResponseSchema, type AuthResponse } from './schemas/auth.schema';

export const authApi = {
  login: async (credentials: Record<string, string>, signal?: AbortSignal): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', credentials, { signal });
    return AuthResponseSchema.parse(data);
  },
  logout: async (signal?: AbortSignal): Promise<void> => {
    await apiClient.post('/auth/logout', {}, { signal });
  },
};
