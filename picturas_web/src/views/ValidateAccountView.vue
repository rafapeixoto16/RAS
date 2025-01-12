<template>
  <div class="flex min-h-screen w-full bg-white">
    <div class="w-full flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-0 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      <div class="max-w-md w-full space-y-8 relative z-10">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-blue-900">Account Validation</h2>
          <div v-if="loading" class="mt-2 text-center">
            <p class="text-blue-600">Validating your account...</p>
          </div>
          <div v-else-if="error" class="mt-2 text-center">
            <p class="text-red-500">{{ error }}</p>
          </div>
          <div v-else class="mt-2 text-center">
            <p class="text-green-500">Your account has been successfully validated.</p>
            <p class="mt-2 text-blue-600">You can now log in to your account.</p>
          </div>
        </div>
        <div class="mt-8 space-y-6">
          <div>
            <router-link to="/login" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Back to Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { validateAccount } from '@/api';

const route = useRoute();

const loading = ref(true);
const error = ref('');

onMounted(async () => {
  const token = route.params.token as string;
  
  if (!token) {
    error.value = 'Invalid validation link';
    loading.value = false;
    return;
  }

  try {
    await validateAccount(token);
    loading.value = false;
  } catch {
    error.value = 'Account validation failed. Please try again or contact support.';
    loading.value = false;
  }
});
</script>

<style scoped>
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(20px, -50px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.9); }
  75% { transform: translate(50px, 50px) scale(1.05); }
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
</style>