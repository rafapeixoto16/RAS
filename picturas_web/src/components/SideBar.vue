<template>
  <div class="flex h-screen">
    <div
      class="fixed left-0 flex flex-col w-1/6 h-full bg-blue-50 text-gray-700 border-r border-gray-200 shadow-lg">
      <router-link class="flex items-center justify-center px-8 py-4 w-full" to="/">
        <h1 class="text-3xl xl:text-5xl font-bold text-gray-900" style="font-family: 'Caveat', cursive;">
          Picturas
        </h1>
      </router-link>
      <div class="px-4 space-y-4">
        <button
          class="flex items-center justify-center px-2 py-3 w-full bg-azure-radiance-500 text-sm xl:text-base text-white font-bold hover:bg-azure-radiance-800  rounded-xl"
          @click="handleCreateProject">
          <i class="bi bi-plus mr-2 fs-5 text-[20px]"></i>
          Create a Project
      </button>
        <button
          class="flex items-center justify-center px-2 py-3 w-full bg-white text-sm xl:text-base text-azure-radiance-950 hover:bg-azure-radiance-500 hover:text-azure-radiance-50 font-bold rounded rounded-xl"
          @click="openPremiumModal">
          <i class="bi bi-gem mr-2"></i>
          Try Premium for 30 days
        </button>
      </div>
      <div class="flex flex-col items-start mt-8 px-4 space-y-2 flex-grow overflow-y-auto">
        <h2 class="text-sm font-semibold">Projects</h2>
        <div class="flex flex-col w-full relative">
          <div v-for="project in visibleProjects" :key="project.name" class="relative group w-full">
            <router-link class="block p-4 rounded w-full" :to="'project/' + project._id">
              {{ project.name }}
            </router-link>
            <div
              class="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Dropdown placement="right" trigger="..." :isSidebar="true" :project="project"
                :options="getDropdownOptions(project)" @open-new-tab="openInNewTab" @rename="renameProject"
                @move-to-trash="moveToTrash" append-to-body class="bg-blue-50"/>
            </div>
          </div>
          <button v-if="showSeeAllButton" @click="toggleSeeAll" class="mt-2 text-[#3B82F6] hover:underline">
            {{ seeAll ? "See Less" : "See All" }}
          </button>
        </div>
      </div>
      <div class="px-4 py-2 border-t border-gray-200">
        <router-link
          class="flex items-center px-4 py-3 w-full bg-blue-50 text-sm xl:text-base text-gray-500 font-semibold hover:text-gray-600"
          to="/trash">
          <i class="bi bi-trash mr-2"></i>
          Trash
        </router-link>
      </div>
      <div v-if="isLoggedIn">
        <ProfileMenu />
      </div>
      <div v-else class="flex items-center justify-between space-x-2 px-4">
        <router-link
          class="flex items-center justify-center w-1/2 py-3 bg-[#3B82F6] text-sm xl:text-base text-white hover:bg-[#2563EB] rounded-xl"
          to="/login">
          <i class="bi bi-box-arrow-in-right mr-2"></i>
          Log In
        </router-link>
        <router-link
          class="flex items-center justify-center w-1/2 py-3 bg-white text-sm xl:text-base text-[#3B82F6] hover:bg-gray-100 border border-[#3B82F6] rounded-xl"
          to="/register">
          <i class="bi bi-person-plus mr-2"></i>
          Sign Up
        </router-link>
      </div>
      <premium-upgrade :open="isOpenPremium" @close="openPremiumModal"></premium-upgrade>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import Dropdown from './CustomDropdown.vue'
import ProfileMenu from './ProfileMenu.vue';
import PremiumUpgrade from './PremiumUpgrade.vue';
import type { Project } from '@/types/project';
import { useProjectStore } from '@/stores/projectsStore';
import router from '@/router';

const authStore = useAuthStore();
const projectStore = useProjectStore()
const isLoggedIn = computed(() => authStore.isLoggedIn());
const emit = defineEmits(["open-new-tab", "rename", "move-to-trash"]);

const getDropdownOptions = (project: Project) => {
  return [
    {
      label: "Open in New Tab",
      icon: "bi-box-arrow-up-right",
      action: () => emit("open-new-tab", project._id),
    },
    {
      label: "Rename",
      icon: "bi-pencil",
      action: () => emit("rename", project._id),
    },
    {
      label: "Move to Trash",
      icon: "bi-trash",
      action: () => emit("move-to-trash", project._id),
    },
  ];
};

const openInNewTab = (id: number) => {
  const fullUrl = window.location.origin + "/project/" + id;
  window.open(fullUrl, "_blank");
};

const renameProject = (id: number) => {
  // openRenameModal();
  //showRenameForm.value = true;
  console.log(`renaming project with id: ${id} `);
};

const handleCreateProject = async () => {
  try{
    const newProject = await projectStore.createProject({ name: "ola" });
    if (newProject) {
      router.push(`/project/${newProject._id}`);
    }
  } catch (error) {
    console.log(error);
  }
};

const moveToTrash = async (id: string) => {
  await projectStore.deleteProject(id);
};

const seeAll = ref(false);
const isOpenPremium = ref(false);

const visibleProjects = computed<Project[]>(() => {
  return seeAll.value ? projectStore.projects : projectStore.projects.slice(0, 7);
});

const showSeeAllButton = computed(() => {
  return projectStore.projects.length > 7;
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
  background: #F5F7FA;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #3B82F6;
  border-radius: 10px;
  border: 2px solid #F5F7FA;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #2563EB;
}

.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #3B82F6 #F5F7FA;
}
</style>