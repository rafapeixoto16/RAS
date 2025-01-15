import axiosInstance from '../axiosConfig';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

export const subscribe = async (interval: 'month' | 'year') => {
    const accessToken = authStore.accessToken;
    const response = await axiosInstance.post('/api/v1/subscription/subscribe', { interval }, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
};

export const cancelSubscription = async () => {
    const accessToken = authStore.accessToken;
    const response = await axiosInstance.delete('/api/v1/subscription/cancelSubscription', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
};