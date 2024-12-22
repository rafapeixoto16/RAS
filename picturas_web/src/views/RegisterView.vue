<template>
    <div class="flex items-center justify-center min-h-screen w-full text-white bg-background">
        <div class="bg-[#1a1922] p-8 rounded-lg shadow-lg w-full max-w-lg md:w-1/2 lg:w-1/3 shadow-2xl shadow-[#5f59ee]/60">
            <h2 class="flex text-3xl text-[#5f59ee] font-bold mb-6 justify-center">Register</h2>
            <div class="mb-4">
                <label for="username" class="block mb-2 text-[#d1d1d1]">Username</label>
                <input type="text" id="username" v-model="username" class="w-full p-2 rounded border-none bg-[#2b2937] text-white focus:ring focus:ring-[#564fde]" />
            </div>
            <div class="mb-4">
                <label for="email" class="block mb-2 text-[#d1d1d1]">Email</label>
                <input type="email" id="email" v-model="email" class="w-full p-2 rounded border-none bg-[#2b2937] text-white focus:ring focus:ring-[#564fde]" />
            </div>
            <div class="mb-4 relative">
                <label for="password" class="block mb-2 text-[#d1d1d1]">Password</label>
                <div class="relative">
                    <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" class="w-full p-2 rounded border-none bg-[#2b2937] text-white pr-10 focus:ring focus:ring-[#564fde]" />
                    <button type="button" @click="toggleShowPassword" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#d1d1d1]">
                        <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                    </button>
                </div>
            </div>
            <div class="mb-6 relative">
                <label for="confirmPassword" class="block mb-2 text-[#d1d1d1]">Confirm Password</label>
                <div class="relative">
                    <input :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" v-model="confirmPassword" class="w-full p-2 rounded border-none bg-[#2b2937] text-white pr-10 focus:ring focus:ring-[#564fde]" />
                    <button type="button" @click="toggleShowConfirmPassword" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#d1d1d1]">
                        <i :class="showConfirmPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                    </button>
                </div>
            </div>
            <button @click="register" class="w-full py-2 bg-[#5f59ee] text-white rounded hover:bg-[#564fde] transition">Register</button>
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
</script>

<style scoped>
.bg-background {
    background-image: url('../assets/endless-constellation.svg');
    background-size: cover;
    background-position: center;
}
</style>
