<template>
    <div class="relative">
      <div
        v-if="imageUrl"
        class="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg"
      >
        <img
          :src="imageUrl"
          :alt="username"
          class="w-full h-full object-cover"
        />
      </div>
      <div
        v-else
        class="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center text-5xl font-bold text-white"
        :style="{ backgroundColor: avatarColor }"
      >
        {{ userInitial }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  interface Props {
    imageUrl?: string;
    username: string;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    imageUrl: '',
  });
  
  const userInitial = computed(() => props.username.charAt(0).toUpperCase());
  
  const avatarColor = computed(() => {
    const colors = [
      '#F87171', '#FB923C', '#FBBF24', '#34D399', '#60A5FA', '#818CF8', '#A78BFA', '#F472B6'
    ];
    const index = props.username.charCodeAt(0) % colors.length;
    return colors[index];
  });
  </script>  