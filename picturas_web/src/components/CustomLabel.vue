<template>
  <label :for="htmlFor" class="block text-sm font-medium text-blue-700 mb-1">
    <slot></slot>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  htmlFor: string;
}>();
</script>