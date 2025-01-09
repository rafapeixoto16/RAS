<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-end justify-center">
      <div 
        class="bg-white w-full max-w-md rounded-t-xl p-4 transform transition-transform duration-300 ease-in-out"
        :class="{ 'translate-y-0': show, 'translate-y-full': !show }"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Project Options</h3>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <button 
            @click="$emit('open-new-tab', props.projectId)"
            class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
          >
            <i class="bi bi-box-arrow-up-right mr-2"></i>
            Open in new tab
          </button>
          <button
            @click="$emit('rename', props.projectId)"
            class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
          >
            <i class="bi bi-pencil mr-2"></i>
            Rename
        </button>
          <button 
            @click="$emit('move-to-trash', props.projectId)"
            class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-red-500"
          >
            <i class="bi bi-trash mr-2"></i>
            Move to Trash
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  
  const props = defineProps<{
    projectId: number;
  }>();
  
  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'open-new-tab', id: number): void;
    (e: 'rename', id: number): void;
    (e: 'move-to-trash', id: number): void;
  }>();
  
  const show = ref(false);
  
  onMounted(() => {
    setTimeout(() => {
      show.value = true;
    }, 50);
  });
  </script>
  
  