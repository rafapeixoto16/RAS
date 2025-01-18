<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg p-6 w-96">
      <h2 class="text-2xl font-bold mb-4">{{ toolName }}</h2>
      <div v-for="(option, key) in toolOptions" :key="key" class="mb-4">
        <label :for="key" class="block text-sm font-medium text-gray-700 mb-1">
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
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          v-else-if="option.type === 'string' && option.pattern"
          :id="key"
          v-model="toolValues[key]"
          type="text"
          :pattern="option.pattern"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          v-else-if="option.type === 'string' && option.enum"
          :id="key"
          v-model="toolValues[key]"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option v-for="value in option.enum" :key="value" :value="value">
            {{ value }}
          </option>
        </select>
        <input
          v-else-if="option.type === 'boolean'"
          :id="key"
          v-model="toolValues[key]"
          type="checkbox"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>
      <div class="flex justify-end space-x-2 mt-6">
        <button @click="cancel" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
          Cancel
        </button>
        <button @click="apply" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
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
});

// Initialize toolValues with default values
for (const [key, option] of Object.entries(props.toolOptions)) {
  toolValues.value[key] = option.default ?? getDefaultValue(option.type);
}

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