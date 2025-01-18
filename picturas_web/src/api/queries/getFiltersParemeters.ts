import axiosInstance from '../axiosConfig';

export const getFiltersParemeters = async () => {
    try {
        const response = await axiosInstance.post('/api/v1/filters');
        return response.data;
    } catch (error) {
        throw error;
    }
};