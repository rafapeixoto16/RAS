import axiosInstance from '../axiosConfig';
import { useAuthStore } from '@/stores/authStore';



export const signOut = async () => {
    try {
        const authStore = useAuthStore()
        const accessToken = authStore.accessToken;
        const response = await axiosInstance.delete('/api/v1/user/logout', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }});
        return response.data;
    } catch (error) {
        console.error(error)
        throw error;
    }
};
