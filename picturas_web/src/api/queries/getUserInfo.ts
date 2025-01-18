import axiosInstance from '../axiosConfig';


export const getUserInfo = async (accessToken: string) => {
  try {
    const response = await axiosInstance.get('/api/v1/user/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};