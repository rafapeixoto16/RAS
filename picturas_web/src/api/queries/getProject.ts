import axiosInstance from '../axiosConfig';
import { useAuthStore } from '@/stores/authStore';

export const getProject = async (id: number) => {
  const authStore = useAuthStore();
  try {
    const accessToken = authStore.accessToken;
    const response = await axiosInstance.get(`/api/v1/project/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};