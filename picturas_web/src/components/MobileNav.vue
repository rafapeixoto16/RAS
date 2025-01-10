<template>
  <div>
    <!-- Mobile Header -->
    <div
      class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:hidden z-20"
    >
      <router-link
        to="/"
        class="text-2xl font-bold text-gray-900"
        style="font-family: 'Caveat', cursive;"
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
      class="fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 md:hidden"
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
            <router-link
              class="flex items-center justify-center px-2 py-3 w-full bg-[#3B82F6] text-white hover:bg-[#2563EB] rounded-xl"
              to="/create-project"
              @click="closeMenu"
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

          <div class="mt-8 px-4 space-y-2">
            <h2 class="text-sm font-semibold">Projects</h2>
            <MobileProjectList :projects="projects" @close-menu="closeMenu" />
          </div>
        </div>

        <div class="border-t border-gray-200 p-4">
          <MobileProfileMenu @close-menu="closeMenu" />
        </div>
      </div>
      <premium-upgrade
        :open="isOpenPremium"
        @close="openPremiumModal"
      ></premium-upgrade>
    </div>
  </div>
</template>

<script setup lang="ts">
import MobileProjectList from "./MobileProjectList.vue";
import MobileProfileMenu from "./MobileProfileMenu.vue";
import PremiumUpgrade from "./PremiumUpgrade.vue";
import { ref } from "vue";
const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
}>();
const isOpenPremium = ref(false);
const projects = [
  { id: 1, name: "Project 1", link: "/project1" },
  { id: 2, name: "Project 2", link: "/project2" },
  { id: 3, name: "Project 3", link: "/project3" },
  { id: 4, name: "Project 4", link: "/project4" },
  { id: 5, name: "Project 5", link: "/project5" },
  { id: 6, name: "Project 6", link: "/project6" },
  { id: 7, name: "Project 7", link: "/project7" },
  { id: 8, name: "Project 8", link: "/project8" },
];

const toggleMenu = () => {
  emit("update:isOpen", !props.isOpen);
};

const closeMenu = () => {
  emit("update:isOpen", false);
};

const openPremiumModal = () => {
  isOpenPremium.value = !isOpenPremium.value;
};
</script>
