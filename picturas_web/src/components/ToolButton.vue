<template>
  <div class="relative group">
    <button 
      @click="$emit('click')"
      class="w-full p-2 md:p-3 flex flex-col items-center gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
    >
      <i :class="['bi', icon, 'text-lg md:text-xl']"></i>
      <span class="text-xs font-medium md:block hidden">{{ name }}</span>
    </button>
    
    <ToolMenu
      v-if="showMenu && options"
      :tool="{ name, icon, options }"
      :position="menuPosition"
      @apply="$emit('apply', $event)"
      @cancel="$emit('cancel')"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import ToolMenu from './ToolMenu.vue';

interface ToolOption {
  label: string;
  value: number | string;
  type: 'number' | 'select';
  min?: number;
  max?: number;
  step?: number;
  choices?: string[];
}

export interface Tool {
  name: string;
  icon: string;
  options?: Record<string, ToolOption>;
}

interface Props {
  name: string;
  icon: string;
  options?: Record<string, ToolOption>;
  showMenu: boolean;
  menuPosition: 'top' | 'center' | 'bottom';
}

defineProps<Props>();

defineEmits<{
  (e: 'click'): void;
  (e: 'apply', tool: Tool): void;
  (e: 'cancel'): void;
}>();
</script>