<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
    <div class="relative pb-[75%] sm:pb-2/3">
      <img 
        :src="project.imageUrl" 
        :alt="project.title"
        class="absolute h-full w-full object-cover"
      >
    </div>
    <div class="p-3 sm:p-4">
      <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{{ project.title }}</h3>
      <div class="flex justify-between items-center">
        <span class="text-xs sm:text-sm text-gray-500">{{ project.lastEdited }}</span>
        <div class="relative"> 
          <button 
            @click="$emit('edit', project.id)"
            class="px-2 py-1 sm:px-3 sm:py-1 bg-blue-500 text-white text-xs sm:text-sm rounded-full hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="bi bi-three-dots"></i>
          </button>
          <div 
            class="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <Dropdown 
              placement="right" 
              trigger="click" 
              :options="dropdownOptions" 
              append-to-body 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Dropdown from './CustomDropdown.vue';

interface Project {
  id: number;
  title: string;
  imageUrl: string;
  lastEdited: string;
}

// Props
defineProps<{
  project: Project;
  dropdownOptions: Array<{ label: string; icon: string; action?: () => void }>;
}>();

// Emits
defineEmits<{
  (e: 'edit', id: number): void;
}>();
</script>
