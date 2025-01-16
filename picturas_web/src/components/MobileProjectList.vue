<template>
  <div class="w-full bg-blue-50">
    <div
      v-for="project in visibleProjects"
      :key="project._id"
      class="relative group w-full"
    >
      <router-link
        :to="`/project/${project._id}`"
        class="block p-4 rounded w-full"
        @click="$emit('close-menu')"
      >
        {{ project.name }}
      </router-link>
      <button
        @click="openOptionsMenu(project._id)"
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
      :project-id="selectedProjectId || ''"
      @close="closeOptionsMenu"
      @open-new-tab="openInNewTab"
      @rename="renameProject"
      @move-to-trash="moveToTrash"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import MobileProjectOptions from "./MobileProjectOptions.vue";
import type { Project } from "@/types/project";
import { useProjectStore } from "@/stores/projectsStore";

const projectStore = useProjectStore();

const props = defineProps<{
  projects: Project[];
}>();

defineEmits<{
  (e: "close-menu"): void;
}>();

const seeAll = ref(false);
const showOptionsMenu = ref(false);
const selectedProjectId = ref<string | null>(null);

const visibleProjects = computed(() => {
  const sortedProjects = [...props.projects].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return seeAll.value ? sortedProjects : sortedProjects.slice(0, 5);
});

onMounted(() => {
  projectStore.fetchProjects();
});

const showSeeAllButton = computed(() => {
  return props.projects.length > 5;
});

const toggleSeeAll = () => {
  seeAll.value = !seeAll.value;
};

const openOptionsMenu = (projectId: string) => {
  selectedProjectId.value = projectId;
  showOptionsMenu.value = true;
};

const closeOptionsMenu = () => {
  showOptionsMenu.value = false;
};

const openInNewTab = (projectId: string) => {
  const fullUrl = window.location.origin + "/project" + projectId;
  window.open(fullUrl, "_blank");
  closeOptionsMenu();
};

const moveToTrash = async (projectId: string) => {
  await projectStore.deleteProject(projectId);
  closeOptionsMenu();
};

const renameProject = (projectId: string) => {
  console.log(`Renaming project ${projectId}`);
  closeOptionsMenu();
};
</script>
