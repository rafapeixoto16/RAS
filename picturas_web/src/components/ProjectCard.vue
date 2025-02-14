<template>
  <div class="block">
    <div
      @click="$router.push(`/project/${project._id}`)"
      class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
    >
      <div class="relative pb-[75%] sm:pb-2/3">
        <div v-if="project.images.length > 1" class="absolute h-full w-full grid grid-cols-2 gap-1">
          <img
            v-for="image in project.images.slice(0, 4)"
            :key="image.id"
            :src="image.imageUrl"
            :alt="`Image ${image.id} of ${project.name}`"
            class="object-cover w-full h-full"
          />
        </div>
        <img
          v-else-if="project.images.length === 1"
          :src="project.images[0].imageUrl"
          :alt="`Image ${project.images[0].id} of ${project.name}`"
          class="absolute h-full w-full object-cover"
        />
        <div v-else class="absolute h-full w-full bg-gray-200 flex items-center justify-center">
          <span class="text-gray-500">No image</span>
        </div>
      </div>
      <div class="p-3 sm:p-4">
        <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{{ project.name }}</h3>
        <div class="flex justify-between items-center">
          <span class="text-xs sm:text-sm text-gray-500">{{ timeAgo(project.updatedAt) }}</span>
          <div v-if="isLargeScreen" class="relative">
            <button
              @click.stop="(event) => { event.preventDefault(); event.stopPropagation(); }"
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
                :project="project"
                @open-new-tab="openInNewTab"
                @move-to-trash="deleteProject"
                :options="getDropdownOptions"
                :menu-color="'#FFFFFF'"
                append-to-body
              />
            </div>
          </div>
          <div v-else>
            <button
              @click.stop="openMobileOptions(project._id)"
              class="px-2 py-1 sm:px-3 sm:py-1 bg-blue-500 text-white text-xs sm:text-sm rounded-full hover:bg-blue-600 transition-colors duration-300"
            >
              <i class="bi bi-three-dots"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <MobileProjectOptions
      v-if="activeMobileProjectId !== null"
      :projectId="activeMobileProjectId"
      :mode="mode"
      @close="closeMobileOptions"
      @open-new-tab="openInNewTab"
      @move-to-trash="deleteProject"
      @restore="$emit('restore', $event)"
      @remove-permanently="$emit('remove-permanently', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Dropdown from './CustomDropdown.vue';
import MobileProjectOptions from './MobileProjectOptions.vue';
import { type Project } from '@/types/project';
import { useProjectStore } from '@/stores/projectsStore';

const emit = defineEmits(["open-new-tab", "move-to-trash", "edit", "restore", "remove-permanently"]);
const projectStore = useProjectStore()

// Props
const props = defineProps<{
  project: Project;
  dropdownOptions: Array<{ label: string; icon: string; action?: () => void }>;
  mode: 'default' | 'trash';
}>();

const mode = props.mode;

const isLargeScreen = ref(window.innerWidth >= 1024);
const activeMobileProjectId = ref<string | null>(null);

const openMobileOptions = (projectId: string) => {
  activeMobileProjectId.value = projectId;
};

const closeMobileOptions = () => {
  activeMobileProjectId.value = null;
};

const openInNewTab = (id: string) => {
  const baseUrl = window.location.origin;
  const fullUrl = `${baseUrl}/project/${id}`;
  window.open(fullUrl, "_blank");
};

const deleteProject = async (projectId: string) => {
  try {
    await projectStore.deleteProject(projectId);
  } catch (error) {
    console.error("Error deleting project:", error);
  }
};

const getDropdownOptions = computed(() => {
  if (mode === 'default') {
    return [
      {
        label: 'Open in New Tab',
        icon: 'bi-box-arrow-up-right',
        action: () => emit('open-new-tab', props.project._id),
      },
      { label: 'Move to Trash', icon: 'bi-trash', action: () => emit('move-to-trash', props.project._id) },
    ];
  } else if (mode === 'trash') {
    return [
      {
        label: 'Restore',
        icon: 'bi-arrow-counterclockwise',
        action: () => emit('restore', props.project._id),
      },
      {
        label: 'Remove Permanently',
        icon: 'bi-trash-fill',
        action: () => emit('remove-permanently', props.project._id),
      },
    ];
  }
  return [];
});
  
const updateScreenSize = () => {
  isLargeScreen.value = window.innerWidth >= 1024;
};

onMounted(() => {
  window.addEventListener('resize', updateScreenSize);
  updateScreenSize();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize);
});

const timeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
};
</script>