import axiosInstance from '../axiosConfig';
import { useAuthStore } from '@/stores/authStore';

export const updateProject = async (id: number, project: { name: string }) => {
  const authStore = useAuthStore();
  try {
    const accessToken = authStore.accessToken;
    const response = await axiosInstance.put(`/api/v1/project/${id}`, project, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};