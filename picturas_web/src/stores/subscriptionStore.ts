import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getSubscriptionStatus, getBillingInfo } from '@/api/queries/subscriptions';
import { useAuthStore } from './authStore';

interface SubscriptionStatus {
  isPremium: boolean;
  plan: 'regular' | 'month' | 'year';
  trialUsed: boolean;
}

interface BillingInfo {
  last4?: string;
  brand?: string;
}

export const useSubscriptionStore = defineStore('subscription', () => {
  const status = ref<SubscriptionStatus>({
    isPremium: false,
    plan: 'regular',
    trialUsed: false
  });
  
  const billingInfo = ref<BillingInfo>({});
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isPremium = computed(() => status.value.isPremium);
  const currentPlan = computed(() => status.value.plan);
  const hasTrialAvailable = computed(() => !status.value.trialUsed);

  const fetchSubscriptionStatus = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      ({ trialUsed: status.value.trialUsed, isPremium: status.value.isPremium, plan: status.value.plan } = await getSubscriptionStatus(useAuthStore().accessToken ?? ''));
    } catch (err) {
      error.value = 'Failed to fetch subscription status';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchBillingInfo = async () => {
    try {
      const response = await getBillingInfo(useAuthStore().accessToken ?? '');
      billingInfo.value = response;
    } catch (err) {
      console.error(err);
    }
  };

  return {
    status,
    billingInfo,
    isLoading,
    error,
    isPremium,
    currentPlan,
    hasTrialAvailable,
    fetchSubscriptionStatus,
    fetchBillingInfo
  };
});