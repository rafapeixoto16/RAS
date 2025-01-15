<template>
  <div class="relative w-full">
    <div 
      @click="toggleMenu"
      class="flex items-center justify-between cursor-pointer w-full p-4"
    >
      <div class="flex items-center">
        <div v-if="!user.avatarUrl" class="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-blue-500 text-white text-2xl lg:text-3xl font-bold flex items-center justify-center uppercase shadow-lg">
          {{ user.username.charAt(0) }}
        </div>
        <img
          v-else
          :src="user.avatarUrl"
          :alt="user.username"
          class="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover border-2 border-blue-200 shadow-lg"
        />
        <div class="ml-4">
          <p class="text-gray-800 font-semibold">{{ user.username }}</p>
          <p class="text-gray-600 text-sm">{{ user.email }}</p>
        </div>
      </div>
      <i :class="['bi', isMenuOpen ? 'bi-chevron-down' : 'bi-chevron-up', 'text-gray-400']"></i>
    </div>
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-300"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-full opacity-0"
    >
      <div v-if="isMenuOpen" class="absolute bottom-full left-0 w-full bg-blue-50 border-t border-gray-200">
        <div class="p-4 space-y-2">
          <button 
            v-for="option in profileOptions" 
            :key="option.label"
            @click="handleOptionClick(option.action)"
            class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <i :class="[option.icon, 'mr-2']"></i>
            {{ option.label }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { signOut } from '@/api/mutations/signout';
import { getUserInfo } from '@/api';

const isLoggedIn = computed(() => authStore.isLoggedIn());
const router = useRouter();
const isMenuOpen = ref(false);

interface User {
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  location: string;
  bio: string;
}

const user = ref<User>({
  username: '',
  email: '',
  fullName: '',
  avatarUrl: '',
  location: '',
  bio: '',
});

onMounted(async () => {
  try {
    const resp = await getUserInfo();
    const filteredUser = {
      username: resp.username,
      email: resp.email,
      location: resp.location,
      bio: resp.bio,
      fullName: resp.name,
      avatarUrl: resp.avatarUrl || '',
    };
    user.value = filteredUser;
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
});

const profileOptions = [
  { label: 'Profile', icon: 'bi bi-person-circle', action: () => router.push('/profile') },
  { label: 'Settings', icon: 'bi bi-gear', action: () => router.push('/settings') },
  { label: 'Logout', icon: 'bi bi-box-arrow-right', action: () => handelSignOut() },
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleOptionClick = (action: () => void) => {
  action();
  isMenuOpen.value = false;
};

const authStore = useAuthStore();

const handelSignOut = async () => {
  try {
    console.log(isLoggedIn.value);
    if (!isLoggedIn.value) {
      return;
    }
    const response = await signOut();
    console.log(response);
    authStore.clearTokens();
    router.push('/');
  } catch (error) {
    console.log(error);
  }
};
</script>