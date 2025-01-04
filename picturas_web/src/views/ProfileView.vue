<template>
  <div class="flex relative">
    <!-- Sidebar -->
    <div class="w-64 h-screen bg-gray-800 text-white p-6">
      <div class="flex flex-col items-center">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-8" style='font-family: "Caveat", cursive;'>PICTURAS</h1>
        <nav class="flex flex-col space-y-4">
          <a href="#home" class="hover:bg-gray-700 py-2 px-4 rounded-md">Home</a>
          <a href="#settings" class="hover:bg-gray-700 py-2 px-4 rounded-md">Settings</a>
        </nav>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col p-4 sm:p-6 md:p-8 w-full max-w-[1600px] mx-auto mt-16 md:mt-0">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-12">
        <h1 class="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Your Profile</h1>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-4 sm:p-8 md:p-12">
        <div class="flex flex-col md:flex-row md:gap-12 lg:gap-24">
          <div class="w-full md:w-1/4 flex justify-center mb-8 md:mb-0">
            <!-- Avatar -->
            <UserAvatar
              :image-url="user.avatarUrl"
              :username="user.username"
            />
          </div>
          <div class="w-full md:w-3/4">
            <!-- Edit Profile Button inside the profile rectangle -->
            <div class="flex justify-end mb-4">
              <button
                v-if="!isEditing"
                @click="startEditing"
                class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white text-base sm:text-lg rounded-full hover:bg-blue-600 transition-colors duration-300"
              >
                Edit Profile
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div v-for="(item, index) in userInfoItems" :key="index" class="flex flex-col space-y-2">
                <label class="text-gray-600 text-base sm:text-lg font-medium">{{ item.label }}</label>
                <input
                  v-if="isEditing && item.editable"
                  :value="item.value"
                  @input="updateUserInfo(item.key, ($event.target as HTMLInputElement).value)"
                  class="w-full bg-white border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div 
                  v-else 
                  class="text-gray-800 text-base sm:text-lg py-2 sm:py-3"
                >
                  {{ item.value }}
                </div>
                <div v-if="index < userInfoItems.length - 1" class="border-b border-gray-100 mt-4"></div>
              </div>
            </div>
            <div v-if="isEditing" class="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                @click="cancelEditing"
                class="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gray-100 text-gray-700 text-base sm:text-lg rounded-full hover:bg-gray-200 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                @click="saveChanges"
                class="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-blue-500 text-white text-base sm:text-lg rounded-full hover:bg-blue-600 transition-colors duration-300"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirmation Modal -->
  <ConfirmationModal
    v-if="showConfirmationModal"
    :changes="changedFields"
    @confirm="confirmChanges"
    @cancel="cancelChanges"
  />
</template>





<script setup lang="ts">
import { ref, computed } from 'vue';
import UserAvatar from '@/components/UserAvatar.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

interface User {
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  location: string;
  bio: string;
}

const user = ref<User>({
  username: 'johndoe',
  email: 'john.doe@example.com',
  fullName: 'John Doe',
  avatarUrl: '',
  location: 'New York, USA',
  bio: 'Passionate photographer and digital artist',
});

const originalUser = ref<User>({ ...user.value });
const isEditing = ref(false);
const showConfirmationModal = ref(false);

const userInfoItems = computed(() => [
  { label: 'Username', value: user.value.username, key: 'username', editable: false },
  { label: 'Email', value: user.value.email, key: 'email', editable: false },
  { label: 'Full Name', value: user.value.fullName, key: 'fullName', editable: true },
  { label: 'Location', value: user.value.location, key: 'location', editable: true },
  { label: 'Bio', value: user.value.bio, key: 'bio', editable: true },
]);

const changedFields = computed(() => {
  return Object.entries(user.value).filter(([key, value]) => {
    return originalUser.value[key as keyof User] !== value;
  });
});

const updateUserInfo = (key: string, value: string) => {
  if (key in user.value) {
    (user.value as User)[key as keyof User] = value;
  }
};

const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  user.value = { ...originalUser.value };
  isEditing.value = false;
};

const saveChanges = () => {
  showConfirmationModal.value = true;
};

const confirmChanges = () => {
  // Implement save changes functionality
  console.log('Saving changes', user.value);
  originalUser.value = { ...user.value };
  isEditing.value = false;
  showConfirmationModal.value = false;
};

const cancelChanges = () => {
  showConfirmationModal.value = false;
};
</script>