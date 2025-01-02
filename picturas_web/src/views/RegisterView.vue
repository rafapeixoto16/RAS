<template>
  <div class="flex min-h-screen w-full bg-white">
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-0 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div class="absolute inset-0 animate-float">
          <div class="absolute top-1/4 left-1/4 w-12 h-12 bg-blue-400 rounded-lg rotate-45 opacity-20"></div>
          <div class="absolute top-3/4 right-1/4 w-16 h-16 bg-blue-300 rounded-full opacity-20"></div>
          <div class="absolute bottom-1/4 left-1/2 w-20 h-20 bg-blue-200 rounded-lg rotate-12 opacity-20"></div>
        </div>
      </div>

      <div class="w-full max-w-md relative z-10">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-bold text-blue-600 mb-2">Join Us</h1>
          <p class="text-blue-500">Create an account to start your creative journey</p>
        </div>
        <form @submit.prevent="register" class="space-y-6 backdrop-blur-sm bg-white bg-opacity-50 p-8 rounded-xl shadow-lg border border-white border-opacity-20">
          <div class="space-y-2">
            <label for="username" class="block text-sm font-medium text-blue-700">Username</label>
            <input 
              id="username"
              v-model="username"
              type="text"
              placeholder="Choose a username"
              class="w-full px-3 py-2 bg-white bg-opacity-70 border border-blue-300 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-blue-700">Email</label>
            <input 
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="w-full px-3 py-2 bg-white bg-opacity-70 border border-blue-300 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-blue-700">Password</label>
            <div class="relative">
              <input 
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Create a password"
                class="w-full px-3 py-2 bg-white bg-opacity-70 border border-blue-300 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <button 
                type="button" 
                @click="toggleShowPassword" 
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <label for="confirmPassword" class="block text-sm font-medium text-blue-700">Confirm Password</label>
            <div class="relative">
              <input 
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm your password"
                class="w-full px-3 py-2 bg-white bg-opacity-70 border border-blue-300 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <button 
                type="button" 
                @click="toggleShowConfirmPassword" 
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Create Account
          </button>
        </form>
        <div class="mt-6 text-center">
          <p class="text-blue-500">
            Already have an account?
            <router-link to="/login" class="text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline ml-1">
              Sign in
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <div class="hidden lg:block lg:w-1/2 bg-blue-50 relative overflow-hidden">
      <div class="absolute inset-0 bg-blue-900 opacity-20 z-10"></div>
      <div class="absolute inset-0 z-20">
        <div class="grid grid-cols-4 grid-rows-4 gap-2 h-full">
          <div 
            v-for="(image, index) in mosaicImages" 
            :key="image.id"
            class="relative overflow-hidden cursor-pointer group"
            @mouseenter="activateImage(index)"
            @mouseleave="deactivateImage(index)"
          >
            <img 
              :src="image.imageUrl" 
              :alt="image.title" 
              class="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
            <div 
              class="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"
            ></div>
            <div class="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 class="text-lg font-semibold">{{ image.title }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleShowConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const register = () => {
  console.log('Registering:', username.value, email.value, password.value, confirmPassword.value);
};

const mosaicImages = [
 { id: 1, title: 'Coastal Forest View', imageUrl: 'https://picsum.photos/id/10/800/600' },
 { id: 2, title: 'Snow-Capped Mountain Range', imageUrl: 'https://picsum.photos/id/29/800/600' },
 { id: 3, title: 'Water Droplets Macro', imageUrl: 'https://picsum.photos/id/41/800/600' },
 { id: 4, title: 'Purple Petunias', imageUrl: 'https://picsum.photos/id/152/800/600' },
 { id: 5, title: 'Golden Sunset Field', imageUrl: 'https://picsum.photos/id/110/800/600' },
 { id: 6, title: 'Pink Cherry Blossoms', imageUrl: 'https://picsum.photos/id/106/800/600' },
 { id: 7, title: 'Sunset Silhouette Portrait', imageUrl: 'https://picsum.photos/id/65/800/600' },
 { id: 8, title: 'Vintage Black Car', imageUrl: 'https://picsum.photos/id/111/800/600' },
 { id: 9, title: 'Desert Hills', imageUrl: 'https://picsum.photos/id/141/800/600' },
 { id: 10, title: 'Rustic Wood with Flowers', imageUrl: 'https://picsum.photos/id/143/800/600' },
 { id: 11, title: 'Autumn Maple Leaves', imageUrl: 'https://picsum.photos/id/167/800/600' },
 { id: 12, title: 'Sand Dunes at Dusk', imageUrl: 'https://picsum.photos/id/184/800/600' },
 { id: 13, title: 'Mountain Waterfall', imageUrl: 'https://picsum.photos/id/15/800/600' },
 { id: 14, title: 'Eiffel Tower Silhouette', imageUrl: 'https://picsum.photos/id/318/800/600' },
 { id: 15, title: 'Forest Path in Spring', imageUrl: 'https://picsum.photos/id/324/800/600' },
 { id: 16, title: 'Airport Silhouette', imageUrl: 'https://picsum.photos/id/331/800/600' },
];

const activateImage = (index: number) => {
  console.log('Image activated:', mosaicImages[index].title);
};

const deactivateImage = (index: number) => {
  console.log('Image deactivated:', mosaicImages[index].title);
};
</script>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -50px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  75% {
    transform: translate(50px, 50px) scale(1.05);
  }
}

.animate-blob {
  animation: blob 20s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(0) rotate(-5deg);
  }
  75% {
    transform: translateY(20px) rotate(5deg);
  }
}

.animate-float {
  animation: float 15s infinite;
}
</style>