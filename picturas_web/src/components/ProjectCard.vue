<template>
    <div class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
      <div class="relative pb-2/3">
        <img 
          :src="project.imageUrl" 
          :alt="project.title"
          class="absolute h-full w-full object-cover"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ project.title }}</h3>
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-500">Last edited: {{ project.lastEdited }}</span>
          <button 
                    @click="$emit('edit', project.id)"
                    class="px-3 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-colors duration-300"
                >
                    <i class="bi bi-pencil"></i>
            </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Project {
    id: number;
    title: string;
    imageUrl: string;
    lastEdited: string;
  }
  
  defineProps<{
    project: Project;
  }>();
  
  defineEmits<{
    (e: 'edit', id: number): void;
  }>();
  </script>
  
  <style scoped>
  .pb-2\/3 {
    padding-bottom: 66.666667%;
  }
  </style>  