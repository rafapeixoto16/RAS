<script setup lang="ts">
import { RouterView } from 'vue-router'
import Sidebar from './components/SideBar.vue'
</script>

<template>
  <div class="bg-[#0c0b11] flex space-x-32">
    <Sidebar />
    
    <div>
      <RouterView />
    </div>
  </div>
</template>
