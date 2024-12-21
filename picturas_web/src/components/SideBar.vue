<template>
    <div class="flex h-screen">
        <!-- Sidebar with fixed width -->
        <div class="fixed left-0 flex flex-col items-center w-16 h-full bg-[#0c0b11] text-gray-400">
            <router-link class="flex items-center justify-center mt-3" to="/">
                <img src="../../picturas.png" alt="Logo" class="w-14 h-14" />
            </router-link>
            <div class="flex flex-col items-center mt-12 space-y-8">
                <router-link class="flex items-center justify-center w-12 h-12" to="/" @click.native="selectOption(1)">
                    <i :class="['bi bi-house-door-fill text-3xl', { 'text-[#5f59ee]': selected === 1, 'text-[#47464f]': selected !== 1 }]"></i>
                </router-link>
                <router-link class="flex items-center justify-center w-12 h-12" to="/projects" @click.native="selectOption(2)">
                    <i :class="['bi bi-folder-fill text-3xl', { 'text-[#5f59ee]': selected === 2, 'text-[#47464f]': selected !== 2 }]"></i>
                </router-link>
                <router-link class="flex items-center justify-center w-12 h-12" to="/settings" @click.native="selectOption(3)">
                    <i :class="['bi bi-gear-fill text-3xl', { 'text-[#5f59ee]': selected === 3, 'text-[#47464f]': selected !== 3 }]"></i>
                </router-link>
            </div>
            <router-link class="flex items-center justify-center w-12 h-12 mt-auto" to="/profile">
                <i class="bi bi-person-circle text-3xl text-gray-400 hover:text-[#5f59ee]"></i>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selected = ref(1);

function selectOption(option) {
        selected.value = option;
}
</script>
