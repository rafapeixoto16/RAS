<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-8 sm:mb-16 mt-4 sm:mt-0">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose the perfect plan for your creativity
          </h1>
          <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock powerful editing tools and bring your ideas to life
          </p>
        </div>
  
        <PlanToggle 
          v-model="billingCycle"
          class="mb-8 sm:mb-12"
        />
  
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <PricingCard
            title="Guest"
            description="Try basic features without an account"
            :price="0"
            :billing-cycle="billingCycle"
            :button-text="authStore.isLoggedIn() ? 'Unavailable' : 'Current Plan'"
            :button-availability="false"
            button-variant="secondary"
            :features="anonymousFeatures"
          />
          
          <PricingCard
            title="Free Account"
            description="Perfect for getting started with photo editing"
            :price="0"
            :billing-cycle="billingCycle"
            :button-text="authStore.isLoggedIn() ? (subscriptionStore.isPremium ? 'Unavailable' : 'Current Plan') : 'Sign up For Free'"
            :button-availability="authStore.isLoggedIn() ? (subscriptionStore.isPremium ? false : false) : true"
            button-variant="primary"
            :features="freeFeatures"
          />
  
          <PricingCard
            title="Premium"
            description="Advanced tools for serious creators"
            :price="billingCycle === 'monthly' ? monthlyPrice : yearlyPrice"
            :billing-cycle="billingCycle"
            :button-text="authStore.isLoggedIn() ? (subscriptionStore.isPremium ? 'Current Plan' : (subscriptionStore.hasTrialAvailable ? 'Start 30-Day Free Trial' : 'Upgrade Now')) : 'Sign Up For Free'"
            :button-availability="authStore.isLoggedIn() ? (subscriptionStore.isPremium ? false : (subscriptionStore.hasTrialAvailable ? true : true)) : true"
            button-variant="premium"
            :is-popular="true"
            :features="premiumFeatures"
          />
        </div>
  
        <FeatureComparison 
          class="mt-16 sm:mt-24"
          :features="comparisonFeatures"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import PricingCard from '@/components/PricingCard.vue'
  import PlanToggle from '@/components/PlanToggle.vue'
  import FeatureComparison from '@/components/FeatureComparison.vue'
  import { getPlans } from '@/api/queries/subscriptions.ts'
  import { useSubscriptionStore } from '@/stores/subscriptionStore'
  import { useAuthStore } from '@/stores/authStore'
  
  const billingCycle = ref<'monthly' | 'yearly'>('monthly');
  const subscriptionStore = useSubscriptionStore();
  const authStore = useAuthStore();
  
  const anonymousFeatures = [
    { text: 'Basic photo editing tools', included: true },
    { text: 'Up to 5 projects', included: true },
    { text: 'Limited templates', included: true },
    { text: '2GB storage', included: true },
    { text: 'Standard export quality', included: true },
    { text: 'Basic filters', included: true },
  ]
  
  const freeFeatures = [
    { text: 'Everything in Anonymous, plus:', included: true },
    { text: 'Unlimited projects', included: true },
    { text: 'Access to all templates', included: true },
    { text: '10GB storage', included: true },
    { text: 'HD export quality', included: true },
    { text: 'Advanced filters', included: true },
  ]
  
  const premiumFeatures = [
    { text: 'Everything in Free, plus:', included: true },
    { text: 'AI-powered editing tools', included: true },
    { text: 'Unlimited storage', included: true },
    { text: '4K export quality', included: true },
    { text: 'Priority support', included: true },
    { text: 'Custom branding', included: true },
  ]
  
  const comparisonFeatures = [
    {
      category: 'Storage & Projects',
      features: [
        {
          name: 'Storage Space',
          anonymous: '2GB',
          free: '10GB',
          premium: 'Unlimited'
        },
        {
          name: 'Project Limit',
          anonymous: '5 projects',
          free: 'Unlimited',
          premium: 'Unlimited'
        }
      ]
    },
    {
      category: 'Editing Tools',
      features: [
        {
          name: 'Basic Editing',
          anonymous: true,
          free: true,
          premium: true
        },
        {
          name: 'Advanced Filters',
          anonymous: false,
          free: true,
          premium: true
        },
        {
          name: 'AI Tools',
          anonymous: false,
          free: false,
          premium: true
        }
      ]
    }
  ]
  
  const monthlyPrice = ref(0)
  const yearlyPrice = ref(0)
  
  onMounted(async () => {
      const plans = await getPlans()
      if (plans["month"]) {
          monthlyPrice.value = plans["month"].amount / 100
      }
      if (plans["year"]) {
          yearlyPrice.value = plans["year"].amount / 100
      }

      if(authStore.isLoggedIn()) await subscriptionStore.fetchSubscriptionStatus()
  })
  </script> 