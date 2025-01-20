<template>
    <transition name="slide-fade">
      <div
        v-if="message"
        class="fixed top-4 left-1/4 md:left-1/2 transform bg-azure-radiance-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        style="will-change: transform;"
      >
        {{ message }}
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  defineProps<{
    message: string | null;
  }>();
  </script>
  
  <style scoped>
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.5s ease;
  }
  .slide-fade-enter-from {
    transform: translateY(-50%);
    opacity: 0;
  }
  .slide-fade-enter-to {
    transform: translateY(0);
    opacity: 1;
  }
  .slide-fade-leave-from {
    transform: translateY(0);
    opacity: 1;
  }
  .slide-fade-leave-to {
    transform: translateY(-50%);
    opacity: 0;
  }
  </style>