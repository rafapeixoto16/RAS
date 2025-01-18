<template>
  <div class="relative w-full h-full overflow-hidden">
    <div 
      class="absolute inset-0 flex transition-transform duration-300 ease-in-out" 
      :style="{ transform: `translateX(-${modelValue * 100}%)` }"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    >
      <div 
        v-for="(item, index) in items" 
        :key="item.id" 
        class="w-full h-full flex-shrink-0 overflow-hidden"
      >
        <slot :item="item" :index="index"></slot>
      </div>
    </div>
    
    <button 
      v-if="modelValue > 0"
      @click="prev" 
      class="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg text-gray-700 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
    >
      <i class="bi bi-chevron-left text-lg sm:text-xl"></i>
    </button>
    
    <button 
      v-if="modelValue < items.length - 1"
      @click="next" 
      class="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg text-gray-700 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
    >
      <i class="bi bi-chevron-right text-lg sm:text-xl"></i>
    </button>

    <button 
      v-if="modelValue === items.length - 1 && canAddPage"
      @click="$emit('add-page')" 
      class="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg text-gray-700 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
    >
      <i class="bi bi-plus text-lg sm:text-xl"></i>
    </button>

    <div class="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
      <button
        v-for="(_, index) in items"
        :key="index"
        @click="$emit('update:modelValue', index)"
        class="w-2 h-2 rounded-full transition-all duration-200"
        :class="index === modelValue ? 'bg-blue-500 w-4' : 'bg-gray-300 hover:bg-gray-400'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  modelValue: number;
  items: Array<{ id: number; imageUrl: string | null }>;
  canAddPage?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'add-page'): void;
}>();

const next = () => {
  if (props.modelValue < props.items.length - 1) {
    emit('update:modelValue', props.modelValue + 1);
  }
};

const prev = () => {
  if (props.modelValue > 0) {
    emit('update:modelValue', props.modelValue - 1);
  }
};

const touchStartX = ref(0);
const touchEndX = ref(0);

const touchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0].screenX;
};

const touchMove = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].screenX;
};

const touchEnd = () => {
  if (touchStartX.value - touchEndX.value > 50) {
    next();
  } else if (touchEndX.value - touchStartX.value > 50) {
    prev();
  }
};
</script>