'use client';

import { authApi } from '@/lib/api-client';
import { auth, googleProvider } from '@/lib/firebase';
import { User } from '@/types';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Firebase User를 앱 User 타입으로 변환
function convertFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    username: firebaseUser.displayName || 'Anonymous',
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || '',
    avatarUrl: firebaseUser.photoURL || null,
    bio: null,
    emailVerified: firebaseUser.emailVerified,
    createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Firebase Auth 상태 변화 감지
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser) => {
      if (firebaseUser) {
        // 토큰이 있는지 확인
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
          // 토큰이 없으면 Firebase ID Token으로 백엔드 토큰 받기
          try {
            const idToken = await firebaseUser.getIdToken();
            const tokenData = await authApi.socialLogin('google', idToken);

            localStorage.setItem('access_token', tokenData.access_token);
            localStorage.setItem('refresh_token', tokenData.refresh_token);
            localStorage.setItem('user_id', tokenData.user_id.toString());
          } catch (error) {
            console.error('Failed to get backend token:', error);
          }
        }

        setUser(convertFirebaseUser(firebaseUser));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      // 1. Firebase로 로그인
      const result = await signInWithPopup(auth, googleProvider);

      // 2. Firebase ID Token 가져오기
      const idToken = await result.user.getIdToken();

      // 3. 백엔드로 ID Token 전송하여 JWT 토큰 받기
      const tokenData = await authApi.socialLogin('google', idToken);

      // 4. 토큰 저장
      localStorage.setItem('access_token', tokenData.access_token);
      localStorage.setItem('refresh_token', tokenData.refresh_token);
      localStorage.setItem('user_id', tokenData.user_id.toString());

      // 5. 사용자 정보 설정
      setUser(convertFirebaseUser(result.user));
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };

  const loginWithGithub = async () => {
    try {
      // GitHub 로그인은 Firebase Console에서 추가 설정 필요
      throw new Error('GitHub login not configured yet');
    } catch (error) {
      console.error('GitHub login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Firebase 로그아웃
      await signOut(auth);

      // 로컬 스토리지 토큰 제거
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_id');

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
