import { defineStore } from 'pinia';

interface User {
  username: string;
  email: string;
  avatarUrl: string;
}

const LOCAL_STORAGE_KEY = 'userStore';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) as string) as User | null,
  }),
  actions: {
    setUser(user: User) {
      this.user = user;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    },
    clearUser() {
      this.user = null;
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    },
    updateUsername(username: string) {
      if (this.user) {
        this.user.username = username;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.user));
      }
    }
  },
});
