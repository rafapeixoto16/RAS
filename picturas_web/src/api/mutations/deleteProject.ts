import axiosInstance from '../axiosConfig';

export const deleteProject = async (id: string, accessToken: string) => {
  try {
    await axiosInstance.delete(`/api/v1/project/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    throw error;
  }
};