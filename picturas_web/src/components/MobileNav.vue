<template>
  <div>
    <!-- Mobile Header -->
    <div
      class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:hidden z-50"
    >
      <router-link
        to="/dashboard" 
        style="font-size: xx-large "
        class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-purple-600 font-caveat px-4 py-2"
      >
        Picturas
      </router-link>
      <button @click="toggleMenu" class="p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          :class="{ hidden: isOpen }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          :class="{ hidden: !isOpen }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden"
      :class="{
        'opacity-0 pointer-events-none': !isOpen,
        'opacity-100': isOpen,
      }"
      @click="closeMenu"
    >
      <div
        class="fixed inset-y-0 left-0 w-64 bg-blue-50 transform transition-transform duration-300 ease-in-out flex flex-col"
        :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }"
        @click.stop
      >
        <div class="flex-grow overflow-y-auto">
          <div class="pt-20 px-4 space-y-4">
            <button
              class="flex items-center justify-center px-2 py-3 w-full bg-azure-radiance-500 text-sm xl:text-base text-white font-bold hover:bg-azure-radiance-800  rounded-xl"
              @click="handleCreateProject"
            >
              <i class="bi bi-plus mr-2 fs-5 text-[20px]"></i>
              Create a Project
          </button>

            <button
              class="flex items-center justify-center px-2 py-3 w-full bg-white hover:bg-azure-radiance-500 text-sm xl:text-base text-azure-radiance-950 hover:text-azure-radiance-50 font-bold rounded rounded-xl"
              @click="openPremiumModal"
            >
              <i class="bi bi-gem mr-2"></i>
              Try Premium for 30 days
          </button>
          </div>

          <div class="mt-8 px-4 space-y-2">
            <h2 class="text-sm font-semibold">Projects</h2>
            <MobileProjectList :projects="projectStore.projects" @close-menu="closeMenu" class="bg-blue-50" />
          </div>
        </div>
        
        <div class="px-4 py-2 border-t border-gray-200">
          <router-link
            class="flex items-center px-4 py-3 w-full bg-blue-50 text-sm xl:text-base text-gray-500 font-semibold hover:text-gray-600"
            to="/trash"
            @click="closeMenu"
          >
            <i class="bi bi-trash mr-2"></i>
            Trash
          </router-link>
        </div>

        <div class="border-t border-gray-200 p-4">
          <div v-if="isLoggedIn">
            <MobileProfileMenu @close-menu="closeMenu" class="bg-blue-50" />
          </div>
          <div v-else class="flex space-x-2">
            <router-link
              class="flex-1 flex items-center justify-center px-2 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-xl"
              to="/login"
              @click="closeMenu"
            >
              Login
            </router-link>
            <router-link
              class="flex-1 flex items-center justify-center px-2 py-3 bg-white text-blue-500 border border-blue-500 hover:bg-blue-50 rounded-xl"
              to="/register"
              @click="closeMenu"
            >
              Sign Up
            </router-link>
          </div>
        </div>
      </div>
      <premium-upgrade
        :open="isOpenPremium"
        @close="openPremiumModal"
      ></premium-upgrade>
      <ProjectNameModal 
        :is-open="isProjectModalOpen"
        @create="createProject"
        @cancel="isProjectModalOpen = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MobileProjectList from "./MobileProjectList.vue";
import MobileProfileMenu from "./MobileProfileMenu.vue";
import PremiumUpgrade from "./PremiumUpgrade.vue";
import { useAuthStore } from '@/stores/authStore';
import { ref, computed } from "vue";
import { useProjectStore } from "@/stores/projectsStore";
import router from "@/router";
import ProjectNameModal from './ProjectNameModal.vue';

const projectStore = useProjectStore();
const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn());

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
}>();
const isOpenPremium = ref(false);
const isProjectModalOpen = ref(false);

const toggleMenu = () => {
  emit("update:isOpen", !props.isOpen);
};

const closeMenu = () => {
  emit("update:isOpen", false);
};

const handleCreateProject = () => {
  isProjectModalOpen.value = true;
};

const createProject = async (name: string) => {
  try {
    const newProject = await projectStore.createProject({ name: name });
    isProjectModalOpen.value = false;
    emit("update:isOpen", false);
    if (newProject) {
      router.push(`/project/${newProject._id}`);
    }
  } catch (error) {
    console.error(error);
  }
};

const openPremiumModal = () => {
  isOpenPremium.value = !isOpenPremium.value;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');

.font-caveat {
  font-family: 'Caveat', sans-serif;
}
</style>