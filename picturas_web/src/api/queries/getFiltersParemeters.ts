import axiosInstance from '../axiosConfig';

export const getFiltersParemeters = async (accessToken: string) => {
    try {
        const response = await axiosInstance.get('/api/v1/filters', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};