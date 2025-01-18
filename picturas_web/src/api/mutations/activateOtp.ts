import axiosInstance from '../axiosConfig';

export const activateOtp = async (accessToken: string) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/otp', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};