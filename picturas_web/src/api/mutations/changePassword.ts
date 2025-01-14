import axiosInstance from '../axiosConfig';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore()

export const changeUserPassword = async (password: string) => {
  try {
    const accessToken = authStore.accessToken;
    const response = await axiosInstance.put('/api/v1/user/password', {password: password}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};