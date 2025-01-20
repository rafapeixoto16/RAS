import axiosInstance from '../axiosConfig';

export const getProject = async (id: string, accessToken: string) => {
  try {
    const response = await axiosInstance.get(`/api/v1/project/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};