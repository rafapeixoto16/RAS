<template>
  <div class="flex min-h-screen w-full bg-white">
    <div class="hidden lg:block lg:w-1/2 relative overflow-hidden">
      <div class="absolute inset-0 bg-blue-900 opacity-20 z-10"></div>
      <transition-group 
        name="fade" 
        tag="div" 
        class="relative w-full h-full"
      >
        <img 
          v-for="(image, index) in carouselImages" 
          :key="image.id"
          :src="image.imageUrl" 
          :alt="image.title"
          v-show="currentImageIndex === index"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
        />
      </transition-group>
      <div class="absolute bottom-0 left-0 right-0 p-6 text-white z-20 bg-gradient-to-t from-blue-900 to-transparent">
      </div>
    </div>
    
    <!-- Right side - Login form with enhanced visual elements -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-0 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <!-- Floating shapes -->
        <div class="absolute inset-0 animate-float">
          <div class="absolute top-1/4 left-1/4 w-12 h-12 bg-blue-400 rounded-lg rotate-45 opacity-20"></div>
          <div class="absolute top-3/4 right-1/4 w-16 h-16 bg-blue-300 rounded-full opacity-20"></div>
          <div class="absolute bottom-1/4 left-1/2 w-20 h-20 bg-blue-200 rounded-lg rotate-12 opacity-20"></div>
        </div>
      </div>

      <!-- Login form container -->
      <div class="w-full max-w-md relative z-10">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-bold text-blue-600 mb-2">Welcome Back</h1>
          <p class="text-blue-500">Sign in to continue your creative journey</p>
        </div>
        <form @submit.prevent="login" class="space-y-6 backdrop-blur-sm bg-white bg-opacity-50 p-8 rounded-xl shadow-lg border border-white border-opacity-20">
          <div class="space-y-2">
            <label for="username" class="block text-sm font-medium text-blue-700">Username</label>
            <input 
              id="username"
              v-model="username"
              type="text"
              placeholder="Enter your username"
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
                placeholder="Enter your password"
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
          <button 
            type="submit" 
            class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Sign In
          </button>
        </form>
        <div class="mt-6 flex items-center justify-between">
          <div class="text-sm">
            <a href="#" class="text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline">Forgot Password?</a>
          </div>
          <div class="text-sm">
            <router-link to="/register" class="text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline">
              Create an account
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const username = ref('');
const password = ref('');
const showPassword = ref(false);

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const login = () => {
  console.log('Logging in:', username.value, password.value);
  // Implement login logic here
};

const carouselImages = [
  { id: 1, title: 'Beautiful Nature', imageUrl: 'https://picsum.photos/id/24/3840/2160' },
  { id: 2, title: 'Mountain Sunset', imageUrl: 'https://picsum.photos/id/17/3840/2160' },
  { id: 3, title: 'City Skyline', imageUrl: 'https://picsum.photos/id/32/3840/2160' },
  { id: 4, title: 'Calm Beach', imageUrl: 'https://picsum.photos/id/19/3840/2160' },
  { id: 5, title: 'Forest Pathway', imageUrl: 'https://picsum.photos/id/55/3840/2160' },
  { id: 6, title: 'Sunny Day', imageUrl: 'https://picsum.photos/id/63/3840/2160' },
  { id: 7, title: 'Snowy Peaks', imageUrl: 'https://picsum.photos/id/71/3840/2160' },
  { id: 8, title: 'Desert Dunes', imageUrl: 'https://picsum.photos/id/82/3840/2160' },
];

const currentImageIndex = ref(0);
let carouselInterval: number | null = null;

const rotateCarousel = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % carouselImages.length;
};

onMounted(() => {
  carouselInterval = setInterval(rotateCarousel, 5000);
});

onUnmounted(() => {
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

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