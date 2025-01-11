<template>
  <div class="flex-1 flex flex-col p-4 sm:p-6 md:p-8 z-10">
    <h1 class="text-3xl font-bold text-red-500 mb-8">Trash</h1>
    <div class="w-full flex justify-center mb-6 sm:mb-8 mt-16 md:mt-0">
      <div class="relative w-full max-w-2xl px-4">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search for trashed projects..." 
          class="w-full bg-white text-gray-800 font-medium py-2 sm:py-3 px-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 overflow-visible">
      <ProjectCard 
        v-for="item in filteredTrash" 
        :key="item.id" 
        :project="item"
      
        :dropdown-options="lgOnlyDropdownOptions(item)"
        mode="trash"
        @restore="restoreItem"
        @remove-permanently="deletePermanently"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ProjectCard from '@/components/ProjectCard.vue';
import MobileProjectOptions from '@/components/MobileProjectOptions.vue';

interface TrashItem {
  id: number;
  title: string;
  imageUrl: string;
  deletedAt: string;
}

const trashItems = ref<TrashItem[]>([
  { id: 1, title: 'Old Design Mockups', imageUrl: 'https://picsum.photos/id/100/800/600', deletedAt: '2 days ago' },
  { id: 2, title: 'Unused Presentation', imageUrl: 'https://picsum.photos/id/200/800/600', deletedAt: '1 week ago' },
  { id: 3, title: 'Expired Reports', imageUrl: 'https://picsum.photos/id/300/800/600', deletedAt: '3 days ago' },
  { id: 4, title: 'Outdated Resources', imageUrl: 'https://picsum.photos/id/400/800/600', deletedAt: '5 days ago' },
]);

const searchQuery = ref('');
const isLargeScreen = ref(window.innerWidth >= 1024); // `lg` breakpoint in Tailwind (1024px)

// Update the `isLargeScreen` value on window resize
window.addEventListener('resize', () => {
  isLargeScreen.value = window.innerWidth >= 1024;
});

const filteredTrash = computed(() => {
  return trashItems.value.filter(item => 
    item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const lgOnlyDropdownOptions = (item: TrashItem) => {
  if (isLargeScreen.value) {
    return [
      { label: 'Restore', icon: 'bi bi-arrow-clockwise', action: () => restoreItem(item.id) },
      { label: 'Delete Permanently', icon: 'bi bi-trash', action: () => deletePermanently(item.id) }
    ];
  }
  return []; // No dropdown options for mobile
};

const restoreItem = (id: number) => {
  console.log(`Restoring item with id: ${id}`);
  trashItems.value = trashItems.value.filter(item => item.id !== id); 
};

const deletePermanently = (id: number) => {
  console.log(`Deleting item with id: ${id} permanently`);
  trashItems.value = trashItems.value.filter(item => item.id !== id); 
};
</script>
