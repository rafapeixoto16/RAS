import axiosInstance from '../axiosConfig';

export const getImage = async (projectId: string, imageIndex: number, accessToken: string) => {
  try {
    const response = await axiosInstance.get(`/api/v1/project/${projectId}/image/${imageIndex}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.imageUrl;
  } catch (error) {
    throw error;
  }
};