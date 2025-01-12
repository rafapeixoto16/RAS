<template>
  <div class="flex h-screen">
    <div
      class="fixed left-0 flex flex-col w-1/6 h-full bg-blue-50 text-gray-700 border-r border-gray-200 shadow-lg"
    >
      <router-link
        class="flex items-center justify-center px-8 py-4 w-full"
        to="/"
      >
        <h1
          class="text-3xl xl:text-5xl font-bold text-gray-900"
          style="font-family: 'Caveat', cursive;"
        >
          Picturas
        </h1>
      </router-link>
      <div class="px-4 space-y-4">
        <router-link
          class="flex items-center justify-center px-2 py-3 w-full bg-[#3B82F6] text-sm xl:text-base text-white hover:bg-[#2563EB] rounded-xl"
          to="/create-project"
        >
          <i class="bi bi-plus mr-2 fs-5"></i>
          Create a Project
        </router-link>
        <a
          href="#"
          class="flex items-center justify-center px-2 py-3 w-full bg-[#ff9800] text-sm xl:text-base text-white hover:bg-[#e68900] rounded rounded-xl"
          @click="openPremiumModal"
        >
          <i class="bi bi-gem mr-2"></i>
          Try Pro for 30 days
        </a>
      </div>
      <div
        class="flex flex-col items-start mt-8 px-4 space-y-2 flex-grow overflow-y-auto"
      >
        <h2 class="text-sm font-semibold">Projects</h2>
        <div class="flex flex-col w-full relative">
          <div
            v-for="project in visibleProjects"
            :key="project.title"
            class="relative group w-full"
          >
            <router-link
              class="block p-4 rounded w-full"
              :to="'project' + project.id"
            >
              {{ project.title }}
            </router-link>
            <div
              class="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <Dropdown
                placement="right"
                trigger="..."
                :project="project"
                :options="getDropdownOptions(project)"
                @open-new-tab="openInNewTab"
                @rename="renameProject"
                @move-to-trash="moveToTrash"
                append-to-body
              />
            </div>
          </div>
          <button
            v-if="showSeeAllButton"
            @click="toggleSeeAll"
            class="mt-2 text-[#3B82F6] hover:underline"
          >
            {{ seeAll ? "See Less" : "See All" }}
          </button>
        </div>
      </div>
      <div class="px-4 py-2 border-t border-gray-200">
        <router-link
          class="flex items-center px-4 py-3 w-full bg-red-500 text-sm xl:text-base text-white hover:bg-red-600 rounded-xl"
          to="/trash"
        >
          <i class="bi bi-trash mr-2"></i>
          Trash
        </router-link>
      </div>
      <div class="mt-auto w-full">
        <ProfileMenu />
      </div>
      <premium-upgrade
        :open="isOpenPremium"
        @close="openPremiumModal"
      ></premium-upgrade>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Dropdown from "./CustomDropdown.vue";
import ProfileMenu from "./ProfileMenu.vue";
import PremiumUpgrade from "./PremiumUpgrade.vue";

interface Project {
  id: number;
  title: string;
  imageUrl: string;
  lastEdited: string;
}

const projects = ref<Project[]>([
  {
    id: 1,
    title: "Beautiful Nature",
    imageUrl: "https://picsum.photos/id/10/800/600",
    lastEdited: "2 days ago",
  },
  {
    id: 2,
    title: "Mountain Sunset",
    imageUrl: "https://picsum.photos/id/29/800/600",
    lastEdited: "1 week ago",
  },
  {
    id: 3,
    title: "City Skyline",
    imageUrl: "https://picsum.photos/id/41/800/600",
    lastEdited: "3 days ago",
  },
  {
    id: 4,
    title: "Calm Beach",
    imageUrl: "https://picsum.photos/id/152/800/600",
    lastEdited: "5 days ago",
  },
  {
    id: 5,
    title: "Forest Pathway",
    imageUrl: "https://picsum.photos/id/110/800/600",
    lastEdited: "1 day ago",
  },
  {
    id: 6,
    title: "Sunny Day",
    imageUrl: "https://picsum.photos/id/106/800/600",
    lastEdited: "4 days ago",
  },
  {
    id: 7,
    title: "Snowy Peaks",
    imageUrl: "https://picsum.photos/id/65/800/600",
    lastEdited: "2 weeks ago",
  },
  {
    id: 8,
    title: "Desert Dunes",
    imageUrl: "https://picsum.photos/id/111/800/600",
    lastEdited: "6 days ago",
  },
]);

const emit = defineEmits<{
  (e: "open-new-tab", id: number): void;
  (e: "rename", id: number): void;
  (e: "move-to-trash", id: number): void;
}>();

// Handle Dropdown Options Based on Mode
const getDropdownOptions = (project: Project) => {
  return [
    {
      label: "Open in New Tab",
      icon: "bi-box-arrow-up-right",
      action: () => emit("open-new-tab", project.id),
    },
    {
      label: "Rename",
      icon: "bi-pencil",
      action: () => emit("rename", project.id),
    },
    {
      label: "Move to Trash",
      icon: "bi-trash",
      action: () => emit("move-to-trash", project.id),
    },
  ];
  return [];
};

const openInNewTab = (id: number) => {
  const fullUrl = window.location.origin + "/project" + id;
  window.open(fullUrl, "_blank");
};

const renameProject = (id: number) => {
  console.log(`renaming project with id: ${id} `);
};

const moveToTrash = (id: number) => {
  console.log(`Moving project with id: ${id} to trash`);
  projects.value = projects.value.filter((project) => project.id !== id);
};

const seeAll = ref(false);
const isOpenPremium = ref(false);

const visibleProjects = computed(() => {
  return seeAll.value ? projects : projects.value.slice(0, 7);
});

const showSeeAllButton = computed(() => {
  return projects.value.length > 7;
});

const toggleSeeAll = () => {
  seeAll.value = !seeAll.value;
};

const openPremiumModal = () => {
  isOpenPremium.value = !isOpenPremium.value;
};
</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
.overflow-y-auto {
  overflow-y: auto;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f5f7fa;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #3b82f6;
  border-radius: 10px;
  border: 2px solid #f5f7fa;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #2563eb;
}

.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #f5f7fa;
}
</style>
