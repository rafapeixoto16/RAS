import axiosInstance from '../axiosConfig';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore()

export const getUserInfo = async () => {
  try {
    const accessToken = authStore.accessToken;
    const response = await axiosInstance.get('/api/v1/user/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};