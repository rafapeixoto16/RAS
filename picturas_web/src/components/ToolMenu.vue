<template>
    <div 
      class="absolute left-full ml-2 p-4 bg-white shadow-lg rounded-lg z-50 min-w-[200px] max-w-[300px]"
      :class="{ 
        'top-0': position === 'top',
        'bottom-0': position === 'bottom',
        'md:top-1/2 md:-translate-y-1/2': position === 'center'
      }"
    >
      <div class="relative">
        <div class="absolute left-[-8px] top-[50%] transform -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-white border-b-[8px] border-b-transparent"></div>
        
        <h4 class="font-medium text-gray-900 mb-3">{{ tool.name }}</h4>
        <div v-if="tool.options" class="space-y-3">
          <div v-for="(option, key) in tool.options" :key="key" class="flex flex-col">
            <label :for="key" class="text-sm text-gray-600 mb-1">{{ option.label }}:</label>
            <input 
              v-if="option.type === 'number'" 
              :id="key" 
              v-model.number="option.value" 
              type="number" 
              :min="option.min" 
              :max="option.max" 
              :step="option.step"
              class="w-full px-2 py-1 border border-gray-300 rounded-md"
            />
            <select 
              v-else-if="option.type === 'select'" 
              :id="key" 
              v-model="option.value"
              class="w-full px-2 py-1 border border-gray-300 rounded-md"
            >
              <option v-for="choice in option.choices" :key="choice" :value="choice">
                {{ choice }}
              </option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-2">
          <button 
            @click="$emit('cancel')" 
            class="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="$emit('apply', tool)" 
            class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  
  interface ToolOption {
    label: string;
    value: number | string;
    type: 'number' | 'select';
    min?: number;
    max?: number;
    step?: number;
    choices?: string[];
  }
  
  interface Tool {
    name: string;
    icon: string;
    options?: Record<string, ToolOption>;
  }
  
  defineProps<{
    tool: Tool;
    position: 'top' | 'center' | 'bottom';
  }>();
  
  defineEmits<{
    (e: 'apply', tool: Tool): void;
    (e: 'cancel'): void;
  }>();
  </script>  