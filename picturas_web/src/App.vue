<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Sidebar from './components/SideBar.vue'
import MobileNav from './components/MobileNav.vue'
import { ref, computed } from 'vue'

const route = useRoute()
const hideSidebarRoutes = ['/login', '/register', '/profile', '/settings', '/forgot-password']
const showSidebar = computed(() => !hideSidebarRoutes.includes(route.path))
const isMobileMenuOpen = ref(false)
</script>

<template>
  <div class="bg-white flex min-h-screen relative">
    <!-- Desktop Sidebar -->
    <Sidebar 
      v-if="showSidebar" 
      class="hidden md:block fixed h-full" 
    />
    
    <!-- Mobile Navigation -->
    <MobileNav 
      v-if="showSidebar"
      v-model:is-open="isMobileMenuOpen" 
    />

    <!-- Main Content -->
    <div 
      :class="{
        'md:ml-[16.6667%]': showSidebar,
        'ml-0 w-full': !showSidebar
      }" 
      class="flex-1 transition-all duration-300"
    >
      <RouterView />
    </div>
  </div>
</template>