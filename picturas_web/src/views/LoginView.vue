<template>
    <div class="flex items-center justify-center min-h-screen w-full text-white bg-background">
        <div class="bg-[#1a1922] p-8 rounded-lg shadow-lg w-full max-w-lg md:w-1/2 lg:w-1/3 shadow-2xl shadow-[#5f59ee]/60">
            <h2 class="flex text-3xl text-[#5f59ee] font-bold mb-6 justify-center">Login</h2>
            <div class="mb-4">
            <label for="username" class="block mb-2 text-[#d1d1d1]">Username</label>
            <input type="text" id="username" v-model="username" class="w-full p-2 rounded border-none bg-[#2b2937] text-white focus:ring focus:ring-[#564fde]" />
            </div>
            <div class="mb-6 relative">
            <label for="password" class="block mb-2 text-[#d1d1d1]">Password</label>
            <div class="relative">
                <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" class="w-full p-2 rounded border-none bg-[#2b2937] text-white pr-10 focus:ring focus:ring-[#564fde]" />
                <button type="button" @click="toggleShowPassword" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#d1d1d1]">
                <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                </button>
            </div>
            </div>
            <button @click="login" class="w-full py-2 bg-[#5f59ee] text-white rounded hover:bg-[#564fde] transition">Sign In</button>
            <div class="flex justify-end mt-4 text-[#d1d1d1]">
            <a href="#" class="text-sm hover:underline">Forgot Password?</a>
            </div>
            <div class="flex justify-center mt-4 text-white text-sm space-x-1">
            <span>Don't have an account?</span> <router-link to="/register" class="text-sm text-[#5f59ee] hover:text-[#5f59ee] hover:underline"> Sign up</router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const showPassword = ref(false);

const toggleShowPassword = () => {
    showPassword.value = !showPassword.value;
};

const login = () => {
    console.log('Logging in:', username.value, password.value);
};
</script>

<style scoped>
.bg-background {
    background-image: url('../assets/endless-constellation.svg');
    background-size: cover;
    background-position: center;
}
</style>
