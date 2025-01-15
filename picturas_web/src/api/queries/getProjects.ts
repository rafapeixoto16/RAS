import axiosInstance from '../axiosConfig';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore()

export const getProjects = async () => {
    try {
      const accessToken = authStore.accessToken;
      const response = await axiosInstance.get('/api/v1/project/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };