import axiosInstance from '../axiosConfig';
import { useAuthStore } from '@/stores/authStore';

interface UpdateProfileData {
  name?: string;
  location?: string;
  bio?: string;
  email?: string;
  username?: string;
}

const authStore = useAuthStore()

export const updateProfile = async (data: UpdateProfileData) => {
  try {
    const accessToken = authStore.accessToken;
    const response = await axiosInstance.put('/api/v1/user/', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfilePic = async (file: File) => {
  try {
    const accessToken = authStore.accessToken;
    const formData = new FormData();
    formData.append('profilePic', file);
    const response = await axiosInstance.put('/profilePic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};