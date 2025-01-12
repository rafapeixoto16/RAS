<template>
    <div class="relative w-full">
      <div 
        @click="toggleMenu"
        class="flex items-center justify-between cursor-pointer w-full p-4"
      >
        <div class="flex items-center">
          <i class="bi bi-person-circle text-4xl text-gray-400"></i>
          <div class="ml-4">
            <p class="text-gray-800 font-semibold">Username</p>
            <p class="text-gray-600 text-sm">user@example.com</p>
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

  import { ref, computed } from 'vue';
  import { useAuthStore } from '@/stores/authStore';
  import { useRouter } from 'vue-router';
  import { signOut} from '@/api/mutations/signout';

  const isLoggedIn = computed(() => authStore.isLoggedIn());
  const router = useRouter();
  const isMenuOpen = ref(false);
  
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
      router.push('/login');
    } catch (error) {
      console.log(error);
    }
  }

  </script>  