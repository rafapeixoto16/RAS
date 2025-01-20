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
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
          <div class="flex items-center justify-between">
            <p class="text-gray-600">{{ user.otpEnabled? 'Enabled' : 'Disabled' }}</p>
            <button @click="toggleTwoFactor" class="text-blue-600 hover:text-blue-800">
              {{ user.otpEnabled? 'Disable' : 'Enable' }}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Account Deletion</h3>
        <p class="text-gray-600 mb-4">Permanently delete your account and all associated data.</p>
        <button @click="showDeleteAccountModal = true" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
          Delete My Account
        </button>
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

    <Modal v-if="showDeleteAccountModal" @close="showDeleteAccountModal = false" :hasClose="false">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Account Deletion</h3>
        <p class="text-gray-600 mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
        <div class="flex justify-end space-x-4">
          <button @click="showDeleteAccountModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button @click="deleteAccountUser" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Delete Account
          </button>
        </div>
      </Modal>
  </div>

  <QRCodeModal v-if="showQRCodeModal" :url="otpUrl" @close="showQRCodeModal = false" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getUserInfo } from '@/api/queries/getUserInfo';
import { changeUserPassword } from '@/api';
import Modal from '@/components/CustomModal.vue';
import { useAuthStore } from '@/stores/authStore';
import QRCodeModal from '@/components/QrCodeModal.vue';
import { activateOtp, deactivateOtp } from '@/api';
import { deleteAccount } from '@/api';
import router from '@/router';


const user = ref({
  email: '',
  password: '',
  otpEnabled: false,
});

onMounted(async () => {
  try {
    const userInfo = await getUserInfo(useAuthStore().accessToken || '');
    user.value.email = userInfo.email;
    user.value.otpEnabled = userInfo.otpEnabled;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
  }
});

const showQRCodeModal = ref(false);
const showPasswordModal = ref(false);
const showDeleteAccountModal = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');
const otpUrl = ref('');


const changePassword = async () => {
  user.value.password = newPassword.value;
  showPasswordModal.value = false;

  try{
    await changeUserPassword(newPassword.value, useAuthStore().accessToken ?? '')
  } catch(error){
    console.error('Failed to change password', error);
  }
};

const toggleTwoFactor = async () => {
  user.value.otpEnabled = !user.value.otpEnabled;

  try {
    if (user.value.otpEnabled) {
      const { totp } = await activateOtp(useAuthStore().accessToken ?? '');
      otpUrl.value = totp;
      showQRCodeModal.value = true;
    } else {
      await deactivateOtp(useAuthStore().accessToken ?? '');
    }
  } catch (error) {
    console.error('Failed to toggle two-factor authentication:', error);
  }
};

const deleteAccountUser = async () => {
    await deleteAccount(useAuthStore().accessToken ?? '');
    showDeleteAccountModal.value = false;
    router.push('/login');
};
</script>