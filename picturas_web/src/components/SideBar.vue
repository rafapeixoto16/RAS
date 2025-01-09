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
        <router-link
          class="flex items-center justify-center px-2 py-3 w-full bg-[#ff9800] text-sm xl:text-base text-white hover:bg-[#e68900] rounded rounded-xl"
          to="/upgrade"
        >
          <i class="bi bi-gem mr-2"></i>
          Upgrade To Premium
        </router-link>
      </div>
      <div
        class="flex flex-col items-start mt-8 px-4 space-y-2 flex-grow overflow-y-auto"
      >
        <h2 class="text-sm font-semibold">Projects</h2>
        <div class="flex flex-col w-full relative">
          <div
            v-for="project in visibleProjects"
            :key="project.name"
            class="relative group w-full"
          >
            <router-link class="block p-4 rounded w-full" :to="project.link">
              {{ project.name }}
            </router-link>
            <div
              class="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <Dropdown
                placement="right"
                trigger="..."
                :options="[
                  {
                    label: 'Open in a new tab',
                    icon: 'bi bi-box-arrow-up-right',
                    route: project.link,
                    target: true,
                  },
                  { label: 'Move to Trash', icon: 'bi bi-trash' },
                ]"
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
      <div class="mt-auto w-full">
        <ProfileMenu />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Dropdown from "./CustomDropdown.vue";
import ProfileMenu from "./ProfileMenu.vue";

const projects = [
  { name: "Project 1", link: "/project1" },
  { name: "Project 2", link: "/project2" },
  { name: "Project 3", link: "/project3" },
  { name: "Project 4", link: "/project4" },
  { name: "Project 5", link: "/project5" },
  { name: "Project 6", link: "/project6" },
  { name: "Project 7", link: "/project7" },
  { name: "Project 8", link: "/project8" },
  { name: "Project 1", link: "/project1" },
  { name: "Project 2", link: "/project2" },
  { name: "Project 3", link: "/project3" },
  { name: "Project 4", link: "/project4" },
  { name: "Project 5", link: "/project5" },
  { name: "Project 6", link: "/project6" },
  { name: "Project 7", link: "/project7" },
  { name: "Project 8", link: "/project8" },
];

const seeAll = ref(false);

const visibleProjects = computed(() => {
  return seeAll.value ? projects : projects.slice(0, 7);
});

const showSeeAllButton = computed(() => {
  return projects.length > 7;
});

const toggleSeeAll = () => {
  seeAll.value = !seeAll.value;
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
