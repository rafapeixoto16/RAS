import axiosInstance from '../axiosConfig';

export const createProject = async (project: { name: string }, accessToken: string) => {
  try {
    const response = await axiosInstance.post('/api/v1/project/', project, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};