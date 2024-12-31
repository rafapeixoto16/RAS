<template>
  <div class="flex-1 flex flex-col p-8 w-full max-w-[1600px] mx-auto">
    <div class="flex justify-between items-center mb-12">
      <h1 class="text-4xl font-bold text-gray-800">Your Profile</h1>
      <button
        v-if="!isEditing"
        @click="startEditing"
        class="px-6 py-3 bg-blue-500 text-white text-lg rounded-full hover:bg-blue-600 transition-colors duration-300"
      >
        Edit Profile
      </button>
    </div>
    <div class="bg-white rounded-xl shadow-lg p-12">
      <div class="flex flex-col md:flex-row md:gap-24">
        <div class="md:w-1/4 flex justify-center mb-12 md:mb-0">
          <UserAvatar
            :image-url="user.avatarUrl"
            :username="user.username"
          />
        </div>
        <div class="md:w-3/4">
          <div class="grid gap-8">
            <div v-for="(item, index) in userInfoItems" :key="index" class="flex flex-col space-y-2">
              <label class="text-gray-600 text-lg font-medium">{{ item.label }}</label>
              <input
                v-if="isEditing && item.editable"
                :value="item.value"
                @input="updateUserInfo(item.key, ($event.target as HTMLInputElement).value)"
                class="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div 
                v-else 
                class="text-gray-800 text-lg py-3"
              >
                {{ item.value }}
              </div>
              <div v-if="index < userInfoItems.length - 1" class="border-b border-gray-100 mt-4"></div>
            </div>
          </div>
          <div v-if="isEditing" class="mt-12 flex justify-end space-x-4">
            <button
              @click="cancelEditing"
              class="px-8 py-3 bg-gray-100 text-gray-700 text-lg rounded-full hover:bg-gray-200 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              @click="saveChanges"
              class="px-8 py-3 bg-blue-500 text-white text-lg rounded-full hover:bg-blue-600 transition-colors duration-300"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
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
    (user.value as User)[key as keyof User] = value as never;
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