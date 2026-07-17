import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/api/schemas/auth.schema';

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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Expiry simulation for Mock Auth (1 hour from login)
  const isSessionExpired = () => {
    const expiresAt = localStorage.getItem('auth_expires_at');
    if (!expiresAt) return true;
    return Date.now() > parseInt(expiresAt, 10);
  };

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_expires_at');
    setUser(null);
  }, []);

  const refreshSession = useCallback(async () => {
    // Mock refresh session
    console.log('[Mock Auth] Refreshing session...');
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Extend by 1 hour
      localStorage.setItem('auth_expires_at', (Date.now() + 60 * 60 * 1000).toString());
    }
  }, []);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (token && storedUser) {
      if (isSessionExpired()) {
        console.warn('[Mock Auth] Session expired. Logging out.');
        logout();
      } else {
        try {
          setUser(JSON.parse(storedUser));
          // Proactively mock refresh if near expiry (simulate seamless token refresh)
          await refreshSession();
        } catch (e) {
          console.error('[Mock Auth] Failed to restore session', e);
          logout();
        }
      }
    }
    setIsLoading(false);
  }, [logout, refreshSession]);

  useEffect(() => {
    restoreSession();
    
    // Set up a mock interval to check expiry every minute
    const interval = setInterval(() => {
      if (user && isSessionExpired()) {
        logout();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [restoreSession, user, logout]);

  const login = (token: string, newUser: User) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    localStorage.setItem('auth_expires_at', (Date.now() + 60 * 60 * 1000).toString()); // 1 hr
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, restoreSession, refreshSession }}>
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
