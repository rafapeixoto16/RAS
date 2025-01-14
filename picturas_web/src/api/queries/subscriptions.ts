import axiosInstance from '../axiosConfig';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

export const getPlans = async () => {
  const response = await axiosInstance.get('/api/v1/subscription/plans');
  return response.data;
};

export const getSubscriptionStatus = async () => {
    const response = await axiosInstance.get('/api/v1/subscription', {
        headers: {
            Authorization: `Bearer ${authStore.accessToken}`
        }
    });
    return response.data;
};

export const getTransactionHistory = async () => {
    const response = await axiosInstance.get('/api/v1/subscription/transactionHistory', {
        headers: {
            Authorization: `Bearer ${authStore.accessToken}`
        }
    });
    return response.data;
};

export const getBillingInfo = async () => {
    const response = await axiosInstance.get('/api/v1/subscription/billingInfo', {
        headers: {
            Authorization: `Bearer ${authStore.accessToken}`
        }
    });
    return response.data;
};

