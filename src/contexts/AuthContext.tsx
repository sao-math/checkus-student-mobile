import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  
  // Prevent multiple concurrent auth checks
  const isCheckingAuth = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Prevent multiple concurrent checks
      if (isCheckingAuth.current) {
        return;
      }
      
      isCheckingAuth.current = true;
      
      try {
        console.log('Starting authentication check...');
        
        // 페이지 로드 시에는 메모리에 액세스 토큰이 없으므로
        // 쿠키의 리프레시 토큰을 사용해서 액세스 토큰을 복구 시도
        const initSuccess = await authService.initializeFromRefreshToken();
        
        if (!initSuccess) {
          console.log('No valid refresh token found, setting unauthenticated state');
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        // 액세스 토큰이 복구되었으므로 사용자 정보 조회
        try {
          const response = await authService.getCurrentUser();
          if (response.success && response.data) {
            console.log('Authentication check successful');
            setIsAuthenticated(true);
            setUser(response.data);
          } else {
            console.warn('Invalid user response, clearing access token');
            authService.clearAccessToken();
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Error checking auth:', error);
          // 사용자 정보 조회 실패시 액세스 토큰 제거
          authService.clearAccessToken();
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
        isCheckingAuth.current = false;
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await authService.login(data);
      if (response.success && response.data) {
        const { accessToken } = response.data;
        authService.setAccessToken(accessToken);
        
        // Verify the token by getting user info
        try {
          const userResponse = await authService.getCurrentUser();
          if (userResponse.success && userResponse.data) {
            setIsAuthenticated(true);
            setUser(userResponse.data);
          } else {
            throw new Error('Failed to verify user session');
          }
        } catch (userError) {
          // Clear access token if user verification fails
          authService.clearAccessToken();
          throw new Error('Failed to verify user session');
        }
      } else {
        throw new Error(response.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      // Clear access token if login fails
      authService.clearAccessToken();
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    authService.clearAccessToken();
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