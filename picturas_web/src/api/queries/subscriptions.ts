import axiosInstance from '../axiosConfig';

export const getPlans = async () => {
  const response = await axiosInstance.get('/api/v1/subscription/plans');
  return response.data;
};

export const getSubscriptionStatus = async (accessToken: string) => {
    const response = await axiosInstance.get('/api/v1/subscription/', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
};

export const getTransactionHistory = async (accessToken: string) => {
    const response = await axiosInstance.get('/api/v1/subscription/transactionHistory', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
};

export const getBillingInfo = async (accessToken: string) => {
    const response = await axiosInstance.get('/api/v1/subscription/billingInfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
};

