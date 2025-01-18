<template>
    <Transition name="drawer">
      <div v-if="modelValue" class="fixed inset-0 z-50" @click.self="close">
        <div class="absolute inset-0 bg-black bg-opacity-25" />
        <div 
          class="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg"
          :style="{ transform: `translateY(${translateY}px)` }"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <div 
            class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3"
            role="button"
            aria-label="Drag handle"
          />
          <div class="max-h-[80vh] overflow-y-auto">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  defineProps<{
    modelValue: boolean;
  }>();
  
  const emit = defineEmits(['update:modelValue']);
  
  const translateY = ref(0);
  let touchStart = 0;
  let initialTranslateY = 0;
  
  const close = () => {
    emit('update:modelValue', false);
  };
  
  const onTouchStart = (e: TouchEvent) => {
    touchStart = e.touches[0].clientY;
    initialTranslateY = translateY.value;
  };
  
  const onTouchMove = (e: TouchEvent) => {
    const delta = e.touches[0].clientY - touchStart;
    translateY.value = Math.max(0, initialTranslateY + delta);
  };
  
  const onTouchEnd = () => {
    if (translateY.value > 150) {
      close();
    }
    translateY.value = 0;
  };
  </script>
  
  <style scoped>
  .drawer-enter-active,
  .drawer-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .drawer-enter-active > div:last-child,
  .drawer-leave-active > div:last-child {
    transition: transform 0.3s ease-out;
  }
  
  .drawer-enter-from {
    opacity: 0;
  }
  
  .drawer-enter-from > div:last-child {
    transform: translateY(100%);
  }
  
  .drawer-leave-to {
    opacity: 0;
  }
  
  .drawer-leave-to > div:last-child {
    transform: translateY(100%);
  }
  </style>  