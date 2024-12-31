<template>
  <div class="flex-1 flex flex-col p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Your Projects</h1>
    <div class="w-full flex justify-center mb-8">
      <div class="relative w-full max-w-2xl">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search for project titles..." 
          class="w-full bg-white text-gray-800 font-medium py-3 px-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProjectCard 
        v-for="project in filteredProjects" 
        :key="project.id" 
        :project="project"
        @edit="editProject"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ProjectCard from '@/components/ProjectCard.vue';

interface Project {
  id: number;
  title: string;
  imageUrl: string;
  lastEdited: string;
}

const projects = ref<Project[]>([
  { id: 1, title: 'Beautiful Nature', imageUrl: 'https://picsum.photos/id/10/800/600', lastEdited: '2 days ago' },
  { id: 2, title: 'Mountain Sunset', imageUrl: 'https://picsum.photos/id/29/800/600', lastEdited: '1 week ago' },
  { id: 3, title: 'City Skyline', imageUrl: 'https://picsum.photos/id/41/800/600', lastEdited: '3 days ago' },
  { id: 4, title: 'Calm Beach', imageUrl: 'https://picsum.photos/id/152/800/600', lastEdited: '5 days ago' },
  { id: 5, title: 'Forest Pathway', imageUrl: 'https://picsum.photos/id/110/800/600', lastEdited: '1 day ago' },
  { id: 6, title: 'Sunny Day', imageUrl: 'https://picsum.photos/id/106/800/600', lastEdited: '4 days ago' },
  { id: 7, title: 'Snowy Peaks', imageUrl: 'https://picsum.photos/id/65/800/600', lastEdited: '2 weeks ago' },
  { id: 8, title: 'Desert Dunes', imageUrl: 'https://picsum.photos/id/111/800/600', lastEdited: '6 days ago' },
]);

const searchQuery = ref('');

const filteredProjects = computed(() => {
  return projects.value.filter(project => 
    project.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const editProject = (id: number) => {
  console.log(`Editing project with id: ${id}`);
};
</script>