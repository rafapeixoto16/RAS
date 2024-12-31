<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Sidebar from './components/SideBar.vue'

import { computed } from 'vue'

const route = useRoute()
const hideSidebarRoutes = ['/login', '/register']
const showSidebar = computed(() => !hideSidebarRoutes.includes(route.path))
</script>

<template>
  <div class="bg-[#0c0b11] flex h-full">
    <Sidebar v-if="showSidebar" class="w-64" />
    <div :class="{'ml-24': showSidebar, 'ml-0': !showSidebar}" class="flex-1 overflow-auto">
      <RouterView />
    </div>
  </div>
</template>
