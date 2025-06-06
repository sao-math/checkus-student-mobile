import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth';
import { LoginRequest, LoginResponse, UserInfo } from '../types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          setIsAuthenticated(true);
          setUser(response.data);
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('accessToken');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        // Token is invalid, clear it
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await authService.login(data);
      if (response.success && response.data) {
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        // Verify the token by getting user info
        const userResponse = await authService.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          setIsAuthenticated(true);
          setUser(userResponse.data);
        } else {
          throw new Error('Failed to verify user session');
        }
      } else {
        throw new Error(response.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      // Clear tokens if login fails
      localStorage.removeItem('accessToken');
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 