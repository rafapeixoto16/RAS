<template>
  <div class="flex h-screen">
    <div class="flex left-0 top-0 w-3/4 h-screen items-center justify-center bg-gray-50">
      <div class="w-3/4 h-3/4 border border-gray-300 bg-white shadow-md rounded-md flex items-center justify-center">
        <img
          v-if="imageSrc"
          :src="imageSrc"
          alt="Preview"
          class="max-w-full max-h-full object-contain"
        />
        <p v-else class="text-gray-500 text-sm">Nenhuma imagem selecionada.</p>
      </div>
    </div>
    <div class="flex-1 flex flex-col p-4 sm:p-6 md:p-8 z-10">
      <div class="fixed right-0 flex flex-col w-1/10 h-full bg-blue-100 text-gray-700 border-l border-gray-200 shadow-lg">
        <div class="flex flex-col items-start mt-8 px-4 space-y-4 flex-grow overflow-y-auto">
          <h2 class="text-sm font-semibold">Carregar Imagem</h2>
          <div class="flex flex-col items-center space-y-2">
            <input
              type="file"
              @change="handleImageUpload"
              class="file-input border border-gray-300 p-2 rounded-md cursor-pointer focus:outline-none"
            />
            <button
              @click="clearImage"
              class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Limpar Imagem
            </button>
          </div>

          <div class="mt-8">
            <h2 class="text-sm font-semibold">Edit</h2>
            <div class="flex flex-col w-full relative">
              <div style="max-width: 200px" class="px-1 space-y-2">
                <router-link
                  class="flex items-center justify-center px-2 py-3 w-full bg-[#3be3f6] text-black hover:bg-[#3bf6f3] rounded-xl"
                  to="/url1"
                >
                  <i class="bi bi-brush mr-2"></i>
                  Binarização
                </router-link>
                <router-link
                  class="flex items-center justify-center px-2 py-3 w-full bg-[#3be3f6] text-black hover:bg-[#3bf6f3] rounded-xl"
                  to="/url2"
                >
                  <i class="bi bi-brush mr-2"></i>
                  Alteração do tamanho
                </router-link>
                <router-link
                  class="flex items-center justify-center px-2 py-3 w-full bg-[#3be3f6] text-black hover:bg-[#3bf6f3] rounded-xl"
                  to="/url3"
                >
                  <i class="bi bi-brush mr-2"></i>
                  Colocação de bordos coloridos
                </router-link>
                <router-link
                  class="flex items-center justify-center px-2 py-3 w-full bg-[#3be3f6] text-black hover:bg-[#3bf6f3] rounded-xl"
                  to="/url4"
                >
                  <i class="bi bi-brush mr-2"></i>
                  Remoção do fundo da imagem
                </router-link>
                <router-link
                  class="flex items-center justify-center px-2 py-3 w-full bg-[#3be3f6] text-black hover:bg-[#3bf6f3] rounded-xl"
                  to="/url5"
                >
                  <i class="bi bi-brush mr-2"></i>
                  Passar de imagem colorida para tons de cinzento
                </router-link>
                <router-link
                  class="flex items-center justify-center px-2 py-3 w-full bg-[#3be3f6] text-black hover:bg-[#3bf6f3] rounded-xl"
                  to="/url6"
                >
                  <i class="bi bi-brush mr-2"></i>
                  Rotações
                </router-link>
                <router-link
                  class="flex items-center justify-center px-2 py-3 w-full bg-[#3be3f6] text-black hover:bg-[#3bf6f3] rounded-xl"
                  to="/url7"
                >
                  <i class="bi bi-brush mr-2"></i>
                  Alteração do brilho e contraste
                </router-link>
                <router-link
                  class="flex items-center justify-center px-2 py-3 w-full bg-[#3be3f6] text-black hover:bg-[#3bf6f3] rounded-xl"
                  to="/url8"
                >
                  <i class="bi bi-brush mr-2"></i>
                  Contar pessoas
                </router-link>
                <router-link
                  class="flex items-center justify-center px-2 py-3 w-full bg-[#3be3f6] text-black hover:bg-[#3bf6f3] rounded-xl"
                  to="/url9"
                >
                  <i class="bi bi-brush mr-2"></i>
                  Extrair texto presente na imagem
                </router-link>
                <router-link
                  class="flex items-center justify-center px-2 py-3 w-full bg-[#3be3f6] text-black hover:bg-[#3bf6f3] rounded-xl"
                  to="/url10"
                >
                  <i class="bi bi-brush mr-2"></i>
                  Identificar objetos
                </router-link>
                <router-link
                  class="flex items-center justify-center px-2 py-3 w-full bg-[#3be3f6] text-black hover:bg-[#3bf6f3] rounded-xl"
                  to="/url11"
                >
                  <i class="bi bi-brush mr-2"></i>
                  Colocar óculos em todas as pessoas
                </router-link>
                <router-link
                  class="flex items-center justify-center px-2 py-3 w-full bg-[#3be3f6] text-black hover:bg-[#3bf6f3] rounded-xl"
                  to="/url12"
                >
                  <i class="bi bi-brush mr-2"></i>
                  Colocar a linha de fora de jogo em lances de futebol
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const imageSrc = ref<string | null>(null);

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    imageSrc.value = URL.createObjectURL(file);
  }
}
function clearImage() {
  imageSrc.value = null;
}
</script>

<style scoped>
.file-input {
  width: 100%;
}
</style>