<template>
  <div class="flex-1 flex flex-col justify-center mt-20">
    <button class="bg-#5f59ee hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border mb-10" style="border-color: rgba(95, 89, 238, 0.7);">
      Create New Project
    </button>
    <p class="text-white text-4xl mb-4">Your Projects</p>
    <div class="flex flex-wrap"> 
      <li v-for="imagem in imagens" :key="imagem.url" class="mr-4 mb-4"> 
        <img 
          :src="imagem.url" 
          :alt="imagem.alt" 
          class="rounded-lg shadow-md transition-all duration-100 hover:border-4 w-100 h-80 "
          style="border-color: #5f59ee;"
        >
        <p class="text-center text-gray-300 mt-2 font-bold text-lg">{{ imagem.titulo }}</p> 
      </li>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imagens: [
        { url: 'https://picsum.photos/200/300', alt: 'Imagem 1', titulo: 'Beautiful Nature' },
        { url: 'https://picsum.photos/201/300', alt: 'Imagem 2', titulo: 'Mountain Sunset' },
        { url: 'https://picsum.photos/202/300', alt: 'Imagem 3', titulo: 'City Skyline' },
        { url: 'https://picsum.photos/203/300', alt: 'Imagem 4', titulo: 'Calm Beach' },
        { url: 'https://picsum.photos/204/300', alt: 'Imagem 5', titulo: 'Forest Pathway' },
        { url: 'https://picsum.photos/205/300', alt: 'Imagem 6', titulo: 'Sunny Day' },
        { url: 'https://picsum.photos/206/300', alt: 'Imagem 7', titulo: 'Snowy Peaks' },
        { url: 'https://picsum.photos/207/300', alt: 'Imagem 8', titulo: 'Desert Dunes' },
      ]
    }
  }
}
</script>
