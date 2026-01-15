import { useAuthStore } from '@/store/authStore';
import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';

const DEFAULT_TIMEOUT = 10000;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

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
  (error: AxiosError) => Promise.reject(error),
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
  async delete<R>(url: string, config?: AxiosRequestConfig): Promise<R> {
    const response = await axiosInstance.delete<R>(url, config);
    return response.data;
  },
};

export default https;
