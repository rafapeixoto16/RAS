import { defineStore } from 'pinia';

interface User {
  username: string;
  email: string;
  avatarUrl: string;
}

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    setUser(user: User) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
    },
    updateUsername(username: string) {
      if (this.user) {
        this.user.username = username;
      }
    }
  },
});
