import React, { createContext, useContext, useEffect, useCallback } from 'react';
import type { User } from '@/api/schemas/auth.schema';
import { useProfileQuery, useLogoutMutation } from '@/hooks/queries/useAuthQueries';
import { authApi } from '@/api/auth';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  restoreSession: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const tokenExists = !!localStorage.getItem('auth_token');

  // React Query manages the server state
  const { data: user, isLoading: isQueryLoading, refetch } = useProfileQuery(tokenExists);
  const logoutMutation = useLogoutMutation();

  const logout = useCallback(() => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        // Fallback cleanup in case mutation fails but we still want to log out
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_expires_at');
        queryClient.clear();
      }
    });
  }, [logoutMutation, queryClient]);

  const refreshSession = useCallback(async () => {
    try {
      const { token } = await authApi.refresh();
      localStorage.setItem('auth_token', token);
      await refetch();
    } catch (error) {
      logout();
    }
  }, [refetch, logout]);

  const restoreSession = useCallback(async () => {
    if (localStorage.getItem('auth_token')) {
      await refetch();
    }
  }, [refetch]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  const login = useCallback((token: string, newUser: User) => {
    localStorage.setItem('auth_token', token);
    // loginMutation is normally called directly, but if this is called from UI:
    queryClient.setQueryData(['auth', 'profile'], newUser);
  }, [queryClient]);

  return (
    <AuthContext.Provider 
      value={{ 
        user: user || null, 
        isAuthenticated: !!user, 
        isLoading: isQueryLoading, 
        login, 
        logout, 
        restoreSession, 
        refreshSession 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
