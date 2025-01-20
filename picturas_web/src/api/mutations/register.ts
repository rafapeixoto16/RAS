import axiosInstance from '../axiosConfig';

interface RegisterData {
  name: string,
  username: string;
  email: string;
  password: string;
  migrate?: string;
}

export const register = async (data: RegisterData) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/register', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};