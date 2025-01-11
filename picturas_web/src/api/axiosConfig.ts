import axios, { AxiosError, type InternalAxiosRequestConfig as OriginalInternalAxiosRequestConfig } from 'axios';
interface InternalAxiosRequestConfig extends OriginalInternalAxiosRequestConfig {
    _retry?: boolean;
  }
import { useAuthStore } from '@/stores/authStore';

const baseURL = 'http://192.168.49.2:80';

const axiosInstance = axios.create({
    baseURL,
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const authStore = useAuthStore();
      if (authStore.accessToken) {
        config.headers['Authorization'] = `Bearer ${authStore.accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );
  
  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && originalRequest && !(originalRequest as InternalAxiosRequestConfig)._retry) {
        (originalRequest as InternalAxiosRequestConfig)._retry = true;
        
        try {
          const authStore = useAuthStore();
          const newAccessToken = await authStore.refreshAccessToken();
          
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // If refresh fails, clear tokens and redirect to login
          const authStore = useAuthStore();
          authStore.clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

export default axiosInstance;
