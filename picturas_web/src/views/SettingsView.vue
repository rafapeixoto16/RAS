<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8 mt-16 sm:mt-0">
        <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
        <button @click="goHome" class="text-blue-600 hover:underline">Back to Home</button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <nav class="space-y-2">
          <button
            v-for="section in sections"
            :key="section.id"
            @click="activeSection = section.id"
            class="w-full text-left px-4 py-2 rounded-lg transition-colors duration-200"
            :class="activeSection === section.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'"
          >
            {{ section.title }}
          </button>
        </nav>

        <div class="bg-white shadow rounded-lg p-6">
          <component :is="activeComponent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import LoginSecurity from '@/components/LoginSecurity.vue';
import PurchaseHistory from '@/components/PurchaseHistory.vue';
import Billing from '@/components/CustomBilling.vue';

const sections = [
  { id: 'login-security', title: 'Login & Security', component: LoginSecurity },
  { id: 'purchase-history', title: 'Purchase History', component: PurchaseHistory },
  { id: 'billing', title: 'Billing', component: Billing },
];

const activeSection = ref(sections[0].id);

const activeComponent = computed(() => {
  const section = sections.find(s => s.id === activeSection.value);
  return section ? section.component : null;
});

const router = useRouter();
const goHome = () => {
  router.push('/dashboard');
};
</script>
<style scoped>
.min-h-screen {
    min-height: calc(100vh - 5.3vh);
  }
</style>