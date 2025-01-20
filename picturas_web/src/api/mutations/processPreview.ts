import axiosInstance from '../axiosConfig';

export const processPreview = async (projectId: string, imageIdx: number, accessToken: string) => {
  try {
    const response = await axiosInstance.post(`/api/v1/project/${projectId}/preview`, {imageIdx: imageIdx}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};