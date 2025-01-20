import axiosInstance from '../axiosConfig';

export const getProjects = async (accessToken: string) => {
  try {
    const response = await axiosInstance.get('/api/v1/project/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};