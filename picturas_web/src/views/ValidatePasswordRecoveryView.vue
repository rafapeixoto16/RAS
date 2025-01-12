<template>
    <div class="flex min-h-screen w-full bg-white">
        <div class="w-full flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div class="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div class="absolute bottom-0 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>
            <div class="w-full max-w-md relative z-10">
          <div class="text-center mb-10">
            <h1 class="text-4xl font-bold text-blue-600 mb-2">Reset Password</h1>
            <p class="text-blue-500">Enter your new password below</p>
          </div>
          <form @submit.prevent="resetPassword" class="space-y-6 backdrop-blur-sm bg-white bg-opacity-50 p-8 rounded-xl shadow-lg border border-white border-opacity-20">
            <div class="space-y-2">
                <label for="password" class="block text-sm font-medium text-blue-700">New Password</label>
                <input 
                    id="password"
                    v-model="password"
                    type="password"
                    placeholder="Enter your new password"
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
        </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { forgotPassword2 } from '@/api';
import router from '@/router';

const route = useRoute();

const loading = ref(true);
const error = ref('');
const password = ref('');

onMounted(async () => {
    const token = route.params.token as string;

    if (!token) {
        error.value = 'Invalid password recovery link';
        loading.value = false;
        return;
    }

    loading.value = false;
});

const resetPassword = async () => {
    const token = route.params.token as string;

    if (!token) {
        error.value = 'Invalid password recovery link';
        return;
    }
    try {
        await forgotPassword2(token, password.value);
        loading.value = false;
        router.push('/login')
    } catch {
        error.value = 'Password recovery validation failed. Please try again or contact support.';
        loading.value = false;
    }
};
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