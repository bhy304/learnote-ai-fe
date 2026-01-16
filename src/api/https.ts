import { useAuthStore } from '@/store/authStore';
import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import authAPI from './auth.api';

type QueueItem = { resolve: (value: unknown) => void; reject: (error: unknown) => void };

interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const DEFAULT_TIMEOUT = 10000;
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

if (!import.meta.env.VITE_API_BASE_URL && import.meta.env.DEV) {
  console.warn(
    'VITE_API_BASE_URL 환경 변수가 설정되지 않았습니다. 기본값 http://localhost:3000을 사용합니다.',
  );
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 페이지 로드 시 3개의 API를 동시에 호출하고 3개 모두 401 에러가 나면, 서버에 refresh 요청을 3번 보냅니다.
// 이는 서버 부하를 일으키고 토큰 만료 정책에 따라 에러가 발생할 수 있습니다.
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('refreshToken이 존재하지 않습니다.');

        const { accessToken } = await authAPI.refresh({
          refreshToken,
        });
        useAuthStore.getState().setAuth(accessToken);

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        processQueue(error);
        useAuthStore.getState().clearAuth();
        window.location.replace('/login');
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

const https = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  },
  async post<T, R>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
    const response = await axiosInstance.post<R>(url, data, config);
    return response.data;
  },
  async put<T, R>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
    const response = await axiosInstance.put<R>(url, data, config);
    return response.data;
  },
  async patch<T, R>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
    const response = await axiosInstance.patch<R>(url, data, config);
    return response.data;
  },
  async delete<R>(url: string, config?: AxiosRequestConfig): Promise<R> {
    const response = await axiosInstance.delete<R>(url, config);
    return response.data;
  },
};

export default https;
