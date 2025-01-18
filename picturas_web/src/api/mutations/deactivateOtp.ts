import axiosInstance from '../axiosConfig';

export const deactivateOtp = async (accessToken: string) => {
  try {
    const response = await axiosInstance.delete('/api/v1/user/otp', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};