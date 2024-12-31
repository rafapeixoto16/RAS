<template>
  <div class="flex-1 flex flex-col justify-center mt-20">
    <div class="w-full flex justify-center mb-10">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search for project titles..." 
        class="w-full max-w-[800px] bg-[#1a1a2e] text-gray-400 font-bold py-2 px-4 rounded border border-[#2C293C]"
      />
    </div>
    <div class="w-fit min-w-[800px]">
      <p class="text-white text-4xl mb-4">Your Projects</p>
    </div>
    <div class="flex flex-wrap justify-start gap-4"> 
      <li v-for="imagem in filteredImagens" :key="imagem.url" class="mr-4 mb-4"> 
        <img 
          :src="imagem.url" 
          :alt="imagem.alt" 
          class="rounded-lg shadow-md transition-all duration-100 hover:border-4 w-100 h-80 border-[#5f59ee]"
        >
        <p class="text-center text-gray-300 mt-2 font-bold text-lg">{{ imagem.titulo }}</p> 
      </li>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const imagens = ref([
  { url: 'https://picsum.photos/200/300', alt: 'Imagem 1', titulo: 'Beautiful Nature' },
  { url: 'https://picsum.photos/201/300', alt: 'Imagem 2', titulo: 'Mountain Sunset' },
  { url: 'https://picsum.photos/202/300', alt: 'Imagem 3', titulo: 'City Skyline' },
  { url: 'https://picsum.photos/203/300', alt: 'Imagem 4', titulo: 'Calm Beach' },
  { url: 'https://picsum.photos/204/300', alt: 'Imagem 5', titulo: 'Forest Pathway' },
  { url: 'https://picsum.photos/205/300', alt: 'Imagem 6', titulo: 'Sunny Day' },
  { url: 'https://picsum.photos/206/300', alt: 'Imagem 7', titulo: 'Snowy Peaks' },
  { url: 'https://picsum.photos/207/300', alt: 'Imagem 8', titulo: 'Desert Dunes' },
]);

const searchQuery = ref('');

const filteredImagens = computed(() => {
  return imagens.value.filter(imagem => 
    imagem.titulo.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<style scoped>
.border-custom {
  border-color: #5f59ee;
}
</style>
