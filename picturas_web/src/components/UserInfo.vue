<template>
    <div class="space-y-4">
      <div v-for="(item, index) in infoItems" :key="index" class="flex items-center">
        <div class="w-24 text-gray-600 font-medium">{{ item.label }}:</div>
        <div class="flex-1">
          <input
            v-if="isEditing && item.editable"
            :value="item.value"
            @input="$emit('update', item.key, ($event.target as HTMLInputElement).value)"
            class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span v-else class="text-gray-800">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface InfoItem {
    label: string;
    value: string;
    key: string;
    editable: boolean;
  }
  
  defineProps<{
    infoItems: InfoItem[];
    isEditing: boolean;
  }>();
  
  defineEmits<{
    (e: 'update', key: string, value: string): void;
  }>();
  </script>  