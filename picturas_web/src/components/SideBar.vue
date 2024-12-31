<template>
    <div class="flex h-screen bg-gray-900">
        <div class="fixed left-0 flex flex-col w-1/6 h-full bg-[#1a1a2e] text-gray-400">
            <router-link class="flex items-center justify-center px-8 py-4 w-full" to="/">
                <h1 class="text-5xl font-bold text-white" style="font-family: 'Caveat', cursive;">Picturas</h1>
            </router-link>
            <div class="px-4 space-y-4">
                <router-link
                    class="flex items-center justify-center px-2 py-3 w-full bg-[#5f59ee] text-white hover:bg-[#4e48d4] rounded rounded-xl"
                    to="/create-project"
                >
                    <i class="bi bi-plus mr-2 fs-5"></i>
                    Create a Project
                </router-link>
                <router-link
                    class="flex items-center justify-center px-2 py-3 w-full bg-[#ff9800] text-white hover:bg-[#e68900] rounded rounded-xl"
                    to="/upgrade"
                >
                    <i class="bi bi-gem mr-2"></i>
                    Upgrade To Premium
                </router-link>
            </div>
            <div class="flex flex-col items-start mt-8 px-4 space-y-2 flex-grow overflow-y-auto">
                <h2 class="text-sm font-semibold">Projects</h2>
                <div class="flex flex-col text-white w-full relative">
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
                                :options="[{ label: 'Open in a new tab', icon: 'bi bi-box-arrow-up-right' }, { label: 'Move to Trash', icon: 'bi bi-trash' }]"
                                append-to-body
                            />
                        </div>
                    </div>
                    <button
                        v-if="showSeeAllButton"
                        @click="toggleSeeAll"
                        class="mt-2 text-[#5f59ee] hover:underline"
                    >
                        {{ seeAll ? 'See Less' : 'See All' }}
                    </button>
                </div>
            </div>
            <div class="flex items-center justify-between w-full p-4 mt-auto bg-[#1a1a2e]">
                <div class="flex items-center">
                    <i class="bi bi-person-circle text-4xl text-gray-400"></i>
                    <div class="ml-4">
                        <p class="text-white font-semibold">Username</p>
                        <p class="text-gray-400 text-sm">user@example.com</p>
                    </div>
                </div>
                <div class="relative">
                    <Dropdown
                        placement="top"
                        :isIcon="true"
                        trigger="bi bi-arrow-down-up text-2xl text-gray-400 cursor-pointer"
                        :options="[
                            { label: 'Profile', icon: 'bi bi-person-circle' },
                            { label: 'Settings', icon: 'bi bi-gear' },
                            { label: 'Logout', icon: 'bi bi-box-arrow-right' }
                        ]"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Dropdown from './CustomDropdown.vue'

const projects = [
    { name: 'Project 1', link: '/project1' },
    { name: 'Project 2', link: '/project2' },
    { name: 'Project 3', link: '/project3' },
    { name: 'Project 4', link: '/project4' },
    { name: 'Project 5', link: '/project5' },
    { name: 'Project 6', link: '/project6' },
    { name: 'Project 7', link: '/project7' },
    { name: 'Project 8', link: '/project8' },
    { name: 'Project 1', link: '/project1' },
    { name: 'Project 2', link: '/project2' },
    { name: 'Project 3', link: '/project3' },
    { name: 'Project 4', link: '/project4' },
    { name: 'Project 5', link: '/project5' },
    { name: 'Project 6', link: '/project6' },
    { name: 'Project 7', link: '/project7' },
    { name: 'Project 8', link: '/project8' },
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
</style>
