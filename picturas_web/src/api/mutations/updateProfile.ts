import axiosInstance from '../axiosConfig';

interface UpdateProfileData {
  fullName?: string;
  location?: string;
  bio?: string;
}

export const updateProfile = async (data: UpdateProfileData) => {
  try {
    const response = await axiosInstance.put('/api/v1/user/profile', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfilePic = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axiosInstance.put('/api/v1/user/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};