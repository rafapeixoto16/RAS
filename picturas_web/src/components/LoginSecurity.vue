<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-900 mb-6">Login & Security</h2>
    
    <div class="space-y-8">
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Email</h3>
        <div class="flex items-center justify-between">
          <p class="text-gray-600">{{ user.email }}</p>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Password</h3>
        <div class="flex items-center justify-between">
            <p class="text-gray-600">{{ '•'.repeat(8) }}</p>
          <button @click="showPasswordModal = true" class="text-blue-600 hover:text-blue-800">Change</button>
        </div>
      </div>
    </div>

    <Modal v-if="showPasswordModal" @close="showPasswordModal = false">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
      <form @submit.prevent="changePassword">
      <input v-model="newPassword" type="password" placeholder="New Password" class="w-full px-3 py-2 border rounded-md mb-4" required>
      <input v-model="confirmPassword" type="password" placeholder="Confirm New Password" class="w-full px-3 py-2 border rounded-md mb-4" required>
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Change Password</button>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getUserInfo } from '@/api/queries/getUserInfo';
import { changeUserPassword } from '@/api';
import Modal from '@/components/CustomModal.vue';
import { useAuthStore } from '@/stores/authStore';

const user = ref({
  email: '',
  password: '',
});

onMounted(async () => {
  try {
    const userInfo = await getUserInfo(useAuthStore().accessToken || '');
    user.value.email = userInfo.email;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
  }
});

const showPasswordModal = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');

const changePassword = async () => {
  user.value.password = newPassword.value;
  showPasswordModal.value = false;

  try{
    await changeUserPassword(newPassword.value, useAuthStore().accessToken ?? '')
  } catch(error){
    console.error('Failed to change password', error);
  }
};
</script>