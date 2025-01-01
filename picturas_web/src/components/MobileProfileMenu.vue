<template>
    <div>
      <div 
        @click="toggleMenu"
        class="flex items-center cursor-pointer"
      >
        <i class="bi bi-person-circle text-4xl text-gray-400"></i>
        <div class="ml-4">
          <p class="text-gray-800 font-semibold">Username</p>
          <p class="text-gray-600 text-sm">user@example.com</p>
        </div>
      </div>
      <div 
        v-if="isMenuOpen"
        class="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 rounded-t-xl transform transition-transform duration-300 ease-in-out z-30"
        :class="{ 'translate-y-0': show, 'translate-y-full': !show }"
      >
        <div class="p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Profile Options</h3>
            <button @click="closeMenu" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <button 
              v-for="option in profileOptions" 
              :key="option.label"
              @click="handleOptionClick(option.action)"
              class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
            >
              <i :class="option.icon + ' mr-2'"></i>
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const emit = defineEmits<{
    (e: 'close-menu'): void;
  }>();
  
  const router = useRouter();
  
  const isMenuOpen = ref(false);
  const show = ref(false);
  
  const profileOptions = [
    { label: 'Profile', icon: 'bi bi-person-circle', action: () => router.push('/profile') },
    { label: 'Settings', icon: 'bi bi-gear', action: () => console.log('Settings clicked') },
    { label: 'Logout', icon: 'bi bi-box-arrow-right', action: () => console.log('Logout clicked') },
  ];
  
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
    if (isMenuOpen.value) {
      setTimeout(() => {
        show.value = true;
      }, 50);
    } else {
      show.value = false;
    }
  };
  
  const closeMenu = () => {
    show.value = false;
    setTimeout(() => {
      isMenuOpen.value = false;
    }, 300);
  };
  
  const handleOptionClick = (action: () => void) => {
    action();
    closeMenu();
    emit('close-menu');
  };
  </script>
  