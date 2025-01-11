import axiosInstance from '../axiosConfig';

interface ForgotPasswordData {
  email: string;
}

export const forgotPassword = async (data: ForgotPasswordData) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/forgot-password', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};