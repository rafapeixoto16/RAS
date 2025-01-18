import axiosInstance from '../axiosConfig';


export const subscribe = async (interval: 'month' | 'year', accessToken: string) => {
    const response = await axiosInstance.post('/api/v1/subscription/subscribe', { interval }, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
};

export const cancelSubscription = async (accessToken: string) => {
    const response = await axiosInstance.delete('/api/v1/subscription/cancelSubscription', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
};