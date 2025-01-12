import axiosInstance from '../axiosConfig';

interface ForgotPasswordData {
  email: string;
}

export const forgotPassword = async (data: ForgotPasswordData) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/passwordRecovery', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword2 = async (token: string, password: string) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/passwordRecovery/2', { validationToken: token, password: password });
    return response.data;
  } catch (error) {
    throw error;
  }
};