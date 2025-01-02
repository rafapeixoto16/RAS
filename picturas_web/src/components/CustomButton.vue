<template>
  <button
    :class="[
      'w-full py-2 px-4 rounded-lg font-semibold transition duration-200 ease-in-out transform hover:scale-105',
      variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
    ]"
    :type="type"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
}>(), {
  variant: 'primary',
  type: 'button'
});
</script>