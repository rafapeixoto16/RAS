<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Preview Results</h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(item, filename) in previewData" :key="filename" class="border rounded p-4">
            <h3 class="text-lg font-semibold mb-2">{{ filename }}</h3>
            <div v-if="item.type === 'image'">
              <img :src="item.url" alt="Preview" class="max-w-full h-auto" />
            </div>
            <pre v-else-if="item.type === 'json'" class="bg-gray-100 p-2 rounded overflow-x-auto">{{ JSON.stringify(item.content, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { PreviewData } from '@/types/preview';
  
  defineProps<{
    previewData: PreviewData
  }>();
  
  defineEmits<{
    (e: 'close'): void
  }>();
  </script>