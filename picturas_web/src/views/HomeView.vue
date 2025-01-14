<template>
  <div class="flex-1 flex flex-col p-4 sm:p-6 md:p-8 z-10">
    <transition name="slide-fade">
      <div
        v-if="notification"
        class="fixed top-4 left-1/4 md:left-1/2 transform bg-azure-radiance-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        style="will-change: transform;"
      >
        {{ notification }}
      </div>
    </transition>

    <h1 class="text-3xl font-bold text-azure-radiance-500 mb-8">
      Your Projects
    </h1>
    <div class="w-full flex justify-center mb-6 sm:mb-8 mt-16 md:mt-0">
      <div class="relative w-full max-w-2xl px-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for project titles..."
          class="w-full bg-white text-gray-800 font-medium py-2 sm:py-3 px-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        />
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none"
        >
          <svg
            class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>
    </div>

    <div
      class="drag-drop-area border-2 border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center mb-8"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      :class="{ 'bg-gray-100': isDragging }"
    >
      <p class="text-gray-500 mb-2 text-center">
        Drag and drop an image here, or
        <span class="text-blue-500 cursor-pointer hover:underline" @click="triggerFileUpload"
          >click to upload</span
        >.
      </p>
      <input
        type="file"
        class="hidden"
        ref="fileInput"
        @change="handleFileUpload"
        accept="image/*"
        multiple
      />
    </div>

   <!-- Modal for Title Input -->
<div v-if="showTitleModal" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
  <div class="bg-white p-6 sm:p-8 md:p-10 rounded-lg w-full max-w-lg md:max-w-1/3">
    <h2 class="text-xl sm:text-2xl font-semibold mb-4">Enter Project Title</h2>
    <input
      v-model="titleInput"
      type="text"
      placeholder="Project Title"
      class="w-full bg-gray-100 text-gray-800 font-medium py-2 sm:py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <div class="flex justify-end mt-4">
      <button
        class="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2"
        @click="saveProject"
      >
        Save
      </button>
      <button
        class="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
        @click="closeTitleModal"
      >
        Cancel
      </button>
    </div>
  </div>
</div>


    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4"
    >
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
        :dropdown-options="[]"
        mode="default"
        @open-new-tab="openInNewTab"
        @rename="renameProject"
        @move-to-trash="moveToTrash"
        @edit="editProject"
      />
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref, computed } from "vue";
import ProjectCard from "@/components/ProjectCard.vue";

interface Project {
  id: number;
  title: string;
  imageUrls: string[];
  lastEdited: string;
}

const projects = ref<Project[]>([
  {
    id: 1,
    title: "Beautiful Nature",
    imageUrls: ["https://picsum.photos/id/10/800/600", "https://picsum.photos/id/11/800/600"],
    lastEdited: "2 days ago",
  },
  {
    id: 2,
    title: "Mountain Sunset",
    imageUrls: ["https://picsum.photos/id/29/800/600"],
    lastEdited: "1 week ago",
  },
]);

const searchQuery = ref("");
const isDragging = ref(false);
const notification = ref<string | null>(null);
const showTitleModal = ref(false);
const titleInput = ref("");
const newImageUrls = ref<string[]>([]);  // Armazenar imagens temporariamente antes de salvar

const filteredProjects = computed(() => {
  return projects.value.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const editProject = (id: number) => {
  console.log(`Editing project with id: ${id}`);
};

const openInNewTab = (id: number) => {
  const fullUrl = window.location.origin + "/project" + id;
  window.open(fullUrl, "_blank");
};

const renameProject = (id: number) => {
  console.log(`Renaming project with id: ${id}`);
};

const moveToTrash = (id: number) => {
  console.log(`Moving project with id: ${id} to trash`);
  projects.value = projects.value.filter((project) => project.id !== id);
};

// Drag and Drop Handlers
const onDragOver = () => {
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files) {
    handleFiles(Array.from(files));
  }
};

const handleFiles = (files: File[]) => {
  newImageUrls.value = [];  // Limpar a lista de imagens antes de adicionar novas
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      newImageUrls.value.push(reader.result as string);

      // Exibir a modal de título quando todas as imagens forem carregadas
      if (newImageUrls.value.length === files.length) {
        titleInput.value = '';  // Limpar o título anterior
        showTitleModal.value = true;  // Mostrar a modal de título
      }
    };
    reader.readAsDataURL(file);
  });
};

const triggerFileUpload = () => {
  const input = fileInput.value;
  if (input) input.click();
};

const fileInput = ref<HTMLInputElement | null>(null);

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    handleFiles(Array.from(input.files));
  }
};

const showNotification = (message: string) => {
  notification.value = message;
  setTimeout(() => {
    notification.value = null;
  }, 3000);
};

// Função para salvar o projeto após inserir o título
const saveProject = () => {
  if (titleInput.value.trim() === "") {
    showNotification("Por favor, insira um título para o projeto.");
    return;
  }

  // Criar um novo projeto com o título e as imagens carregadas
  const newProject = {
    id: Date.now(),
    title: titleInput.value,
    imageUrls: [...newImageUrls.value], // Usar as URLs das imagens carregadas
    lastEdited: "just now",
  };

  projects.value.unshift(newProject); // Adicionar o novo projeto à lista
  showNotification("Projeto criado com sucesso!");
  closeTitleModal(); // Fechar a modal
};

// Fechar a modal de título
const closeTitleModal = () => {
  showTitleModal.value = false;
};
</script>



<style scoped>
.drag-drop-area {
  transition: background-color 0.2s ease;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter-from {
  transform: translateY(-50%);
  opacity: 0;
}
.slide-fade-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.slide-fade-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.slide-fade-leave-to {
  transform: translateY(-50%);
  opacity: 0;
}
</style>