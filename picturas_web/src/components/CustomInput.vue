<template>
  <input
    :type="type"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :placeholder="placeholder"
    :class="[
      'w-full px-3 py-2 bg-white border border-blue-300 rounded-lg',
      'text-blue-900 placeholder-blue-400',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
    ]"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  type?: string;
  placeholder?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>