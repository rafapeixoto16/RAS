import axiosInstance from '../axiosConfig';
import { useAuthStore } from '@/stores/authStore';

export const addImage = async (projectId: string, imageFile: File) => {
  const authStore = useAuthStore();
  try {
    const accessToken = authStore.accessToken;
    const formData = new FormData();
    formData.append('projectImage', imageFile);
    const response = await axiosInstance.post(`/api/v1/project/${projectId}/image`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};