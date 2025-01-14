<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-900 mb-6">Billing</h2>
    
    <div class="mb-8">
      <h3 class="text-lg font-medium text-gray-900 mb-2">Current Plan</h3>
      <div class="bg-gray-100 p-4 rounded-lg">
        <p class="text-lg font-semibold">{{ currentPlan.isPremium ? 'Premium' : 'Free' }}</p>
        <p v-if="currentPlan.isPremium" class="text-gray-600">${{ currentPlan.plan === 'month' ? monthlyPrice : yearlyPrice }} / {{ currentPlan.plan }}</p>
        <button @click="goToPlans" class="mt-2 text-blue-600 hover:text-blue-800">Check our available plans</button>
      </div>
    </div>

    <div class="mb-8">
      <h3 class="text-lg font-medium text-gray-900 mb-2">Payment Method</h3>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <i class="bi bi-credit-card text-2xl mr-2"></i>
          <span v-if="billingInfo.last4">
            {{ billingInfo.brand }} •••• •••• •••• {{ billingInfo.last4 }}
          </span>
          <span v-else class="text-gray-600">No payment method set</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { getPlans } from '@/api';

interface BillingInfo {
  last4?: string;
  brand?: string;
}

interface SubscriptionStatus {
  isPremium: boolean;
  plan: 'regular' | 'month' | 'year';
  trialUsed: boolean;
}

const router = useRouter();
const subscriptionsStore = useSubscriptionStore();
const monthlyPrice = ref(0)
const yearlyPrice = ref(0)

const currentPlan = ref<SubscriptionStatus>({
  isPremium: false,
  plan: 'regular',
  trialUsed: false
});

const billingInfo = ref<BillingInfo>({});

onMounted(async () => {
  try {
    await subscriptionsStore.fetchBillingInfo();
    billingInfo.value = subscriptionsStore.billingInfo;
  } catch (error) {
    console.error('Failed to fetch billing info:', error);
  }
  currentPlan.value = subscriptionsStore.status;
  try{
    const plans = await getPlans()
        if (plans["month"]) {
            monthlyPrice.value = plans["month"].amount / 100
        }
        if (plans["year"]) {
            yearlyPrice.value = plans["year"].amount / 100
        }
  } catch (error) {
    console.error('Failed to plans info:', error);
  }
});

const goToPlans = () => {
  router.push('/plans');
};
</script>
