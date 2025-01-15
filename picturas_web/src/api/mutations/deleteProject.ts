import axiosInstance from '../axiosConfig';
import { useAuthStore } from '@/stores/authStore';

export const deleteProject = async (id: number) => {
  const authStore = useAuthStore();
  try {
    const accessToken = authStore.accessToken;
    await axiosInstance.delete(`/api/v1/project/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    throw error;
  }
};