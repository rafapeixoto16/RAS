<template>
  <div class="flex-1 flex flex-col justify-center mt-20">
    <p class="text-white text-4xl mb-4">Home</p>
    <div class="flex flex-wrap"> 
      <li v-for="imagem in imagens" :key="imagem.url" class="mr-4 mb-4"> 
        <img :src="imagem.url" :alt="imagem.titulo">
        <p>{{ imagem.titulo }}</p>
      </li>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imagens: [
        { url: 'https://picsum.photos/200/300', alt: 'Imagem 1' },
        { url: 'https://picsum.photos/201/300', alt: 'Imagem 2' },
        { url: 'https://picsum.photos/200/300', alt: 'Imagem 3' },
        { url: 'https://picsum.photos/200/300', alt: 'Imagem 4' },
        { url: 'https://picsum.photos/200/300', alt: 'Imagem 5' },
        { url: 'https://picsum.photos/200/300', alt: 'Imagem 6' },
        { url: 'https://picsum.photos/200/300', alt: 'Imagem 7' },
        { url: 'https://picsum.photos/200/300', alt: 'Imagem 8' },
        // Add more image objects here
      ]
    }
  }
}
</script>
