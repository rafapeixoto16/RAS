<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <header class="bg-white shadow-sm z-0">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <template v-if="isEditingTitle">
              <input 
                v-model="projectTitle" 
                @keyup.enter="saveTitle" 
                @blur="saveTitle" 
                class="text-xl md:text-2xl font-bold text-gray-900 bg-gray-100 px-2 border-b border-gray-300 focus:outline-none"
                autofocus
              />
            </template>
            <template v-else>
              <h1 
                class="text-xl md:text-2xl font-bold text-gray-900 mb-[10%] sm:mb-0 cursor-pointer"
                @click="editTitle"
              >
                {{ projectTitle }}
              </h1>
            </template>
          </div>
          <div class="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <span class="text-sm text-gray-500">Page {{ currentPage + 1 }} of {{ pages.length }}</span>
            <div class="flex space-x-2">
              <button @click="deleteCurrentPage" class="p-2 text-gray-600 hover:text-red-500 transition-colors duration-200">
                <i class="bi bi-trash text-xl"></i>
              </button>
              <button @click="downloadCurrentImage" class="p-2 text-gray-600 hover:text-blue-500 transition-colors duration-200">
                <i class="bi bi-download text-xl"></i>
              </button>
              <button 
                @click="toggleGridView" 
                class="p-2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
              >
                <i class="bi bi-grid text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex-1 flex flex-col md:flex-row overflow-hidden">
      <aside class="w-full md:w-20 bg-white border-b md:border-r border-gray-200 shadow-md overflow-x-auto md:overflow-y-auto flex-shrink-0">
        <div class="flex md:flex-col items-center py-4 md:py-6 px-4 md:px-2 space-x-4 md:space-x-0 md:space-y-6">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-4 hidden md:block">Tools</h3>
          <div class="flex md:flex-col space-x-4 md:space-x-0 md:space-y-4">
            <ToolButton 
              v-for="(tool, index) in tools" 
              :key="tool.name" 
              :name="tool.name" 
              :icon="tool.icon" 
              :options="tool.options"
              :showMenu="activeTool === tool.name"
              :menuPosition="getToolMenuPosition(index)"
              @click="selectTool(tool.name)"
              @apply="applyTool"
              @cancel="cancelTool"
            />
          </div>
        </div>
      </aside>

      <!-- Show either carousel or grid view based on isGridView -->
      <main class="flex-1 overflow-hidden relative">
        <div v-if="isGridView" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <!-- Display the images in a grid with portrait orientation -->
          <div v-for="(page, index) in pages" :key="page.id" class="relative group">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                @click="goToImage(index)" 
                class="w-full h-72">
                <img
                  v-if="page.imageUrl"
                  :src="page.imageUrl"
                  alt="Project image"
                  class="w-full h-full object-cover transform scale-90 transition-transform duration-300 ease-in-out"
                />
                <div v-else class="w-full h-full bg-gray-200"></div>
              </button>
            </div>
            <span class="absolute top-2 right-2 text-white bg-gray-700 p-1 text-sm">{{ index + 1 }}</span>
          </div>
        </div>

        <div v-else class="absolute inset-0 overflow-hidden">
          <!-- Original carousel view -->
          <Carousel 
            v-model="currentPage" 
            :items="pages" 
            :canAddPage="true" 
            @add-page="addNewPage" 
            class="h-full"
          >
            <template #default="{ item }">
              <div class="w-full h-full flex items-center justify-center p-4">
                <div 
                  class="bg-white rounded-lg shadow-lg w-full h-full max-w-4xl mx-auto transform rotate-0 relative overflow-hidden" 
                  style="box-shadow: 1px 1px 15px rgba(0,0,0,0.1);"
                >
                  <div 
                    class="absolute inset-0 flex items-center justify-center"
                    @mousedown="startPanning"
                    @mouseup="stopPanning"
                    @mousemove="panImage"
                    @touchstart="startPanning"
                    @touchend="stopPanning"
                    @touchmove="panImage"
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import Carousel from '@/components/PageCarousel.vue';
import DropZone from '@/components/DropZone.vue';
import ToolButton from '@/components/ToolButton.vue';
import type { Tool } from '@/components/ToolButton.vue';
import JSZip from 'jszip';


interface Page {
  id: number;
  imageUrl: string | null;
}


const isGridView = ref(false);

const toggleGridView = () => {
  isGridView.value = !isGridView.value;
};

const goToImage = (index: number) => {
  currentPage.value = index;  
  isGridView.value = false;   
};


const projectTitle = ref("Projects");
const isEditingTitle = ref(false);

const editTitle = () => {
  isEditingTitle.value = true;
};

const saveTitle = () => {
  isEditingTitle.value = false;
};

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
let lastPinchDistance: number | null = null;

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

const tools: Tool[] = [
  { 
    name: 'Resize', 
    icon: 'bi-arrows-angle-expand', 
    options: {
      width: { label: 'Width', value: 800, type: 'number', min: 1, max: 4000, step: 1 },
      height: { label: 'Height', value: 600, type: 'number', min: 1, max: 4000, step: 1 }
    }
  },
  { 
    name: 'Crop', 
    icon: 'bi-crop',
    options: {
      aspect: { label: 'Aspect Ratio', value: '16:9', type: 'select', choices: ['16:9', '4:3', '1:1', 'Free'] }
    }
  },
  { 
    name: 'Rotate', 
    icon: 'bi-arrow-clockwise',
    options: {
      angle: { label: 'Angle', value: 90, type: 'number', min: -180, max: 180, step: 1 }
    }
  },
  { 
    name: 'Filters', 
    icon: 'bi-filter',
    options: {
      brightness: { label: 'Brightness', value: 100, type: 'number', min: 0, max: 200, step: 1 },
      contrast: { label: 'Contrast', value: 100, type: 'number', min: 0, max: 200, step: 1 }
    }
  },
  { 
    name: 'Adjust', 
    icon: 'bi-sliders',
    options: {
      saturation: { label: 'Saturation', value: 100, type: 'number', min: 0, max: 200, step: 1 },
      exposure: { label: 'Exposure', value: 0, type: 'number', min: -100, max: 100, step: 1 }
    }
  },
];

const activeTool = ref<string | null>(null);

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

const selectTool = (toolName: string) => {
  if (activeTool.value === toolName) {
    activeTool.value = null;
  } else {
    activeTool.value = toolName;
  }
};

const applyTool = (tool: Tool) => {
  console.log(`Applying ${tool.name} with options:`, tool.options);
  activeTool.value = null;
};

const cancelTool = () => {
  activeTool.value = null;
};

const getToolMenuPosition = (index: number): 'top' | 'center' | 'bottom' => {
  const totalTools = tools.length;
  if (index < totalTools / 3) return 'top';
  if (index >= totalTools * 2 / 3) return 'bottom';
  return 'center';
};

const startPanning = (event: MouseEvent | TouchEvent) => {
  if (!pages.value[currentPage.value].imageUrl) return;
  isPanning = true;
  
  if (event instanceof MouseEvent) {
    if (event.button !== 0) return;
    startX = event.clientX - imageTransform.translateX;
    startY = event.clientY - imageTransform.translateY;
  } else if (event instanceof TouchEvent) {
    startX = event.touches[0].clientX - imageTransform.translateX;
    startY = event.touches[0].clientY - imageTransform.translateY;
  }

  if (event instanceof MouseEvent) {
    window.addEventListener('mousemove', panImage);
    window.addEventListener('mouseup', stopPanning);
  }
};

const stopPanning = () => {
  if (!isPanning) return;
  isPanning = false;

  window.removeEventListener('mousemove', panImage);
  window.removeEventListener('mouseup', stopPanning);
};

const panImage = (event: MouseEvent | TouchEvent) => {
  if (!isPanning) return;
  
  let clientX, clientY;
  
  if (event instanceof MouseEvent) {
    clientX = event.clientX;
    clientY = event.clientY;
  } else if (event instanceof TouchEvent) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
    event.preventDefault();
  }

  if (clientX !== undefined && clientY !== undefined) {
    imageTransform.translateX = clientX - startX;
    imageTransform.translateY = clientY - startY;
  }
};

const zoomImage = (event: WheelEvent | TouchEvent) => {
  if (!pages.value[currentPage.value].imageUrl) return;
  
  if (event instanceof WheelEvent) {
    event.preventDefault();
    const zoomFactor = 0.1;
    const newScale = imageTransform.scale - event.deltaY * zoomFactor * 0.01;
    imageTransform.scale = Math.min(Math.max(newScale, 0.5), 3);
  } else if (event instanceof TouchEvent && event.touches.length === 2) {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
    
    if (lastPinchDistance) {
      const diff = dist - lastPinchDistance;
      const zoomFactor = 0.01;
      const newScale = imageTransform.scale + diff * zoomFactor;
      imageTransform.scale = Math.min(Math.max(newScale, 0.5), 3);
    }
    
    lastPinchDistance = dist;
  }
};
</script>

<style scoped>
@media (max-width: 768px) {
  .md\:w-20 {
    width: 100%;
    height: auto;
  }
  
  .md\:flex-col {
    flex-direction: row;
  }
  
  .md\:space-y-6 {
    margin-top: 0;
    margin-bottom: 0;
  }
  
  .md\:space-x-0 {
    margin-right: 1rem;
    margin-left: 1rem;
  }
}
</style>