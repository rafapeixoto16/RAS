<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
    <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">{{ toolName }}</h2>
        <button 
          @click="cancel" 
          class="text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <i class="bi bi-x text-2xl"></i>
        </button>
      </div>
      
      <div class="space-y-6">
        <div v-for="(option, key) in toolOptions" :key="key" class="space-y-2">
          <label :for="key" class="block text-sm font-medium text-gray-700">
            {{ formatOptionName(key) }}
          </label>
          
          <input
            v-if="option.type === 'number'"
            :id="key"
            v-model.number="toolValues[key]"
            type="number"
            :min="option.minimum"
            :max="option.maximum"
            :step="1"
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          
          <input
            v-else-if="option.type === 'string' && option.pattern"
            :id="key"
            v-model="toolValues[key]"
            type="text"
            :pattern="option.pattern"
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          
          <select
            v-else-if="option.type === 'string' && option.enum"
            :id="key"
            v-model="toolValues[key]"
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="value in option.enum" :key="value" :value="value">
              {{ value }}
            </option>
          </select>
          
          <div 
            v-else-if="option.type === 'boolean'"
            class="flex items-center"
          >
            <input
              :id="key"
              v-model="toolValues[key]"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label :for="key" class="ml-2 text-sm text-gray-600">
              Enable
            </label>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-3 mt-8">
        <button 
          @click="cancel" 
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
        >
          Cancel
        </button>
        <button 
          @click="apply" 
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ToolOption } from '@/types/project';

interface Props {
  toolName: string;
  toolOptions: Record<string, ToolOption>;
}

const props = defineProps<Props>();
const emit = defineEmits(['apply', 'cancel']);

const toolValues = ref<Record<string, unknown>>({});

onMounted(() => {
  console.log('DynamicToolMenu mounted');
  console.log('Tool Name:', props.toolName);
  console.log('Tool Options:', props.toolOptions);
  
  for (const [key, option] of Object.entries(props.toolOptions)) {
    toolValues.value[key] = option.default ?? getDefaultValue(option.type);
  }
});

function getDefaultValue(type: string): number | string | boolean {
  switch (type) {
    case 'number': return 0;
    case 'string': return '';
    case 'boolean': return false;
    default: return '';
  }
}

const formatOptionName = (name: string) => {
  return name.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase());
};

const apply = () => {
  console.log('Applying tool:', props.toolName, 'with values:', toolValues.value);
  emit('apply', { name: props.toolName, args: toolValues.value });
};

const cancel = () => {
  console.log('Cancelling tool:', props.toolName);
  emit('cancel');
};
</script>