import axiosInstance from '../axiosConfig';
import { useAuthStore } from '@/stores/authStore';

export const createProject = async (project: { name: string }) => {
  const authStore = useAuthStore();
  try {
    const accessToken = authStore.accessToken;
    const response = await axiosInstance.post('/api/v1/project/', project, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};