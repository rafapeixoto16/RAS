<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
    <div class="relative pb-[75%] sm:pb-2/3">
      <img 
        :src="project.imageUrl" 
        :alt="project.title"
        class="absolute h-full w-full object-cover"
      >
    </div>
    <div class="p-3 sm:p-4">
      <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{{ project.title }}</h3>
      <div class="flex justify-between items-center">
        <span class="text-xs sm:text-sm text-gray-500">{{ project.lastEdited }}</span>
        <div v-if="isLargeScreen" class="relative"> 
          <!-- Dropdown for Large Screens -->
          <button 
            @click="$emit('edit', project.id)"
            class="px-2 py-1 sm:px-3 sm:py-1 bg-blue-500 text-white text-xs sm:text-sm rounded-full hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="bi bi-three-dots"></i>
          </button>
          <div 
            class="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <Dropdown 
              placement="right" 
              trigger="click" 
              :options="getDropdownOptions" 
              :menu-color="'#FFFFFF'"
              append-to-body 
            />
          </div>
        </div>
        <div v-else>
          <!-- Mobile Project Options Trigger -->
          <button 
            @click="openMobileOptions(project.id)"
            class="px-2 py-1 sm:px-3 sm:py-1 bg-blue-500 text-white text-xs sm:text-sm rounded-full hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="bi bi-three-dots"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Single Mobile Project Options Modal -->
  <MobileProjectOptions 
    v-if="activeMobileProjectId !== null" 
    :projectId="activeMobileProjectId"
    :mode="mode" 
    @close="closeMobileOptions"
    @open-new-tab="$emit('open-new-tab', $event)"
    @rename="$emit('rename', $event)"
    @move-to-trash="$emit('move-to-trash', $event)"
    @restore="$emit('restore', $event)"
    @remove-permanently="$emit('remove-permanently', $event)"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Dropdown from './CustomDropdown.vue';
import MobileProjectOptions from './MobileProjectOptions.vue';

interface Project {
  id: number;
  title: string;
  imageUrl: string;
  lastEdited: string;
}

// Props
const props = defineProps<{
  project: Project;
  dropdownOptions: Array<{ label: string; icon: string; action?: () => void }>;
  mode: 'default' | 'trash'; // Add mode prop
}>();

const mode = props.mode;

// Emits
defineEmits<{
  (e: 'edit', id: number): void;
  (e: 'open-new-tab', id: number): void;
  (e: 'rename', id: number): void;
  (e: 'move-to-trash', id: number): void;
  (e: 'restore', id: number): void;
  (e: 'remove-permanently', id: number): void;
}>();

// Reactive State
const isLargeScreen = ref(window.innerWidth >= 1024);
const activeMobileProjectId = ref<number | null>(null); // Tracks which project is active

// Methods
const openMobileOptions = (projectId: number) => {
  activeMobileProjectId.value = projectId;
};

const closeMobileOptions = () => {
  activeMobileProjectId.value = null;
};

// Handle Dropdown Options Based on Mode
const getDropdownOptions = computed(() => {
  if (mode === 'default') {
    return [
      { label: 'Open in New Tab', icon: 'bi-box-arrow-up-right', action: () => $emit('open-new-tab', props.project.id) },
      { label: 'Rename', icon: 'bi-pencil', action: () => $emit('rename', props.project.id) },
      { label: 'Move to Trash', icon: 'bi-trash', action: () => $emit('move-to-trash', props.project.id) },
    ];
  } else if (mode === 'trash') {
    return [
      { label: 'Restore', icon: 'bi-arrow-counterclockwise', action: () => $emit('restore', props.project.id) },
      { label: 'Remove Permanently', icon: 'bi-trash-fill', action: () => $emit('remove-permanently', props.project.id) },
    ];
  }
  return [];
});

// Handle Screen Size Changes
const updateScreenSize = () => {
  isLargeScreen.value = window.innerWidth >= 1024;
};

onMounted(() => {
  window.addEventListener('resize', updateScreenSize);
  updateScreenSize(); // Check initial size
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize);
});

function $emit(arg0: string, id: any): any {
  throw new Error('Function not implemented.');
}
</script>
