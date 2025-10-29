import { Decks } from '@/apis/Decks';
import { Drops } from '@/apis/Drops';
import { Users } from '@/apis/Users';
import { Token } from '@/apis/data-contracts';
import type { AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Security Worker - 요청에 토큰 자동 추가
const securityWorker = async (): Promise<AxiosRequestConfig | void> => {
  const token = localStorage.getItem('access_token');
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
};

// Users API 인스턴스
export const usersApi = new Users({
  baseURL: API_BASE_URL,
  securityWorker,
});

// Decks API 인스턴스
export const decksApi = new Decks({
  baseURL: API_BASE_URL,
  securityWorker,
});

// Drops API 인스턴스
export const dropsApi = new Drops({
  baseURL: API_BASE_URL,
  securityWorker,
});

// 응답 인터셉터 - 토큰 만료 시 자동 갱신
usersApi.instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await usersApi.usersRefresh({
            refresh_token: refreshToken,
          });

          const data = response.data;
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);

          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return usersApi.instance(originalRequest);
        }
      } catch (refreshError) {
        // 갱신 실패 시 로그아웃
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Decks, Drops에도 같은 인터셉터 적용
decksApi.instance.interceptors.response.use(
  (response) => response,
  usersApi.instance.interceptors.response.handlers[0].rejected
);

dropsApi.instance.interceptors.response.use(
  (response) => response,
  usersApi.instance.interceptors.response.handlers[0].rejected
);

// 편의 API
export const authApi = {
  // 소셜 로그인
  socialLogin: async (provider: 'google' | 'apple' | 'native', idToken: string): Promise<Token> => {
    const response = await usersApi.usersLoginCreate(
      { provider } as any,
      { id_token: idToken }
    );
    return response.data;
  },

  // 토큰 갱신
  refreshToken: async (refreshToken: string): Promise<Token> => {
    const response = await usersApi.usersRefresh({
      refresh_token: refreshToken,
    });
    return response.data;
  },

  // 계정 탈퇴
  withdraw: async (): Promise<void> => {
    await usersApi.usersWithdraw();
  },
};

