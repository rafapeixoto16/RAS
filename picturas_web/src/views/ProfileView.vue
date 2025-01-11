<template>
  <div class="flex flex-col items-center justify-start relative min-h-screen">
    <!-- Main content -->
    <div class="flex-1 flex flex-col p-4 sm:p-6 md:p-8 w-full max-w-[1600px] mx-auto mt-16 md:mt-0">
      <!-- PICTURAS Heading -->
      <h1 class="text-5xl font-bold text-gray-800 mb-8 text-center" style='font-family: "Caveat", cursive;'>PICTURAS</h1>

      <div class="bg-white rounded-xl shadow-lg p-4 sm:p-8 md:p-12">
        <!-- Your Profile and Edit buttons -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-12">
          <h1 class="text-2xl font-bold text-gray-800 mb-4 sm:mb-0 flex items-center whitespace-nowrap">
            Your Profile
            <span v-if="isEditing" class="text-blue-500 ml-2"> > Edit Profile</span>
          </h1>
          <div class="flex justify-end w-full">
            <!-- Edit Profile Button or Save/Cancel Buttons -->
            <button
              v-if="!isEditing"
              @click="startEditing"
              class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white text-base sm:text-lg rounded-full hover:bg-blue-600 transition-colors duration-300"
            >
              Edit Profile
            </button>
            <div v-if="isEditing" class="flex space-x-4">
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

        <!-- Avatar and Info Section -->
        <div class="flex flex-col md:flex-row md:gap-12 lg:gap-240">
          <!-- Avatar and Upload Section -->
          <div 
            class="w-full md:w-1/4 flex justify-center items-center mb-8 md:mb-0 relative"
          >
            <div class="relative group">
              <div
                v-if="!user.avatarUrl"
                class="w-32 h-32 rounded-full bg-blue-500 text-white text-4xl font-bold flex items-center justify-center uppercase"
              >
                {{ user.username.charAt(0) }}
              </div>
              <img
                v-else
                :src="user.avatarUrl"
                :alt="user.username"
                class="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
              />
              <div
                v-if="isEditing"
                class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                @click="triggerFileInput"
              >
                <span class="text-white text-xl font-bold">+</span>
              </div>
              <input
                ref="fileInput"
                type="file"
                @change="handleAvatarUpload"
                accept="image/*"
                class="hidden"
              />
            </div>
          </div>

          <!-- Info Section -->
          <div class="w-full md:w-3/4 mt-4 sm:mt-0">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div
                v-for="(item, index) in userInfoItems"
                :key="index"
                class="flex flex-col space-y-2"
              >
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
                <div
                  v-if="index < userInfoItems.length - 1"
                  class="border-b border-gray-100 mt-4"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Back Home Link -->
    <div class="absolute top-0 right-0 mt-10 mr-10">
      <a 
        href="#"
        @click="goHome"
        class="text-blue-500 hover:text-blue-700 text-lg font-medium hover:underline"
      >
        Back to Home
      </a>
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
import { useRouter } from 'vue-router';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { updateProfile, updateProfilePic } from '@/api/mutations/updateProfile';

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

const confirmChanges = async () => {
  try {
    const updatedData = {
      fullName: user.value.fullName,
      location: user.value.location,
      bio: user.value.bio,
    };
    await updateProfile(updatedData);
    originalUser.value = { ...user.value };
    isEditing.value = false;
    showConfirmationModal.value = false;
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

const cancelChanges = () => {
  showConfirmationModal.value = false;
};

const handleAvatarUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    try {
      const result = await updateProfilePic(file);
      user.value.avatarUrl = result.avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  }
};

const triggerFileInput = () => {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  fileInput?.click();
};

const router = useRouter();
const goHome = () => {
  router.push('/');
};
</script>
