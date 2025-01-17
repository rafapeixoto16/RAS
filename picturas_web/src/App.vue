<template>
  <div class="bg-white flex min-h-screen relative">
    <Sidebar v-if="!isFullWidthRoute" class="hidden md:block fixed h-full" />

    <MobileNav v-if="!isFullWidthRoute" v-model:is-open="isMobileMenuOpen" />

    <div :class="{
      'md:ml-[16.6667%]': !isFullWidthRoute,
      'ml-0 w-full': isFullWidthRoute
    }" class="flex-1 transition-all duration-300 flex-col w-full">
      <div class="min-h-screen-app">
        <RouterView />
      </div>

      <!-- Controla a exibição do TutorialModal -->
      <TutorialModal v-if="shouldShowTutorialModal" />
      <Footer />
    </div>

    <div id="modal-target"></div>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Sidebar from './components/SideBar.vue'
import MobileNav from './components/MobileNav.vue'
import TutorialModal from './components/TutorialModal.vue'
import Footer from './components/Footer.vue'
import { ref, computed } from 'vue'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const isFullWidthRoute = computed(() => {
  return route.meta.fullWidth === true
})

const excludedPages = ['/login', '/', '/signin', '/signout']; // Rotas onde o modal não deve aparecer

// Computed para verificar se o modal deve ser exibido
const shouldShowTutorialModal = computed(() => !excludedPages.includes(route.path));

</script>