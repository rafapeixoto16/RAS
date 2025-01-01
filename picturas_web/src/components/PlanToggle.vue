<template>
    <div class="flex flex-col items-center space-y-3 sm:space-y-4">
      <div class="flex items-center space-x-3">
        <span 
          class="text-xs sm:text-sm font-medium"
          :class="modelValue === 'monthly' ? 'text-gray-900' : 'text-gray-500'"
        >
          Monthly
        </span>
        <button
          class="relative inline-flex h-5 sm:h-6 w-9 sm:w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2"
          :class="modelValue === 'yearly' ? 'bg-[#3B82F6]' : 'bg-gray-200'"
          @click="toggle"
        >
          <span
            class="pointer-events-none inline-block h-4 sm:h-5 w-4 sm:w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            :class="modelValue === 'yearly' ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'"
          />
        </button>
        <span 
          class="text-xs sm:text-sm font-medium"
          :class="modelValue === 'yearly' ? 'text-gray-900' : 'text-gray-500'"
        >
          Yearly
        </span>
      </div>
      <span class="text-xs sm:text-sm text-[#3B82F6] font-medium">Save up to 17% with yearly billing</span>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    modelValue: 'monthly' | 'yearly'
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: 'monthly' | 'yearly'): void
  }>()
  
  const toggle = () => {
    emit('update:modelValue', props.modelValue === 'monthly' ? 'yearly' : 'monthly')
  }
  </script>
  
  