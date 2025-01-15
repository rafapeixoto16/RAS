<template>
  <div
    class="relative rounded-2xl bg-white p-6 sm:p-8 shadow-lg transition-transform duration-300 hover:scale-105"
    :class="{
      'border-2 border-[#3B82F6] ring-2 ring-[#3B82F6] ring-opacity-50': isPopular,
    }"
  >
    <div
      v-if="isPopular"
      class="absolute -top-3 sm:-top-5 left-1/2 -translate-x-1/2 rounded-full bg-[#3B82F6] px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold text-white"
    >
      Most Popular
    </div>

    <div class="mb-4 sm:mb-6">
      <h3 class="text-xl sm:text-2xl font-bold text-gray-900">{{ title }}</h3>
      <p class="mt-2 text-sm sm:text-base text-gray-600">{{ description }}</p>
    </div>

    <div class="mb-4 sm:mb-6">
      <div class="flex items-baseline">
        <span class="text-3xl sm:text-4xl font-bold text-gray-900">
          {{ price === 0 ? "Free" : `$${price}` }}
        </span>
        <span v-if="price > 0" class="ml-2 text-sm sm:text-base text-gray-600">
          /{{ billingCycle === "monthly" ? "mo" : "yr" }}
        </span>
      </div>
      <p
        v-if="billingCycle === 'yearly' && price > 0"
        class="mt-1 text-xs sm:text-sm text-[#3B82F6]"
      >
        Save 17% with yearly billing
      </p>
    </div>

    <ul class="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
      <li
        v-for="feature in features"
        :key="feature.text"
        class="flex items-start"
      >
        <i
          class="bi bi-check2 text-[#3B82F6] text-lg sm:text-xl flex-shrink-0"
        ></i>
        <span class="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600">{{
          feature.text
        }}</span>
      </li>
    </ul>

    <button
      @click="handleButtonClick"
      :disabled="!buttonAvailability"
      class="w-full rounded-lg px-4 py-2 sm:py-3 text-center text-sm sm:text-base font-semibold transition-colors duration-200"
      :class="{
      'bg-[#3B82F6] text-white hover:bg-[#2563EB]':
        buttonVariant === 'primary' && buttonAvailability,
      'bg-gray-200 text-gray-800 hover:bg-gray-300':
        buttonVariant === 'secondary' && buttonAvailability,
      'bg-gradient-to-r from-[#3B82F6] to-purple-600 text-white hover:from-[#2563EB] hover:to-purple-700':
        buttonVariant === 'premium' && buttonAvailability,
      'bg-gray-400 text-gray-500 cursor-not-allowed': !buttonAvailability,
      }"
    >
      {{ buttonText }}
    </button>

    <SubscriptionModal
      :is-open="isModalOpen"
      :billing-cycle="billingCycle"
      :price="price"
      @close="closeModal"
      @success="handleSubscriptionSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useAuthStore } from '@/stores/authStore';
import SubscriptionModal from './SubscriptionModal.vue';
import router from '@/router';

const isModalOpen = ref(false);
const authStore = useAuthStore();
const subStore = useSubscriptionStore();

interface Feature {
  text: string;
  included: boolean;
}

interface Props {
  title: string;
  description: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  buttonText: string;
  buttonVariant: "primary" | "secondary" | "premium";
  buttonAvailability: boolean;
  isPopular?: boolean;
  features: Feature[];
}

const props = withDefaults(defineProps<Props>(), {
  isPopular: false,
});

const handleButtonClick = () => {
  if (!authStore.isLoggedIn()) {
    router.push('/register');
    return;
  }

  if (!subStore.isPremium && props.price > 0) {
    isModalOpen.value = true;
  } else if (props.title === 'Free Account' && !subStore.isPremium) {
    console.log('Switching to free account');
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSubscriptionSuccess = () => {
  subStore.fetchSubscriptionStatus();
};
</script>
