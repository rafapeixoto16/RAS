import axiosInstance from '../axiosConfig';

export const validateAccount = async (token: string) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/register/2', { validationToken: token });
    return response.data;
  } catch (error) {
    throw error;
  }
};