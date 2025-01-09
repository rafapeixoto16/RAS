<template>
  <div class="flex h-screen bg-gray-100">
    <aside class="w-20 bg-white border-r border-gray-200 shadow-md overflow-y-auto">
      <div class="flex flex-col items-center py-6 space-y-6">
        <div class="w-full px-2">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-4">Tools</h3>
          <div class="space-y-4">
            <ToolButton 
              v-for="tool in tools" 
              :key="tool.name" 
              :name="tool.name" 
              :icon="tool.icon" 
              :options="tool.options"
              @click="selectTool(tool)" 
            />
          </div>
        </div>
      </div>
    </aside>

    <main class="flex-1 overflow-hidden">
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Projects</h1>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500">Page {{ currentPage + 1 }} of {{ pages.length }}</span>
            <div class="flex space-x-2">
              <button @click="deleteCurrentPage" class="p-2 text-gray-600 hover:text-red-500 transition-colors duration-200">
                <i class="bi bi-trash text-xl"></i>
              </button>
              <button @click="downloadCurrentImage" class="p-2 text-gray-600 hover:text-blue-500 transition-colors duration-200">
                <i class="bi bi-download text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div class="h-[calc(100vh-4rem)] overflow-hidden bg-gray-100 p-8">
        <Carousel 
          v-model="currentPage" 
          :items="pages" 
          :canAddPage="true" 
          @add-page="addNewPage" 
          class="h-full"
        >
          <template #default="{ item }">
            <div class="w-full h-full flex items-center justify-center">
              <div 
                class="bg-white rounded-lg shadow-lg w-full h-full max-w-4xl mx-auto transform rotate-0 relative overflow-hidden" 
                style="box-shadow: 1px 1px 15px rgba(0,0,0,0.1);">
                <div 
                  class="absolute inset-0 p-8 flex items-center justify-center"
                  @mousedown="startPanning"
                  @mouseup="stopPanning"
                  @mousemove="panImage"
                  @wheel="zoomImage"
                >
                  <img 
                    v-if="item.imageUrl" 
                    :src="item.imageUrl" 
                    draggable="false"
                    alt="Project image" 
                    class="max-w-full max-h-full object-contain" 
                    :style="imageStyle" 
                  />
                  <DropZone v-else @files-dropped="handleFilesDropped" />
                </div>
              </div>
            </div>
          </template>
        </Carousel>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import Carousel from '@/components/PageCarousel.vue';
import DropZone from '@/components/DropZone.vue';
import ToolButton from '@/components/ToolButton.vue';

interface Page {
  id: number;
  imageUrl: string | null;
}

const pages = ref<Page[]>([{ id: 1, imageUrl: null }]);
const currentPage = ref(0);
const imageTransform = reactive({
  scale: 1,
  translateX: 0,
  translateY: 0,
});
let isPanning = false;
let startX = 0;
let startY = 0;

import { computed } from 'vue';

const imageStyle = computed(() => {
  return {
    transform: `scale(${imageTransform.scale}) translate(${imageTransform.translateX}px, ${imageTransform.translateY}px)`,
    transition: isPanning ? 'none' : 'transform 0.2s ease',
  };
});

watch(() => pages.value.length, (newLength) => {
  if (currentPage.value >= newLength) {
    currentPage.value = Math.max(0, newLength - 1);
  }
});

const tools = [
  { 
    name: 'Resize', 
    icon: 'bi-arrows-angle-expand', 
    options: {
      width: { label: 'Width', value: 800, unit: 'px' },
      height: { label: 'Height', value: 600, unit: 'px' }
    }
  },
  { 
    name: 'Crop', 
    icon: 'bi-crop',
    options: {
      aspect: { label: 'Aspect Ratio', value: '16:9' }
    }
  },
  { 
    name: 'Rotate', 
    icon: 'bi-arrow-clockwise',
    options: {
      angle: { label: 'Angle', value: 90, unit: '°' }
    }
  },
  { 
    name: 'Filters', 
    icon: 'bi-filter',
    options: {
      brightness: { label: 'Brightness', value: 100, unit: '%' },
      contrast: { label: 'Contrast', value: 100, unit: '%' }
    }
  },
  { 
    name: 'Adjust', 
    icon: 'bi-sliders',
    options: {
      saturation: { label: 'Saturation', value: 100, unit: '%' },
      exposure: { label: 'Exposure', value: 0, unit: 'EV' }
    }
  },
];

const addNewPage = () => {
  pages.value.push({ id: Date.now(), imageUrl: null });
  currentPage.value = pages.value.length - 1;
};

const handleFilesDropped = async (files: File[]) => {
  const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
  
  if (imageFiles.length === 0) return;

  const newPages = await Promise.all(imageFiles.map(async (file) => ({
    id: Date.now() + Math.random(),
    imageUrl: URL.createObjectURL(file)
  })));

  if (pages.value[currentPage.value].imageUrl === null) {
    pages.value.splice(currentPage.value, 1, newPages[0]);
    if (newPages.length > 1) {
      pages.value.push(...newPages.slice(1));
    }
  } else {
    pages.value.push(...newPages);
  }

  currentPage.value = pages.value.indexOf(newPages[0]);
};

const deleteCurrentPage = () => {
  if (pages.value.length > 1) {
    pages.value.splice(currentPage.value, 1);
    if (currentPage.value >= pages.value.length) {
      currentPage.value = pages.value.length - 1;
    }
  } else {
    pages.value[0].imageUrl = null;
  }
};

const downloadCurrentImage = () => {
  const currentImage = pages.value[currentPage.value].imageUrl;
  if (currentImage) {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `project-image-${currentPage.value + 1}.png`;
    link.click();
  }
};

const selectTool = (tool: { name: string, icon: string, options?: any }) => {
  console.log(`Selected tool: ${tool.name}`);
};

const startPanning = (event: MouseEvent) => {
  if (!pages.value[currentPage.value].imageUrl) return;
  if (event.button !== 0) return;
  isPanning = true;
  startX = event.clientX - imageTransform.translateX;
  startY = event.clientY - imageTransform.translateY;

  window.addEventListener('mousemove', panImage);
  window.addEventListener('mouseup', stopPanning);
};

const stopPanning = () => {
  if (!isPanning) return;
  isPanning = false;

  window.removeEventListener('mousemove', panImage);
  window.removeEventListener('mouseup', stopPanning);
};

const panImage = (event: MouseEvent) => {
  if (!isPanning) return;
  imageTransform.translateX = event.clientX - startX;
  imageTransform.translateY = event.clientY - startY;
};

const zoomImage = (event: WheelEvent) => {
  if (!pages.value[currentPage.value].imageUrl) return;
  event.preventDefault();
  const zoomFactor = 0.1;
  const newScale = imageTransform.scale - event.deltaY * zoomFactor * 0.01;
  imageTransform.scale = Math.min(Math.max(newScale, 0.5), 3);
};
</script>