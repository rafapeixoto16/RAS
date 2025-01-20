<template>
  <div class="relative group">
    <button 
      @click="$emit('click')"
      class="w-full p-3 flex items-center gap-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
      :disabled="disabled"
    >
      <i :class="['bi', icon, 'text-xl']"></i>
      <span class="text-sm font-medium hidden md:block">{{ formatOptionName(name) }}</span>
      <div class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none md:hidden">
        {{ formatOptionName(name) }}
      </div>
    </button>
    
    <DynamicToolMenu
      v-if="showMenu && options"
      :toolName="name"
      :toolOptions="options"
      @apply="$emit('apply', $event)"
      @cancel="$emit('cancel')"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import DynamicToolMenu from './DynamicToolMenu.vue';

interface ToolOption {
  type: string;
  default?: number | string | boolean;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  enum?: string[];
}

interface Props {
  name: string;
  icon: string;
  options?: Record<string, ToolOption>;
  showMenu: boolean;
  menuPosition: 'top' | 'center' | 'bottom';
  disabled?: boolean;
}

defineProps<Props>();

defineEmits<{
  (e: 'click'): void;
  (e: 'apply', tool: { name: string; args: Record<string, unknown> }): void;
  (e: 'cancel'): void;
}>();

const formatOptionName = (name: string): string => {
  const acronyms = ['OCR', 'PDF', 'RGB', 'URL', 'API'];
  let formatted = name.replace(/-/g, ' ');
  formatted = formatted.replace(/([A-Z])/g, ' $1');
  const words = formatted.trim().split(/\s+/);
  
  const formattedWords = words.map(word => {
    if (acronyms.includes(word.toUpperCase())) {
      return word.toUpperCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  
  return formattedWords.join(' ');
};
</script>

<style scoped>
@media (max-width: 768px) {
  .group:hover .absolute {
    display: block;
  }
}
</style>