<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Sidebar from './components/SideBar.vue'

import { computed } from 'vue'

const route = useRoute()
const hideSidebarRoutes = ['/login', '/register']
const showSidebar = computed(() => !hideSidebarRoutes.includes(route.path))
</script>

<template>
  <div class="bg-[#0c0b11] flex space-x-18">
    <Sidebar v-if="showSidebar" />
    
    <div :class="showSidebar ? 'flex justify-center items-center w-full h-full' : 'w-full h-full'">
      <RouterView />
    </div>
  </div>
</template>
