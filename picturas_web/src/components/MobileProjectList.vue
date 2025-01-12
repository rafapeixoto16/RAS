<template>
  <div class="w-full">
    <div
      v-for="project in visibleProjects"
      :key="project.id"
      class="relative group w-full"
    >
      <router-link
        :to="project.link"
        class="block p-4 rounded w-full"
        @click="$emit('close-menu')"
      >
        {{ project.name }}
      </router-link>
      <button
        @click="openOptionsMenu(project.id)"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"
          />
        </svg>
      </button>
    </div>
    <button
      v-if="showSeeAllButton"
      @click="toggleSeeAll"
      class="mt-2 text-[#3B82F6] hover:underline w-full text-left p-4"
    >
      {{ seeAll ? "See Less" : "See All" }}
    </button>
    <MobileProjectOptions
      v-if="showOptionsMenu"
      mode="default"
      :project-id="selectedProjectId || 0"
      @close="closeOptionsMenu"
      @open-new-tab="openInNewTab"
      @rename="renameProject"
      @move-to-trash="moveToTrash"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import MobileProjectOptions from "./MobileProjectOptions.vue";

interface Project {
  id: number;
  name: string;
  link: string;
}

const props = defineProps<{
  projects: Project[];
}>();

const emit = defineEmits<{
  (e: "close-menu"): void;
}>();

const seeAll = ref(false);
const showOptionsMenu = ref(false);
const selectedProjectId = ref<number | null>(null);

const visibleProjects = computed(() => {
  return seeAll.value ? props.projects : props.projects.slice(0, 5);
});

const showSeeAllButton = computed(() => {
  return props.projects.length > 5;
});

const toggleSeeAll = () => {
  seeAll.value = !seeAll.value;
};

const openOptionsMenu = (projectId: number) => {
  selectedProjectId.value = projectId;
  showOptionsMenu.value = true;
};

const closeOptionsMenu = () => {
  showOptionsMenu.value = false;
};

const openInNewTab = (projectId: number) => {
  const fullUrl = window.location.origin + "/project" + projectId;
  window.open(fullUrl, "_blank");
  closeOptionsMenu();
};

const moveToTrash = (projectId: number) => {
  console.log(`Moving project ${projectId} to trash`);
  closeOptionsMenu();
};

const renameProject = (projectId: number) => {
  console.log(`Renaming project ${projectId}`);
  closeOptionsMenu();
};
</script>
