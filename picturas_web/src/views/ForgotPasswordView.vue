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
            <h1 class="text-4xl font-bold text-blue-600 mb-2">Forgot Password</h1>
            <p class="text-blue-500">Enter your email to reset your password</p>
          </div>
          <form @submit.prevent="resetPassword" class="space-y-6 backdrop-blur-sm bg-white bg-opacity-50 p-8 rounded-xl shadow-lg border border-white border-opacity-20">
            <div class="space-y-2">
              <label for="email" class="block text-sm font-medium text-blue-700">Email</label>
              <input 
                id="email"
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="w-full px-3 py-2 bg-white bg-opacity-70 border border-blue-300 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            <button 
              type="submit" 
              class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              Reset Password
            </button>
          </form>
          <div class="mt-6 text-center">
            <p class="text-blue-500">
              Remember your password?
              <router-link to="/login" class="text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline ml-1">
                Sign in
              </router-link>
            </p>
          </div>
        </div>
      </div>
  
      <div class="hidden lg:block lg:w-1/2 bg-blue-50 relative overflow-hidden">
        <div class="absolute inset-0 bg-blue-900 opacity-20 z-10"></div>
        <div class="absolute inset-0 z-20 flex items-center justify-center">
          <img 
            src="https://picsum.photos/id/1005/800/600" 
            alt="Forgot Password" 
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-70"></div>
          <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 class="text-3xl font-bold mb-2">Reset Your Password</h2>
            <p class="text-xl">We'll help you get back to creating amazing designs</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { forgotPassword } from '@/api';
import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const email = ref('');
  const errorMessage = ref('');
  
  const resetPassword = async () => {
    try {
      errorMessage.value = '';
      await forgotPassword({email: email.value});

      router.push({ path: `/passwordRecovery-success/${email.value}` });

    } catch (error) {
      console.error('Error during password reset:', error);
      alert('An error occurred. Please try again.');
    }
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