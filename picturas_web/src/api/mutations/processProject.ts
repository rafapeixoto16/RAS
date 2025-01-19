import axiosInstance from '../axiosConfig';

export const processProject = async (projectId: string, accessToken: string) => {
  try {
    const response = await axiosInstance.post(`/api/v1/project/${projectId}/process`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};