import axiosInstance from '../axiosConfig';

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/login', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginSecondFactor = async (jwt: string, twoFactorCode: string) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/login/2', { jwt, twoFactorCode });
    return response.data;
  } catch (error) {
    throw error;
  }
};