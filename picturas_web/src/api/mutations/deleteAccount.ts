import axiosInstance from '../axiosConfig';

export const deleteAccount = async (accessToken: string) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/user/deleteAccount`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};