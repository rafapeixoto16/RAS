import axiosInstance from '../axiosConfig';

export const addTool = async (projectId: string, toolData: { filterName: string; args: Record<string, unknown> }, accessToken: string) => {
  try {
    const response = await axiosInstance.post(`/api/v1/project/${projectId}/tool`, toolData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};