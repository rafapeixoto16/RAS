<template>
    <div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-6">Privacy</h2>
      
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Data Usage</h3>
          <p class="text-gray-600 mb-4">Control how your data is used and shared.</p>
          <div class="space-y-4">
            <div class="flex items-center">
              <input id="analytics" type="checkbox" v-model="privacySettings.allowAnalytics" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
              <label for="analytics" class="ml-2 block text-sm text-gray-900">
                Allow usage analytics
              </label>
            </div>
            <div class="flex items-center">
              <input id="personalized-content" type="checkbox" v-model="privacySettings.allowPersonalizedContent" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
              <label for="personalized-content" class="ml-2 block text-sm text-gray-900">
                Allow personalized content recommendations
              </label>
            </div>
          </div>
        </div>
  
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Account Visibility</h3>
          <p class="text-gray-600 mb-4">Control who can see your account and projects.</p>
          <select v-model="privacySettings.accountVisibility" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="friends">Friends Only</option>
          </select>
        </div>
  
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Data Export</h3>
          <p class="text-gray-600 mb-4">Download a copy of your data.</p>
          <button @click="exportData" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Export My Data
          </button>
        </div>
  
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Account Deletion</h3>
          <p class="text-gray-600 mb-4">Permanently delete your account and all associated data.</p>
          <button @click="showDeleteAccountModal = true" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
            Delete My Account
          </button>
        </div>
      </div>
  
      <Modal v-if="showDeleteAccountModal" @close="showDeleteAccountModal = false">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Account Deletion</h3>
        <p class="text-gray-600 mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
        <div class="flex justify-end space-x-4">
          <button @click="showDeleteAccountModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button @click="deleteAccount" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Delete Account
          </button>
        </div>
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import Modal from '@/components/CustomModal.vue';
  
  const privacySettings = ref({
    allowAnalytics: true,
    allowPersonalizedContent: true,
    accountVisibility: 'public'
  });
  
  const showDeleteAccountModal = ref(false);
  
  const exportData = () => {
    console.log('Exporting user data...');
  };
  
  const deleteAccount = () => {
    console.log('Deleting account...');
    showDeleteAccountModal.value = false;
  };
  </script>  