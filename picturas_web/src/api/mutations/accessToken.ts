import axiosInstance from '../axiosConfig';

export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  try {
    const response = await axiosInstance.post('/api/v1/user/token', { refreshToken : refreshToken });
    return response.data.accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};
