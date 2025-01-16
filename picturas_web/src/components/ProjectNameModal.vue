<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
        <h2 class="text-xl font-bold mb-4">Create New Project</h2>
        <input
          v-model="projectName"
          type="text"
          placeholder="Enter project name"
          class="w-full p-2 border border-gray-300 rounded mb-4"
          @keyup.enter="createProject"
        />
        <div class="flex justify-end space-x-2">
          <button
            @click="cancel"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            @click="createProject"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  defineProps<{
    isOpen: boolean
  }>();
  
  const emit = defineEmits<{
    (e: 'create', projectName: string): void
    (e: 'cancel'): void
  }>();
  
  const projectName = ref('');
  
  const createProject = () => {
    if (projectName.value.trim()) {
      emit('create', projectName.value.trim());
      projectName.value = '';
    }
  };
  
  const cancel = () => {
    projectName.value = '';
    emit('cancel');
  };
  </script>  