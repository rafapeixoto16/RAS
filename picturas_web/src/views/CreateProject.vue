<template>
  <div class="flex flex-col md:flex-row min-h-screen">
    <!-- Preview Area -->
    <div class="w-full md:w-3/4 p-4 bg-gray-50 flex items-center justify-center">
      <div class="w-full max-w-4xl">
        <!-- Upload Area quando não há imagens -->
        <div v-if="images.length === 0" class="flex justify-center">
          <div 
            class="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white hover:border-blue-500 transition-colors cursor-pointer"
            @drop.prevent="handleDrop"
            @dragover.prevent
            @dragenter.prevent
          >
            <input
              type="file"
              ref="fileInput"
              @change="handleFileUpload"
              accept="image/*,.zip"
              multiple
              class="hidden"
            />
            <button 
              @click="triggerFileInput"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <i class="bi bi-upload mr-2"></i>
              Carregar Arquivos
            </button>
            <p class="text-gray-500 text-sm mt-2">ou arraste e solte aqui</p>
            <p class="text-gray-400 text-xs mt-1">Suporta imagens ou ZIP</p>
          </div>
        </div>

        <!-- Grid de imagens quando existem imagens -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Botão de Upload Adicional -->
          <div class="relative h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white hover:border-blue-500 transition-colors">
            <input
              type="file"
              ref="additionalFileInput"
              @change="handleFileUpload"
              accept="image/*,.zip"
              multiple
              class="hidden"
            />
            <button 
              @click="triggerAdditionalFileInput"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <i class="bi bi-plus-lg mr-2"></i>
              Adicionar Mais
            </button>
            <p class="text-gray-400 text-xs mt-2">Imagens ou ZIP</p>
          </div>

          <!-- Image Previews -->
          <div
            v-for="(image, index) in images"
            :key="index"
            class="relative h-64 border border-gray-300 rounded-lg bg-white shadow-md group"
          >
            <img
              :src="image.url"
              :alt="`Preview ${index + 1}`"
              class="w-full h-full object-contain rounded-lg p-2"
            />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
              <button
                @click="removeImage(index)"
                class="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="w-full md:w-1/4 bg-blue-100 border-l border-gray-200 shadow-lg">
      <div class="sticky top-0 p-4 max-h-screen overflow-y-auto">
        <h2 class="text-lg font-semibold mb-4">Editar</h2>
        <div class="space-y-2">
          <router-link
            v-for="(option, index) in editOptions"
            :key="index"
            :to="option.url"
            class="flex items-center px-4 py-3 bg-[#3be3f6] text-black hover:bg-[#3bf6f3] rounded-xl transition-colors"
          >
            <i class="bi bi-brush mr-2"></i>
            {{ option.label }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
      <p class="text-white">{{ loadingMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import JSZip from 'jszip'

interface ImageInfo {
  url: string
  file: File
}

const images = ref<ImageInfo[]>([])
const isLoading = ref(false)
const loadingMessage = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const additionalFileInput = ref<HTMLInputElement | null>(null)

const editOptions = [
  { label: 'Binarização', url: '/edit/binary' },
  { label: 'Alteração do tamanho', url: '/edit/resize' },
  { label: 'Colocação de bordos coloridos', url: '/edit/borders' },
  { label: 'Remoção do fundo da imagem', url: '/edit/background' },
  { label: 'Passar de imagem colorida para tons de cinzento', url: '/edit/grayscale' },
  { label: 'Rotações', url: '/edit/rotate' },
  { label: 'Alteração do brilho e contraste', url: '/edit/brightness' },
  { label: 'Contar pessoas', url: '/edit/count-people' },
  { label: 'Extrair texto presente na imagem', url: '/edit/ocr' },
  { label: 'Identificar objetos', url: '/edit/objects' },
  { label: 'Colocar óculos em todas as pessoas', url: '/edit/glasses' },
  { label: 'Colocar a linha de fora de jogo em lances de futebol', url: '/edit/offside' }
]

const triggerFileInput = () => {
  fileInput.value?.click()
}

const triggerAdditionalFileInput = () => {
  additionalFileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    await processFiles(Array.from(target.files))
  }
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files) {
    await processFiles(Array.from(files))
  }
}

const processFiles = async (files: File[]) => {
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      await processImage(file)
    } else if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
      await processZipFile(file)
    }
  }
}

const processImage = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('Por favor, carregue apenas arquivos de imagem')
    return
  }

  isLoading.value = true
  loadingMessage.value = 'Processar imagem...'
  try {
    const url = URL.createObjectURL(file)
    images.value.push({ url, file })
  } catch (error) {
    console.error('Erro ao processar imagem:', error)
    alert('Erro ao processar imagem')
  } finally {
    isLoading.value = false
    loadingMessage.value = ''
  }
}

const processZipFile = async (zipFile: File) => {
  isLoading.value = true
  loadingMessage.value = 'Processar arquivo ZIP...'
  try {
    const zip = new JSZip()
    const contents = await zip.loadAsync(zipFile)
    
    for (const [filename, file] of Object.entries(contents.files)) {
      if (!file.dir && isImageFileName(filename)) {
        loadingMessage.value = `Extrair ${filename}...`
        const blob = await file.async('blob')
        const imageFile = new File([blob], filename, { 
          type: getImageMimeType(filename) 
        })
        await processImage(imageFile)
      }
    }
  } catch (error) {
    console.error('Erro ao processar arquivo ZIP:', error)
    alert('Erro ao processar arquivo ZIP')
  } finally {
    isLoading.value = false
    loadingMessage.value = ''
  }
}

const isImageFileName = (filename: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext))
}

const getImageMimeType = (filename: string): string => {
  const ext = filename.toLowerCase().split('.').pop()
  const mimeTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'bmp': 'image/bmp',
    'webp': 'image/webp',
    'tiff': 'image/tiff'
  }
  return mimeTypes[ext || ''] || 'image/jpeg'
}

const removeImage = (index: number) => {
  URL.revokeObjectURL(images.value[index].url)
  images.value.splice(index, 1)
}

onUnmounted(() => {
  images.value.forEach(image => {
    URL.revokeObjectURL(image.url)
  })
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>