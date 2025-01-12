<template>
  <div class="flex-1 flex flex-col p-4 sm:p-6 md:p-8 z-10">
    <!-- Notification Pop-Up with Transition -->
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

    <!-- Drag and Drop Area -->
    <div
      class="drag-drop-area border-2 border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center mb-8"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      :class="{ 'bg-gray-100': isDragging }"
    >
      <p class="text-gray-500 mb-2 text-center">
        Drag and drop an image here, or
        <span class="text-blue-500 cursor-pointer" @click="triggerFileUpload"
          >click to upload</span
        >.
      </p>
      <input
        type="file"
        class="hidden"
        ref="fileInput"
        @change="handleFileUpload"
        accept="image/*"
      />
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
  imageUrl: string;
  lastEdited: string;
}

const projects = ref<Project[]>([
  {
    id: 1,
    title: "Beautiful Nature",
    imageUrl: "https://picsum.photos/id/10/800/600",
    lastEdited: "2 days ago",
  },
  {
    id: 2,
    title: "Mountain Sunset",
    imageUrl: "https://picsum.photos/id/29/800/600",
    lastEdited: "1 week ago",
  },
  {
    id: 3,
    title: "City Skyline",
    imageUrl: "https://picsum.photos/id/41/800/600",
    lastEdited: "3 days ago",
  },
  {
    id: 4,
    title: "Calm Beach",
    imageUrl: "https://picsum.photos/id/152/800/600",
    lastEdited: "5 days ago",
  },
  {
    id: 5,
    title: "Forest Pathway",
    imageUrl: "https://picsum.photos/id/110/800/600",
    lastEdited: "1 day ago",
  },
  {
    id: 6,
    title: "Sunny Day",
    imageUrl: "https://picsum.photos/id/106/800/600",
    lastEdited: "4 days ago",
  },
  {
    id: 7,
    title: "Snowy Peaks",
    imageUrl: "https://picsum.photos/id/65/800/600",
    lastEdited: "2 weeks ago",
  },
  {
    id: 8,
    title: "Desert Dunes",
    imageUrl: "https://picsum.photos/id/111/800/600",
    lastEdited: "6 days ago",
  },
]);

const searchQuery = ref("");
const isDragging = ref(false);
const notification = ref<string | null>(null);

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
  console.log(`renaming project with id: ${id} `);
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
  if (files && files[0]) {
    handleFile(files[0]);
  }
};

const handleFile = (file: File) => {
  const reader = new FileReader();
  reader.onload = () => {
    const imageUrl = reader.result as string;
    projects.value.unshift({
      id: Date.now(),
      title: `New Project - ${file.name}`,
      imageUrl,
      lastEdited: "just now",
    });

    // Show success notification
    showNotification("Project successfully created!");
  };
  reader.readAsDataURL(file);
};

const triggerFileUpload = () => {
  const input = fileInput.value;
  if (input) input.click();
};

const fileInput = ref<HTMLInputElement | null>(null);

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    handleFile(input.files[0]);
  }
};

// Notification Handlers
const showNotification = (message: string) => {
  notification.value = message;
  setTimeout(() => {
    notification.value = null;
  }, 3000); // Notification disappears after 3 seconds
};
</script>

<style scoped>
.drag-drop-area {
  transition: background-color 0.2s ease;
}

/* Slide and fade transition for notification */
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
