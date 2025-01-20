import axiosInstance from '../axiosConfig';

interface UpdateProfileData {
  name?: string;
  location?: string;
  bio?: string;
  email?: string;
  username?: string;
}


export const updateProfile = async (data: UpdateProfileData, accessToken: string) => {
  try {
    const response = await axiosInstance.put('/api/v1/user/', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfilePic = async (file: File, accessToken: string) => {
  try {
    const formData = new FormData();
    formData.append('profilePic', file);
    const response = await axiosInstance.put('/profilePic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};