<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Scan QR Code</h3>
        <div class="flex justify-center mb-4">
          <qrcode-vue :value="url" :size="200" level="H" />
        </div>
        <p class="text-sm text-gray-600 mb-4 text-center">
          Scan this QR code with your authenticator app to set up two-factor authentication.
        </p>
        <button
          @click="$emit('close')"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import QrcodeVue from 'qrcode.vue';
  
  defineProps<{
    url: string;
  }>();
  
  defineEmits<{
    (e: 'close'): void;
  }>();
  </script>
  