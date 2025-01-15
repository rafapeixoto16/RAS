<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-0 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <h1 class="text-5xl font-bold text-blue-800 mb-8 text-center font-caveat">PICTURAS</h1>

      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div v-else class="bg-white rounded-xl shadow-lg p-6 md:p-8 lg:p-12 w-full mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center mb-8 lg:mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 md:mb-0">
            Your Profile
            <span v-if="isEditing" class="text-blue-500 ml-2"> > Edit Profile</span>
          </h2>
          <div>
            <button
              v-if="!isEditing"
              @click="startEditing"
              class="px-6 py-3 bg-blue-500 text-white text-lg rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Edit Profile
            </button>
            <div v-else class="flex space-x-4">
              <button
                @click="cancelEditing"
                class="px-6 py-3 bg-gray-200 text-gray-700 text-lg rounded-full hover:bg-gray-300 transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
              <button
                @click="saveChanges"
                class="px-6 py-3 bg-blue-500 text-white text-lg rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row lg:space-x-16">
          <div class="w-full lg:w-1/3 flex justify-center items-start mb-8 lg:mb-0">
            <div class="relative group">
              <div
                v-if="!user.avatarUrl"
                class="w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-blue-500 text-white text-6xl lg:text-7xl font-bold flex items-center justify-center uppercase shadow-lg"
              >
                {{ user.username.charAt(0) }}
              </div>
              <img
                v-else
                :src="user.avatarUrl"
                :alt="user.username"
                class="w-48 h-48 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-blue-200 shadow-lg"
              />
              <div
                v-if="isEditing"
                class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                @click="triggerFileInput"
              >
                <i class="bi bi-camera-fill text-white text-2xl"></i>
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

          <div class="w-full lg:w-2/3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div
                v-for="(item, index) in userInfoItems"
                :key="index"
                class="flex flex-col space-y-2"
                :class="{ 'md:col-span-2': item.key === 'bio' }"
              >
                <label class="text-gray-600 text-lg lg:text-xl font-medium">{{ item.label }}</label>
                <input
                  v-if="isEditing && item.editable && item.key !== 'bio'"
                  :value="item.value"
                  :placeholder="`Enter your ${item.label.toLowerCase()}`"
                  @input="updateUserInfo(item.key, ($event.target as HTMLInputElement).value)"
                  class="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-6 py-4 text-lg lg:text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <textarea
                  v-else-if="isEditing && item.editable && item.key === 'bio'"
                  :value="item.value"
                  :placeholder="`Enter your ${item.label.toLowerCase()}`"
                  @input="updateUserInfo(item.key, ($event.target as HTMLTextAreaElement).value)"
                  rows="4"
                  class="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-6 py-4 text-lg lg:text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                ></textarea>
                <div 
                  v-else 
                  class="text-gray-800 text-lg lg:text-xl py-4 bg-gray-50 rounded-lg px-6"
                  :class="{ 'h-40 overflow-y-auto': item.key === 'bio' }"
                >
                  {{ item.value || `No ${item.label.toLowerCase()} provided` }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center">
        <a 
          href="#"
          @click.prevent="goHome"
          class="text-blue-600 hover:text-blue-800 text-lg font-medium hover:underline transition-colors duration-300"
        >
          Back to Home
        </a>
      </div>
    </div>

    <ConfirmationModal
      v-if="showConfirmationModal"
      :changes="changedFields"
      @confirm="confirmChanges"
      @cancel="cancelChanges"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { updateProfile, updateProfilePic } from '@/api/mutations/updateProfile';
import { getUserInfo } from '@/api/queries/getUserInfo';
import { useUserStore } from '@/stores/userStore';

interface User {
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  location: string;
  bio: string;
}

const userStore = useUserStore();
const user = ref<User>({
  username: '',
  email: '',
  fullName: '',
  avatarUrl: '',
  location: '',
  bio: '',
});

const originalUser = ref<User>({ ...user.value });
const isEditing = ref(false);
const showConfirmationModal = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const isLoading = ref(true);

const userInfoItems = computed(() => [
  { label: 'Email', value: user.value.email, key: 'email', editable: false },
  { label: 'Username', value: user.value.username, key: 'username', editable: true },
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
    (user.value as Record<string, string | undefined>)[key] = value;
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
      username: user.value.username,
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
  fileInput.value?.click();
};

const router = useRouter();
const goHome = () => {
  router.push('/dashboard');
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const resp = await getUserInfo();
    const filteredUser = {
      username: resp.username,
      email: resp.email,
      location: resp.location,
      bio: resp.bio,
      fullName: resp.name,
      avatarUrl: resp.avatarUrl || '',
    };
    user.value = filteredUser;
    originalUser.value = { ...filteredUser };
    userStore.updateUsername(resp.username);
  } catch (error) {
    console.error('Error fetching user info:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');

.font-caveat {
  font-family: 'Caveat', cursive;
}

@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(20px, -50px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.9); }
  75% { transform: translate(50px, 50px) scale(1.05); }
}

.animate-blob {
  animation: blob 20s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>