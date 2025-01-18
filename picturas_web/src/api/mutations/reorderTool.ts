import axiosInstance from '../axiosConfig';

export const reorderTool = async (projectId: string, oldIndex: number, newIndex: number, accessToken: string) => {
  try {
    const response = await axiosInstance.put(`/api/v1/project/${projectId}/tool/${oldIndex}`, {
      idxToolAfter: newIndex
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};