<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
      ></div>
      <div
        class="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute -bottom-32 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 class="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-caveat mb-4 md:mb-0">
          Getting Started with Picturas
        </h1>
        <button
          @click="goHome"
          class="px-6 py-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <i class="bi bi-arrow-left"></i>
          Back to Home
        </button>
      </div>

      <!-- Quick Start Card -->
      <div class="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <i class="bi bi-rocket-takeoff text-blue-500"></i>
          Quick Start Guide
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(step, index) in quickStartSteps"
            :key="index"
            class="p-6 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100"
          >
            <div class="text-4xl font-bold text-blue-500 mb-4">{{ index + 1 }}</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">{{ step.title }}</h3>
            <p class="text-gray-600">{{ step.description }}</p>
          </div>
        </div>
      </div>

      <!-- Detailed Sections -->
      <div class="space-y-8">
        <div
          v-for="(section, index) in detailedSections"
          :key="index"
          class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
        >
          <div class="md:flex">
            <div class="md:flex-1 p-6 md:p-8">
              <div class="flex items-center gap-3 mb-4">
                <i :class="['bi', section.icon, 'text-2xl text-blue-500']"></i>
                <h2 class="text-2xl font-bold text-gray-800">{{ section.title }}</h2>
              </div>
              <div class="space-y-4">
                <p 
                  v-for="(paragraph, pIndex) in section.content" 
                  :key="pIndex"
                  class="text-gray-600 leading-relaxed"
                >
                  {{ paragraph }}
                </p>
              </div>
              <div v-if="section.features" class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  v-for="(feature, fIndex) in section.features"
                  :key="fIndex"
                  class="flex items-center gap-2"
                >
                  <i class="bi bi-check-circle-fill text-green-500"></i>
                  <span class="text-gray-700">{{ feature }}</span>
                </div>
              </div>
            </div>
            <div v-if="section.image" class="md:w-1/3 bg-blue-50 flex items-center justify-center p-8">
              <img 
                :src="section.image" 
                :alt="section.title"
                class="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="mt-8 bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <i class="bi bi-question-circle text-blue-500"></i>
          Frequently Asked Questions
        </h2>
        <div class="space-y-4">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full text-left py-4 flex justify-between items-center"
            >
              <span class="text-lg font-semibold text-gray-800">{{ faq.question }}</span>
              <i
                class="bi"
                :class="[
                  expandedFaq === index ? 'bi-chevron-up' : 'bi-chevron-down',
                  'text-blue-500 transition-transform duration-300'
                ]"
              ></i>
            </button>
            <div
              v-show="expandedFaq === index"
              class="text-gray-600 pb-4 animate-fadeIn"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const expandedFaq = ref<number | null>(null);

const goHome = () => {
  router.push('/dashboard');
};

const toggleFaq = (index: number) => {
  expandedFaq.value = expandedFaq.value === index ? null : index;
};

const quickStartSteps = [
  {
    title: 'Create Account',
    description: 'Sign up for free and unlock basic features, or choose a premium plan for full access.',
  },
  {
    title: 'Upload Images',
    description: 'Drag and drop your images or select them from your device.',
  },
  {
    title: 'Edit & Enhance',
    description: 'Apply filters, adjust settings, and use AI-powered tools to perfect your images.',
  },
  {
    title: 'Save & Share',
    description: 'Download your edited images or share them directly to social media.',
  },
];

const detailedSections = [
  {
    title: 'Premium Features',
    icon: 'bi-star-fill',
    content: [
      'Upgrade to Premium to unlock advanced editing tools and AI-powered features.',
      'Get unlimited access to all current and future premium filters.',
    ],
    features: [
      'AI Background Removal',
      'AI Person Count',
      'Smart Crop',
      'Priority Support',
    ],
    image: '/placeholder.svg?height=300&width=400',
  },
  {
    title: 'Project Management',
    icon: 'bi-folder2-open',
    content: [
      'Organize your images into projects for better workflow management.',
      'Access your projects from any device with cloud synchronization.',
    ],
    features: [
      'Create Multiple Projects',
      'Share Projects',
      'Auto-Save',
    ],
    image: '/placeholder.svg?height=300&width=400',
  },
];

const faqs = [
  {
    question: 'What image formats are supported?',
    answer: 'Picturas supports all major image formats including JPG, PNG, WebP.',
  },
  {
    question: 'Can I edit images on mobile?',
    answer: 'Yes, Picturas is available on mobile devices. Download the app from the App Store or Google Play.',
  },
  {
    question: 'Is there a limit to the number of projects?',
    answer: 'Guest users can create up to 5 projects. Logged in and Premium users have unlimited project creation.',
  },
  {
    question: 'How do I cancel my Premium subscription?',
    answer: 'You can cancel your subscription at any time from your account settings.',
  },
];
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>