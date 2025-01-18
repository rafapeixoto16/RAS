import axiosInstance from '../axiosConfig';

export const updateProject = async (id: string, project: { name: string }, accessToken: string) => {
  try {
    const response = await axiosInstance.put(`/api/v1/project/${id}`, project, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};