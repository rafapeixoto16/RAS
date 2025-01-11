import axiosInstance from '../axiosConfig';

export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/token', { refreshToken });
    return response.data;
  } catch (error) {
    throw error;
  }
};