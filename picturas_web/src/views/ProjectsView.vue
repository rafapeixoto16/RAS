<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div class="w-full sm:w-auto">
            <template v-if="isEditingTitle">
              <input 
                v-model="projectTitle" 
                @keyup.enter="saveTitle" 
                @blur="saveTitle" 
                class="text-xl md:text-2xl font-bold text-gray-900 px-2 border-b border-gray-300 focus:outline-none w-full sm:w-auto"
                autofocus
              />
            </template>
            <template v-else>
              <h1 
                class="text-xl md:text-2xl font-bold text-gray-900 cursor-pointer"
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
              <button 
                @click="toggleGridView" 
                class="p-2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
              >
                <i class="bi bi-grid text-xl"></i>
              </button>
                <button 
                @click="processPreview"
                :disabled="isProcessingPreview"
                class="p-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 rounded-md"
                >
                <i class="bi bi-eye text-xl"></i>
                <span>Preview</span>
                <span v-if="isProcessingPreview" class="text-sm">
                  <Loader2 class="animate-spin -ml-1 mr-2 h-4 w-4" />
                </span>
                </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex-1 flex flex-col md:flex-row overflow-hidden">
      <aside class="hidden md:block w-72 bg-white border-r border-gray-200 shadow-md overflow-y-auto flex-shrink-0">
        <div class="p-6">
          <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Tools</h3>
          
          <div class="mb-8">
            <h4 class="text-sm font-semibold text-gray-600 mb-4">Basic Tools</h4>
            <div class="space-y-2">
              <ToolButton 
                v-for="tool in basicTools" 
                :key="tool" 
                :name="tool" 
                :icon="getIconForTool(tool)" 
                :options="projectStore.filterParameters ? projectStore.filterParameters[tool].schema.definitions[tool].properties : {}"
                :showMenu="activeTool === tool"
                :menuPosition="getToolMenuPosition(tool)"
                @click="selectTool(tool)"
              />
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-semibold text-gray-600 mb-4">Premium Tools</h4>
            <div class="space-y-2">
              <ToolButton 
                v-for="tool in premiumTools" 
                :key="tool" 
                :name="tool" 
                :icon="getIconForTool(tool)" 
                :options="projectStore.filterParameters ? projectStore.filterParameters[tool].schema.definitions[tool].properties : {}"
                :showMenu="activeTool === tool"
                :menuPosition="getToolMenuPosition(tool)"
                :disabled="!isPremiumUser"
                @click="selectTool(tool)"
              />
            </div>
          </div>
        </div>
      </aside>

      <main class="flex-1 overflow-hidden relative">
        <div v-if="isGridView" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-h-[calc(100vh-4rem)] overflow-y-auto sm:max-h-none sm:overflow-visible">
          <div 
            v-for="(page, index) in pages" 
            :key="page.id" 
            class="relative group"
            draggable="true"
            @dragstart="onDragStart(index, $event)"
            @dragover.prevent
            @dragenter.prevent
            @dragleave.prevent
            @drop="onDrop(index, $event)"
            @touchstart="onTouchStart(index, $event)"
            @touchmove="onTouchMove($event)"
            @touchend="onTouchEnd(index, $event)"
          >
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                @click="goToImage(index)" 
                class="w-full aspect-square">
                <img
                  v-if="page.imageUrl"
                  :src="page.imageUrl"
                  alt="Project image"
                  class="w-full h-full object-cover transform scale-90 transition-transform duration-300 ease-in-out"
                />
                <div v-else class="w-full h-full bg-gray-200"></div>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="absolute inset-0 overflow-hidden">
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

      <aside class="w-full md:w-72 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-4">Applied Tools</h3>
          <ReorderableList
            v-model="appliedTools"
            :projectId="projectId"
            @remove="removeTool"
          />
          <div v-if="appliedTools.length > 0" class="mt-4">
            <button 
              @click="processProject" 
              :disabled="processingStatus === 'processing'"
              :class="[applyButtonClass, 'w-full px-4 py-2 text-white rounded disabled:opacity-50 transition-colors duration-200']"
            >
              {{ applyButtonText }}
            </button>
            <button 
              v-if="processingStatus === 'processing'"
              @click="cancelProcessing"
              class="mt-2 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
            >
              Cancel Processing
            </button>
          </div>
        </div>
      </aside>

      <button 
        @click="isToolDrawerOpen = true"
        class="md:hidden fixed right-4 bottom-4 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 z-20"
      >
        <i class="bi bi-tools text-xl"></i>
      </button>

      <BottomDrawer
        v-model="isToolDrawerOpen"
        class="md:hidden"
      >
        <div class="px-4 py-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">Tools</h3>
            <button 
              @click="isToolDrawerOpen = false"
              class="p-2 text-gray-400 hover:text-gray-500"
            >
              <i class="bi bi-x text-xl"></i>
            </button>
          </div>

          <div class="mb-6">
            <h4 class="text-sm font-semibold text-gray-600 mb-4">Basic Tools</h4>
            <div class="grid grid-cols-4 gap-4">
              <ToolButton 
                v-for="tool in basicTools" 
                :key="tool" 
                :name="tool" 
                :icon="getIconForTool(tool)" 
                :options="projectStore.filterParameters ? projectStore.filterParameters[tool].schema.definitions[tool].properties : {}"
                :showMenu="activeTool === tool"
                :menuPosition="getToolMenuPosition(tool)"
                @click="selectTool(tool)"
              />
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-semibold text-gray-600 mb-4">Premium Tools</h4>
            <div class="grid grid-cols-4 gap-4">
              <ToolButton 
                v-for="tool in premiumTools" 
                :key="tool" 
                :name="tool" 
                :icon="getIconForTool(tool)" 
                :options="projectStore.filterParameters ? projectStore.filterParameters[tool].schema.definitions[tool].properties : {}"
                :showMenu="activeTool === tool"
                :menuPosition="getToolMenuPosition(tool)"
                :disabled="!isPremiumUser"
                @click="selectTool(tool)"
              />
            </div>
          </div>
        </div>
      </BottomDrawer>
    </div>
  </div>

  <DynamicToolMenu
    v-if="activeTool && projectStore.filterParameters && projectStore.filterParameters[activeTool]"
    :toolName="activeTool"
    :toolOptions="projectStore.filterParameters[activeTool].schema.definitions[activeTool].properties"
    @apply="applyTool"
    @cancel="cancelTool"
  />

  <PreviewModal
    v-if="showPreviewModal"
    :previewData="previewData"
    @close="handleClosePreviewModal"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/stores/projectsStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useSocketStatus } from '@/utils/socket';
import Carousel from '@/components/PageCarousel.vue';
import DropZone from '@/components/DropZone.vue';
import ToolButton from '@/components/ToolButton.vue';
import DynamicToolMenu from '@/components/DynamicToolMenu.vue';
import BottomDrawer from '@/components/BottomDrawer.vue';
import ReorderableList from '@/components/ReordableList.vue';
import PreviewModal from '@/components/PreviewModal.vue';
import type { Tool } from '@/types/project';
import type { PreviewData } from '@/types/preview';
import JSZip from 'jszip';
import { Loader2 } from 'lucide-vue-next'

interface Page {
  id: number;
  imageUrl: string | null;
}

const showPreviewModal = ref<boolean>(false);
const previewData = ref<PreviewData>({});
const route = useRoute();
const projectStore = useProjectStore();
const subscriptionStore = useSubscriptionStore();
useSocketStatus();

const projectId = computed<string>(() => route.params.id as string);
const project = computed(() => projectStore.getProjectById(projectId.value));

const isGridView = ref(false);
const projectTitle = ref("");
const isEditingTitle = ref(false);
const pages = ref<Page[]>([]);
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
const isToolDrawerOpen = ref(false);
const appliedTools = computed(() => project.value ? project.value.tools : []);
const processingStatus = ref<'idle' | 'processing' | 'completed' | 'error'>('idle');
const notification = ref<string | null>(null);
const isProcessingPreview = ref(false);

onMounted(async () => {
  if (project.value) {
    projectTitle.value = project.value.name;
    pages.value = project.value.images.map((image, index) => ({
      id: index,
      imageUrl: image.imageUrl,
    }));
    if (pages.value.length === 0) {
      pages.value.push({ id: 0, imageUrl: null });
    }
  }
  await projectStore.fetchFilterParameters();
});

const toggleGridView = () => {
  isGridView.value = !isGridView.value;
};

const goToImage = (index: number) => {
  currentPage.value = index;  
  isGridView.value = false;   
};

const editTitle = () => {
  isEditingTitle.value = true;
};

const saveTitle = async () => {
  isEditingTitle.value = false;
  if (project.value) {
    await projectStore.updateProject(project.value._id, { name: projectTitle.value });
  }
};

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

let draggedIndex: number | null = null;
let touchStartY: number | null = null;

const onDragStart = (index: number, event: DragEvent) => {
  draggedIndex = index;
  event.dataTransfer?.setData('text/plain', index.toString());
};

const onDrop = async (index: number, event: DragEvent) => {
  event.preventDefault();
  const droppedIndex = parseInt(event.dataTransfer?.getData('text/plain') || '-1', 10);
  
  if (droppedIndex === -1 || droppedIndex === index || !project.value) return;
  
  try {
    await projectStore.reorderProjectImage(project.value._id, droppedIndex, index);
    const [movedItem] = pages.value.splice(droppedIndex, 1);
    pages.value.splice(index, 0, movedItem);
  } catch (error) {
    console.error('Error reordering image:', error);
  }
};

const onTouchStart = (index: number, event: TouchEvent) => {
  draggedIndex = index;
  touchStartY = event.touches[0].clientY;
};

const onTouchMove = (event: TouchEvent) => {
  if (draggedIndex === null || touchStartY === null) return;
  
  const touch = event.touches[0];
  const deltaY = touch.clientY - touchStartY;
  
  (event.currentTarget as HTMLElement).style.transform = `translateY(${deltaY}px)`;
};

const onTouchEnd = async (index: number, event: TouchEvent) => {
  if (draggedIndex === null || touchStartY === null || !project.value) return;
  
  const touch = event.changedTouches[0];
  const deltaY = touch.clientY - touchStartY;
  const threshold = 50;
  
  if (Math.abs(deltaY) > threshold) {
    const newIndex = index + (deltaY > 0 ? 1 : -1);
    if (newIndex >= 0 && newIndex < pages.value.length) {
      try {
        await projectStore.reorderProjectImage(project.value._id, draggedIndex, newIndex);
        const [movedItem] = pages.value.splice(draggedIndex, 1);
        pages.value.splice(newIndex, 0, movedItem);
      } catch (error) {
        console.error('Error reordering image:', error);
      }
    }
  }
  
  if (event.currentTarget) {
    (event.currentTarget as HTMLElement).style.transform = '';
  }
  
  draggedIndex = null;
  touchStartY = null;
};

const isPremiumUser = computed(() => subscriptionStore.isPremium);

const activeTool = ref<string | null>(null);

const basicTools = computed(() => {
  if (!projectStore.filterParameters) return [];
  return Object.entries(projectStore.filterParameters)
    .filter(([, tool]) => !tool.isPremium)
    .map(([name,]) => name);
});

const premiumTools = computed(() => {
  if (!projectStore.filterParameters) return [];
  return Object.entries(projectStore.filterParameters)
    .filter(([, tool]) => tool.isPremium)
    .map(([name,]) => name);
});

const getIconForTool = (toolName: string): string => {
  const iconMap: Record<string, string> = {
    autoAdjust: 'bi-magic',
    binarization: 'bi-palette',
    addBorder: 'bi-border-all',
    brightness: 'bi-brightness-high',
    contrast: 'bi-circle-half',
    cropping: 'bi-crop',
    grayscale: 'bi-palette2',
    'object-identification': 'bi-box',
    ocr: 'bi-file-text',
    'person-count': 'bi-people',
    'remove-bg': 'bi-eraser',
    resize: 'bi-arrows-angle-expand',
    rotation: 'bi-arrow-clockwise',
    saturation: 'bi-droplet-half',
    'smart-crop': 'bi-crop',
  };

  return iconMap[toolName] || 'bi-question-circle';
};

const addNewPage = () => {
  pages.value.push({ id: Date.now(), imageUrl: null });
  currentPage.value = pages.value.length - 1;
};

const handleFilesDropped = async (files: File[]) => {
  const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
  
  if (imageFiles.length === 0 || !project.value) return;

  for (const file of imageFiles) {
    try {
      const { id, imageUrl } = await projectStore.addProjectImage(project.value._id, file);
      if (pages.value[currentPage.value].imageUrl === null) {
        pages.value[currentPage.value] = { id, imageUrl };
      } else {
        pages.value.push({ id, imageUrl });
      }
    } catch (error) {
      console.error('Error adding image:', error);
    }
  }

  currentPage.value = pages.value.length - imageFiles.length;
};

const deleteCurrentPage = async () => {
  if (project.value && pages.value.length > 0) {
    try {
      await projectStore.removeProjectImage(project.value._id, currentPage.value);
      pages.value.splice(currentPage.value, 1);
      if (pages.value.length === 0) {
        pages.value.push({ id: 0, imageUrl: null });
      }
      if (currentPage.value >= pages.value.length) {
        currentPage.value = Math.max(0, pages.value.length - 1);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
};

const selectTool = (toolName: string) => {
  if (activeTool.value === toolName) {
    activeTool.value = null;
  } else {
    activeTool.value = toolName;
    isToolDrawerOpen.value = false;
  }
};

const applyTool = async (tool: Tool) => {
  if (project.value) {
    try {
      await projectStore.addProjectTool(project.value._id, tool);
    } catch (error) {
      console.error('Error applying tool:', error);
    }
  }
  activeTool.value = null;
};

const cancelTool = () => {
  activeTool.value = null;
};

const getToolMenuPosition = (toolName: string): 'top' | 'center' | 'bottom' => {
  const allTools = [...(basicTools.value || []), ...(premiumTools.value || [])];
  const index = allTools.findIndex(tool => tool === toolName);
  const totalTools = allTools.length;

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

watch(currentPage, (newPage) => {
  if (newPage < 0) {
    currentPage.value = 0;
  } else if (newPage >= pages.value.length) {
    currentPage.value = pages.value.length - 1;
  }
});

const removeTool = async (index: number) => {
  if (project.value) {
    try {
      await projectStore.removeProjectTool(project.value._id, index);
    } catch (error) {
      console.error('Error removing tool:', error);
    }
  }
};


watch(project, (newProject) => {
  if (newProject) {
    projectTitle.value = newProject.name;
    pages.value = newProject.images.map((image, index) => ({
      id: index,
      imageUrl: image.imageUrl,
    }));
    if (pages.value.length === 0) {
      pages.value.push({ id: 0, imageUrl: null });
    }
  }
}, { immediate: true });

const processProject = async () => {
  if (!project.value) return;
  
  processingStatus.value = 'processing';
  try {
    await projectStore.processProject(projectId.value);
    
    await new Promise<void>((resolve) => {
      const unwatch = watch(() => projectStore.getProjectNotification(projectId.value), async (newNotification) => {
        if (newNotification && !newNotification.message.isPreview && newNotification.message.kind != "canceled" ) {
          notification.value = newNotification.message.url;
          processingStatus.value = 'completed';
          unwatch();
          resolve();
        }
      });
    });
    if (notification.value) {
      const link = document.createElement('a');
      link.href = notification.value;
      link.download = `project-${project.value._id}.zip`;
      link.click();
    }
    setTimeout(() => {
      processingStatus.value = 'idle';
      projectStore.removeNonPreviewNotification(projectId.value);
    }, 2000);
  } catch (error) {
    console.error('Error processing project:', error);
    processingStatus.value = 'error';
  }
};

const cancelProcessing = async () => {
  if (!project.value) return;
  
  try {
    await projectStore.deleteProcess(project.value._id);
    processingStatus.value = 'idle';
    notification.value = null;
    projectStore.removeCanceledNotification(projectId.value);
  } catch (error) {
    console.error('Error canceling process:', error);
  }
};

const processPreview = async () => {
  if(!project.value) return;

  isProcessingPreview.value = true;
  try{
    await projectStore.processPreview(projectId.value, currentPage.value)

    await new Promise<void>((resolve) => {
      const unwatch = watch(() => projectStore.getProjectNotification(projectId.value), async (newNotification) => {
        if (newNotification && newNotification.message.isPreview && newNotification.message.kind != "canceled") {
          unwatch();
        
          notification.value = newNotification.message.url
          if (notification.value) {
            const response = await fetch(notification.value);
            const zipBlob = await response.blob();
            const zip = new JSZip();
            const contents = await zip.loadAsync(zipBlob);

            const previewFiles: PreviewData = {};
            for(const [filename, file] of Object.entries(contents.files)) {
              if(!file.dir){
                const content = await file.async('blob');
                if(filename.endsWith('.json')) {
                  const jsonContent = JSON.parse(await content.text()) as Record<string, unknown>;
                  previewFiles[filename] = {type: 'json', content: jsonContent};
                } else {
                  previewFiles[filename] = {type: 'image', url: URL.createObjectURL(content) };
                }
              }
            }

            previewData.value = previewFiles;
            showPreviewModal.value = true;
            resolve();
          }
        }
      });
    });
  } catch  (error) {
    console.error("Error processing preview:", error);
  } finally {
    isProcessingPreview.value = false;
  }
}

onUnmounted(() => {
  projectStore.removeNonPreviewNotification(projectId.value);
});

const handleClosePreviewModal = () => {
  showPreviewModal.value = false;
  previewData.value = {};
  projectStore.removePreviewNotification(projectId.value);
};

const applyButtonText = computed(() => {
  switch (processingStatus.value) {
    case 'processing':
      return 'Processing...';
    case 'completed':
      return '✓ Completed';
    case 'error':
      return 'Error - Try Again';
    default:
      return 'Apply Pipeline';
  }
});

const applyButtonClass = computed(() => {
  return {
    'bg-blue-500 hover:bg-blue-600': processingStatus.value !== 'completed',
    'bg-green-500 hover:bg-green-600': processingStatus.value === 'completed',
  };
});
</script>

<style scoped>
@media (max-width: 768px) {
  .aspect-square {
    aspect-ratio: 1 / 1;
  }
}

.grid > div {
  transition: transform 0.2s ease-out;
}

.grid > div:active {
  cursor: grabbing;
  z-index: 10;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>