<template>
    <div class="space-y-2">
      <div 
        v-for="(item, index) in modelValue" 
        :key="index"
        class="flex items-center justify-between bg-gray-100 p-2 rounded group"
        draggable="true"
        @dragstart="onDragStart($event, index)"
        @dragover.prevent
        @dragenter.prevent="onDragEnter($event, index)"
        @drop.prevent="onDrop($event, index)"
        :class="{ 'border-2 border-blue-500 border-dashed': isDraggingOver === index }"
      >
        <div class="flex items-center gap-2">
          <button 
            class="cursor-move text-gray-400 hover:text-gray-600 focus:outline-none"
            @mousedown="preventDragHandlerPropagation"
          >
            <GripVertical class="h-4 w-4" />
          </button>
          <span>{{ item.filterName }}</span>
        </div>
        <button 
          @click="$emit('remove', index)" 
          class="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 class="h-4 w-4" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { GripVertical, Trash2 } from 'lucide-vue-next'
  import type { Tool } from '@/types/project'
  import { useProjectStore } from '@/stores/projectsStore';
  
  const props = defineProps<{
    modelValue: Tool[]
    projectId: string
  }>()

  const projectsStore = useProjectStore();
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: Tool[]): void
    (e: 'remove', index: number): void
  }>()
  
  const isDraggingOver = ref<number | null>(null)
  let draggedItem: number | null = null
  
  const onDragStart = (event: DragEvent, index: number) => {
    draggedItem = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      const dragGhost = document.createElement('div')
      dragGhost.classList.add('bg-white', 'p-2', 'rounded', 'shadow-lg', 'text-sm')
      dragGhost.textContent = props.modelValue[index].filterName
      document.body.appendChild(dragGhost)
      event.dataTransfer.setDragImage(dragGhost, 0, 0)
      setTimeout(() => document.body.removeChild(dragGhost), 0)
    }
  }
  
  const onDragEnter = (event: DragEvent, index: number) => {
    isDraggingOver.value = index
  }
  
const onDrop = async (event: DragEvent, dropIndex: number) => {
    isDraggingOver.value = null
    if (draggedItem === null || draggedItem === dropIndex) return

    try {
        await projectsStore.reorderProjectTool(props.projectId, draggedItem, dropIndex)
        emit('update:modelValue', [...props.modelValue])
    } catch (error) {
        console.error('Error reordering tool:', error)
    } finally {
        draggedItem = null
    }
}
  
  const preventDragHandlerPropagation = (event: MouseEvent) => {
    event.preventDefault()
  }
  </script>
  
  <style scoped>
  .group:hover {
    background-color: rgb(243 244 246);
  }
  
  .group:active {
    background-color: rgb(229 231 235);
  }
  </style>