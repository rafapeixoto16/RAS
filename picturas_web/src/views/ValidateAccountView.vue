<template>
    <div class="flex min-h-screen w-full bg-white justify-center items-center">
      <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 class="text-2xl font-bold text-center mb-4">Account Validation</h1>
        <p v-if="loading" class="text-center">Validating your account...</p>
        <p v-else-if="error" class="text-center text-red-500">{{ error }}</p>
        <p v-else class="text-center text-green-500">Your account has been successfully validated. You can now log in.</p>
        <div class="mt-4 text-center">
          <router-link to="/login" class="text-blue-600 hover:text-blue-800">Go to Login</router-link>
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