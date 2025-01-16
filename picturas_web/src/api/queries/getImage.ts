import axiosInstance from '../axiosConfig';
import { useAuthStore } from '@/stores/authStore';

export const getImage = async (projectId: string, imageIndex: number) => {
  const authStore = useAuthStore();
  try {
    const accessToken = authStore.accessToken;
    const response = await axiosInstance.get(`/api/v1/project/${projectId}/image/${imageIndex}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.imageUrl;
  } catch (error) {
    throw error;
  }
};