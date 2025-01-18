import axiosInstance from '../axiosConfig';

export const removeTool = async (projectId: string, toolIndex: number, accessToken: string) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/project/${projectId}/tool/${toolIndex}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};