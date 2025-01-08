<template>
    <div class="relative group">
      <button 
        @click="$emit('click')"
        class="w-full p-3 flex flex-col items-center gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
      >
        <i :class="['bi', icon, 'text-xl']"></i>
        <span class="text-xs font-medium">{{ name }}</span>
      </button>
      
      <div 
        class="absolute left-full ml-2 p-3 bg-white shadow-lg rounded-lg hidden group-hover:block z-50 min-w-[200px]"
        style="transform: translateY(-25%)"
      >
        <div class="relative">
          <div class="absolute left-[-8px] top-[50%] transform -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-white border-b-[8px] border-b-transparent"></div>
          
          <h4 class="font-medium text-gray-900 mb-2">{{ name }}</h4>
          <div v-if="options" class="space-y-2">
            <div v-for="(option, key) in options" :key="key" class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ option.label }}:</span>
              <span class="text-sm font-medium">{{ option.value }}{{ option.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Option {
    label: string;
    value: number | string;
    unit?: string;
  }
  
  interface Props {
    name: string;
    icon: string;
    options?: Record<string, Option>;
  }
  
  defineProps<Props>();
  
  defineEmits<{
    (e: 'click'): void;
  }>();
  </script>
  
  <style scoped>
  .group:hover .hidden {
    display: block;
  }
  </style>  