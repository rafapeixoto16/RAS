import { defineStore } from 'pinia';
import { refreshAccessToken } from '@/api/mutations/accessToken';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  }),
  
  actions: {
    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    },

    clearTokens() {
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },

    async refreshAccessToken() {
      try {
        if (!this.refreshToken) {
          throw new Error('No refresh token available');
        }
        const newAccessToken = await refreshAccessToken(this.refreshToken);
        this.setTokens(newAccessToken, this.refreshToken);
        return newAccessToken;
      } catch (error) {
        this.clearTokens();
        throw error;
      }
    },
  },
});