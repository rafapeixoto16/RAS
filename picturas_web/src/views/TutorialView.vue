<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-200 to-blue-100 via-blue-300 relative overflow-hidden">
    <!-- botão "back to home" para versão desktop -->
    <div class="hidden md:block fixed right-8 top-8 z-20">
      <a 
        href="#" 
        @click.prevent="goHome" 
        class="text-lg text-blue-600 hover:underline"
      >
        Go Back to Home
      </a>
    </div>

    <div class="absolute inset-0 overflow-hidden">
      <!-- "bolas" no background -->
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-200 to-blue-100 opacity-60"></div>
      <div class="absolute top-1/4 left-1/8 w-72 h-72 bg-blue-300 rounded-full opacity-50 blur-xl animate-pulse"></div>
      <div class="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-400 rounded-full opacity-40 blur-xl animate-pulse"></div>
      <div class="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-200 rounded-full opacity-60 blur-xl animate-pulse"></div>
      <div class="absolute top-3/4 left-1/2 w-80 h-80 bg-blue-500 rounded-full opacity-30 blur-xl animate-pulse"></div>
      <div class="absolute top-3/4 right-1/4 w-56 h-56 bg-blue-100 rounded-full opacity-50 blur-xl animate-pulse"></div>
      <div class="absolute bottom-1/8 left-1/4 w-64 h-64 bg-blue-300 rounded-full opacity-40 blur-xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/8 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
      <div class="absolute bottom-1/8 right-1/4 w-72 h-72 bg-blue-200 rounded-full opacity-60 blur-xl animate-pulse"></div>
    </div>

    <div class="max-w-6xl mx-auto px-6 py-8 relative z-10">
      <div class="text-center mb-8">
        <h1 class="text-5xl font-bold text-blue-800 mb-4 font-caveat">PICTURAS Usage Tutorial</h1>
        <!-- botão "back to home" para versão mobile -->
        <a 
          href="#" 
          @click.prevent="goHome" 
          class="back-home-button text-lg text-blue-600 hover:underline md:hidden"
        >
          Go Back to Home
        </a>
      </div>
 
      <!-- passos do tutorial -->
      <div class="bg-white rounded-xl shadow-lg p-6 lg:p-12 mb-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-4 mt-2">How to Edit your Images with PICTURAS</h2>
        <div class="mb-8">
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Step 1: Create an Account (Optional)</h3>
          <p class="text-lg text-gray-600">
            When you first enter PICTURAS, you can create an account to unlock more features. The available features that your plan includes can be found in the 'Settings > Plans' section. You can also purchase a premium subscription for unlimited access to all features within the app.          
          </p>
        </div>
 
        <div class="mb-8">
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Step 2: Navigate the Dashboard</h3>
          <p class="text-lg text-gray-600">
            After logging in (or entering as a guest), you will be directed to the main page. You can create a new project or select from your existing projects on the left side of your screen.          
          </p>
        </div>
 
        <div class="mb-8">
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Step 3: Edit Images</h3>
          <p class="text-lg text-gray-600">
            Once you've selected (or created) your project, you should import images into it. PICTURAS offers a variety of filters that you can apply to your images. Some even feature integrated Artificial Intelligence! Go check them out!
          </p>
        </div>
 
        <div class="mb-8">
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Step 4: Save Your Edited Images</h3>
          <p class="text-lg text-gray-600">
            After editing your images, you can export and save them to your local computer, or even share them directly on your social media!
          </p>
        </div>
      </div>
      
      <!-- outro retângulo -->
      <div class="bg-white rounded-xl shadow-lg p-6 lg:p-12 mb-8">
        <div class="mb-6">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Purchase Premium Plan</h2>
          <p class="text-lg text-gray-600">
            From the main page, you should click on your icon at the bottom left, then click on "Premium." After that, it will prompt you for your billing information. Once you complete the payment, you will immediately gain access to all the features of PICTURAS. You can check your plan status under "Settings > Plans."
          </p>
        </div>
      </div>
      
      <!-- outro retângulo -->
      <div class="bg-white rounded-xl shadow-lg p-6 lg:p-12 mb-8">
        <div class="mb-6">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Customize Your Profile</h2>
          <p class="text-lg text-gray-600">
            Click on the "Profile" section to view and edit your personal information, such as your name, email, and profile picture. After making changes, click "Save Changes" to confirm.
          </p>
        </div>
      </div>
 
      <!-- outro retângulo -->
      <div class="bg-white rounded-xl shadow-lg p-6 lg:p-12 mb-8">
        <div class="mb-6">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Manage Settings</h2>
          <p class="text-lg text-gray-600">
            Go to the "Settings" section to adjust your usage preferences, notifications, and other personalized aspects of the application.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const goHome = () => {
  router.push('/dashboard');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');

.font-caveat {
  font-family: 'Caveat', cursive;
}

</style>
