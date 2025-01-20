import axiosInstance from '../axiosConfig';
import { useAuthStore } from '@/stores/authStore';

export const reorderImage = async (projectId: string, imageIndex: number, newIndex: number) => {
  const authStore = useAuthStore();
  try {
    const accessToken = authStore.accessToken;
    const response = await axiosInstance.put(`/api/v1/project/${projectId}/image/${imageIndex}`, 
      { idxImageAfter: newIndex },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};