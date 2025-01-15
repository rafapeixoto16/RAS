<template>
  <div class="bg-blue-50">
    <div 
      @click="toggleMenu"
      class="flex items-center cursor-pointer"
    >
      <div v-if="!user.avatarUrl" class="w-10 h-10 rounded-full bg-blue-500 text-white text-xl font-bold flex items-center justify-center uppercase shadow-lg">
        {{ user.username.charAt(0) }}
      </div>
      <img
        v-else
        :src="user.avatarUrl"
        :alt="user.username"
        class="w-10 h-10 rounded-full object-cover border-2 border-blue-200 shadow-lg"
      />
      <div class="ml-4">
        <p class="text-gray-800 font-semibold">{{ user.username }}</p>
        <p class="text-gray-600 text-sm">{{ user.email }}</p>
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
  import { ref, computed, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/authStore';
  import { useRouter } from 'vue-router';
  import { signOut} from '@/api/mutations/signout';
  import { getUserInfo } from '@/api';

  const authStore = useAuthStore();
  const isLoggedIn = computed(() => authStore.isLoggedIn());
  
  const emit = defineEmits<{
    (e: 'close-menu'): void;
  }>();
  
  const router = useRouter();
  
  const isMenuOpen = ref(false);
  const show = ref(false);

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
  }
  
  const handleOptionClick = (action: () => void) => {
    action();
    closeMenu();
    emit('close-menu');
  };
  </script>
  