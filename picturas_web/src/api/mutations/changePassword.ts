import axiosInstance from '../axiosConfig';

export const changeUserPassword = async (password: string, accessToken: string) => {
  try {
    const response = await axiosInstance.put('/api/v1/user/password', {password: password}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};