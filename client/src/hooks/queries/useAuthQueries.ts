import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import type { AuthResponse } from '@/api/schemas/auth.schema';

export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

export const useProfileQuery = (enabled = true) => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async ({ signal }) => {
      // Assuming a getProfile endpoint exists in authApi, but if not we can just return what we have or mock it
      // Let's call the authApi.getProfile
      return authApi.getProfile(signal);
    },
    enabled,
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: Record<string, string>) => authApi.login(credentials),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('auth_token', data.token);
      queryClient.setQueryData(authKeys.profile(), data.user);
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_expires_at');
      queryClient.removeQueries(); // clear all queries on logout
    },
  });
};

export const usePreferencesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: Record<string, any>) => authApi.updatePreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
};
