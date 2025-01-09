<template>
  <div class="flex-1 flex flex-col p-4 sm:p-6 md:p-8 z-10">
    <h1 class="text-3xl font-bold text-red-500 mb-8">Trash</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 overflow-visible">
      <ProjectCard 
        v-for="item in filteredTrash" 
        :key="item.id" 
        :project="item"
        :dropdown-options="[
          { label: 'Restore', icon: 'bi bi-arrow-clockwise', action: () => restoreItem(item.id) },
          { label: 'Delete Permanently', icon: 'bi bi-trash', action: () => deletePermanently(item.id) }
        ]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ProjectCard from '@/components/ProjectCard.vue';

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

const filteredTrash = computed(() => {
  return trashItems.value.filter(item => 
    item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const restoreItem = (id: number) => {
  console.log(`Restoring item with id: ${id}`);
  trashItems.value = trashItems.value.filter(item => item.id !== id); 
};

const deletePermanently = (id: number) => {
  console.log(`Deleting item with id: ${id} permanently`);
  trashItems.value = trashItems.value.filter(item => item.id !== id); 
};
</script>
