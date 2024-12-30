<template>
    <div :class="['relative', placement]">
        <span @click="toggleDropdown" class="cursor-pointer">
            <i v-if="isIcon" :class="trigger"></i>
            <span v-else>{{ trigger }}</span>
        </span>
        <transition name="dropdown">
            <div v-if="isOpen" class="absolute bg-[#1a1a2e] shadow-md rounded mt-2 border border-[#2C293C] z-50">
                <ul>
                    <li 
                        v-for="option in options" 
                        :key="option.label" 
                        class="flex items-center gap-2 px-4 py-2 hover:bg-[#141428] cursor-pointer"
                    >
                        <i v-if="option.icon" :class="option.icon"></i>
                        <span>{{ option.label }}</span>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Option {
    label: string;
    icon?: string;
}

interface Props {
    placement: 'right' | 'left' | 'top' | 'bottom';
    trigger: string;
    options: Option[];
    isIcon?: boolean;
}

const props = defineProps<Props>();

const isOpen = ref(false);

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.relative.bottom .absolute {
    top: calc(100% + 8px);
    left: 0;
}

.relative.top .absolute {
    bottom: calc(100% + 8px);
    left: 0;
}

.relative.left .absolute {
    top: 0;
    right: calc(100% + 8px);
}

.relative.right .absolute {
    top: 0;
    left: calc(100% + 8px);
}

.dropdown-enter-active, .dropdown-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.dropdown-enter-from, .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>