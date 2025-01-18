<template>
  <div class="relative group">
    <button 
      @click="$emit('click')"
      class="w-full p-2 md:p-3 flex flex-col items-center gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
      :disabled="disabled"
    >
      <i :class="['bi', icon, 'text-lg md:text-xl']"></i>
      <span class="text-xs font-medium md:block hidden">{{ name }}</span>
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
</script>