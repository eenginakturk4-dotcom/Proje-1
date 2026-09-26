import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('shoppy_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('shoppy_access_token');
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const data = await api.auth.me();
      setUser(data.user);
      localStorage.setItem('shoppy_user', JSON.stringify(data.user));
    } catch (error) {
      console.warn('Could not verify current user:', error);
      setUser(null);
      localStorage.removeItem('shoppy_access_token');
      localStorage.removeItem('shoppy_refresh_token');
      localStorage.removeItem('shoppy_user');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    const handleLogoutEvent = () => {
      setUser(null);
    };

    window.addEventListener('shoppy_auth_logout', handleLogoutEvent);
    return () => window.removeEventListener('shoppy_auth_logout', handleLogoutEvent);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.auth.login({ email, password });
    localStorage.setItem('shoppy_access_token', data.accessToken);
    localStorage.setItem('shoppy_refresh_token', data.refreshToken);
    localStorage.setItem('shoppy_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await api.auth.register({ name, email, password });
    localStorage.setItem('shoppy_access_token', data.accessToken);
    localStorage.setItem('shoppy_refresh_token', data.refreshToken);
    localStorage.setItem('shoppy_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('shoppy_refresh_token');
      if (refreshToken) {
        await api.auth.logout(refreshToken);
      }
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.removeItem('shoppy_access_token');
      localStorage.removeItem('shoppy_refresh_token');
      localStorage.removeItem('shoppy_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isLoading,
        login,
        register,
        logout,
        refreshUser,
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
