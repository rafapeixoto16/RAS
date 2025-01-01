<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-900 mb-6">Login & Security</h2>
    
    <div class="space-y-8">
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Email</h3>
        <div class="flex items-center justify-between">
          <p class="text-gray-600">{{ user.email }}</p>
          <button @click="showEmailModal = true" class="text-blue-600 hover:text-blue-800">Change</button>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Password</h3>
        <div class="flex items-center justify-between">
          <p class="text-gray-600">Last changed {{ user.lastPasswordChange }}</p>
          <button @click="showPasswordModal = true" class="text-blue-600 hover:text-blue-800">Change</button>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
        <div class="flex items-center justify-between">
          <p class="text-gray-600">{{ user.twoFactorEnabled ? 'Enabled' : 'Disabled' }}</p>
          <button @click="toggleTwoFactor" class="text-blue-600 hover:text-blue-800">
            {{ user.twoFactorEnabled ? 'Disable' : 'Enable' }}
          </button>
        </div>
      </div>
    </div>

    <Modal v-if="showEmailModal" @close="showEmailModal = false">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Change Email</h3>
      <form @submit.prevent="changeEmail">
        <input v-model="newEmail" type="email" placeholder="New Email" class="w-full px-3 py-2 border rounded-md mb-4" required>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Save Changes</button>
      </form>
    </Modal>

    <Modal v-if="showPasswordModal" @close="showPasswordModal = false">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
      <form @submit.prevent="changePassword">
        <input v-model="currentPassword" type="password" placeholder="Current Password" class="w-full px-3 py-2 border rounded-md mb-4" required>
        <input v-model="newPassword" type="password" placeholder="New Password" class="w-full px-3 py-2 border rounded-md mb-4" required>
        <input v-model="confirmPassword" type="password" placeholder="Confirm New Password" class="w-full px-3 py-2 border rounded-md mb-4" required>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Change Password</button>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from '@/components/CustomModal.vue';

const user = ref({
  email: 'user@example.com',
  lastPasswordChange: '3 months ago',
  twoFactorEnabled: false
});

const showEmailModal = ref(false);
const showPasswordModal = ref(false);
const newEmail = ref('');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const changeEmail = () => {
  user.value.email = newEmail.value;
  showEmailModal.value = false;
};

const changePassword = () => {
  user.value.lastPasswordChange = 'Just now';
  showPasswordModal.value = false;
};

const toggleTwoFactor = () => {
  user.value.twoFactorEnabled = !user.value.twoFactorEnabled;
};
</script>