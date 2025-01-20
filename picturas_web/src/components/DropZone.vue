<template>
    <div 
      @dragover.prevent
      @dragleave.prevent
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      class="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors duration-200"
    >
      <i class="bi bi-cloud-upload text-4xl text-gray-400 mb-2"></i>
      <p class="text-gray-600 text-sm sm:text-base">Drag and drop images or a zip file here, or click to upload</p>
      <input type="file" multiple @change="handleFileInput" class="hidden" ref="fileInput" accept="image/*,.zip" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import JSZip from 'jszip';
  
  const emit = defineEmits<{
    (e: 'files-dropped', files: File[]): void;
  }>();
  
  const fileInput = ref<HTMLInputElement | null>(null);
  
  const handleDrop = async (e: DragEvent) => {
  const files = e.dataTransfer?.files;
  if (files) {
    await processFiles(Array.from(files));
  }
  };
  
  const handleFileInput = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      await processFiles(Array.from(files));
    }
  };
  
  const triggerFileInput = () => {
    fileInput.value?.click();
  };

  const processFiles = async (files: File[]) => {
    const imageFiles: File[] = [];
    for (const file of files) {
      if (file.type === 'application/zip') {
      const zip = await JSZip.loadAsync(file);
      for (const filename in zip.files) {
        if (zip.files[filename].dir) continue;
        const fileData = await zip.files[filename].async('blob');
        const imageFile = new File([fileData], filename, { type: 'image/' + filename.split('.').pop() });
        if (imageFile.type.startsWith('image/')) {
        imageFiles.push(imageFile);
        }
    }
    } else if (file.type.startsWith('image/')) {
    imageFiles.push(file);
    }
  }
  emit('files-dropped', imageFiles);
  };
  </script>