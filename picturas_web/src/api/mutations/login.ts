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

export const loginSecondFactor = async (validationToken: string, twoFactorCode?: string) => {
  try {
    const payload: { validationToken: string; code?: string } = { validationToken };
    if (twoFactorCode) {
      payload.code = twoFactorCode;
    }

    const response = await axiosInstance.post('/api/v1/user/login/2', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginGuest = async () => {
  try {
    const response = await axiosInstance.post('/api/v1/user/guestLogin');
    return response.data;
  } catch (error) {
    throw error;
  }
};