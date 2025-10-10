'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { mockAuthApi } from '@/lib/mock-api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 초기 로드 시 사용자 정보 확인
    const checkAuth = async () => {
      try {
        const currentUser = await mockAuthApi.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginWithGoogle = async () => {
    try {
      // Mock Google OAuth - 실제로는 리다이렉트
      const { user } = await mockAuthApi.loginWithGoogle('mock_google_code');
      setUser(user);
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };

  const loginWithGithub = async () => {
    try {
      // Mock GitHub OAuth - 실제로는 리다이렉트
      const { user } = await mockAuthApi.loginWithGithub('mock_github_code');
      setUser(user);
    } catch (error) {
      console.error('GitHub login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await mockAuthApi.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithGoogle,
        loginWithGithub,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
