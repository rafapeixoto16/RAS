import axiosInstance from '../axiosConfig';

export const deleteProcess = async (projectId: string, accessToken: string) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/project/${projectId}/process`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};