<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="div" class="flex items-center gap-2 text-lg font-medium leading-6 text-gray-900">
                <CreditCard class="h-5 w-5 animate-in zoom-in" />
                Upgrade to Premium
              </DialogTitle>
              
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Get unlimited access to all premium features for ${{ price }}/{{ billingCycle }}
                </p>
              </div>

              <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
                <div class="space-y-2">
                  <label for="card-element" class="block text-sm font-medium text-gray-700">
                    Card information
                  </label>
                  <div id="card-element" ref="cardElement" class="rounded-md border border-gray-300 p-3"></div>
                  <div id="card-errors" role="alert" class="text-sm text-red-600"></div>
                </div>

                <TransitionGroup
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <p
                    v-if="status !== 'idle'"
                    :key="status"
                    class="text-sm text-gray-600 mt-2"
                  >
                    {{ message }}
                  </p>
                </TransitionGroup>

                <button
                  type="submit"
                  :disabled="isLoading"
                  class="mt-4 w-full inline-flex justify-center items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <template v-if="isLoading">
                    <Loader2 class="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Processing...
                  </template>
                  <template v-else>
                    Subscribe - ${{ price }}/{{ billingCycle }}
                  </template>
                </button>
              </form>

              <p class="mt-4 text-center text-xs text-gray-500">
                By subscribing, you agree to our Terms of Service and Privacy Policy
              </p>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { CreditCard, Loader2 } from 'lucide-vue-next'
import { subscribe } from '@/api/mutations/subscriptions'
import { useSubscriptionStore } from '@/stores/subscriptionStore'
import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js'

const props = defineProps<{
  isOpen: boolean
  billingCycle: 'monthly' | 'yearly'
  price: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const isLoading = ref(false)
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const message = ref('')
const subscriptionStore = useSubscriptionStore()
const stripe = ref<Stripe | null>(null)
const elements = ref<StripeElements | null>(null)
const cardElement = ref<HTMLElement | null>(null)

const initializeStripe = async () => {
  if (!stripe.value) {
    stripe.value = await loadStripe("pk_test_51QgoWeP6mytX6dcNsRxgjBSs7HRVpnVcFBHfvDE0U7tPMVIhvAjMMemhnE2A0d73W1S2UgMBJKRWg24k3VpzbtIZ000VZWv0WB")
  }
  
  if (stripe.value && !elements.value) {
    elements.value = stripe.value.elements()
  }

  await nextTick()
  
  if (cardElement.value && elements.value) {
    const cardElementInstance = elements.value.create('card')
    cardElementInstance.mount(cardElement.value)
  } else {
    console.error('Card element or Stripe Elements not available')
  }
}

onMounted(() => {
  if (props.isOpen) {
    initializeStripe()
  }
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      initializeStripe()
    })
  } else {
    status.value = 'idle'
    message.value = ''
    if (elements.value) {
      const cardElement = elements.value.getElement('card')
      if (cardElement) {
        cardElement.clear()
      }
    }
  }
})

const handleSubmit = async () => {
  if (!stripe.value || !elements.value) {
    console.error('Stripe has not been initialized')
    return
  }

  isLoading.value = true
  status.value = 'loading'
  message.value = 'Processing your subscription...'

  try {
    const interval = props.billingCycle === 'monthly' ? 'month' : 'year'
    const { type, clientSecret } = await subscribe(interval)

    let result;
    if (type === 'payment') {
      result = await stripe.value.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.value.getElement('card')!,
        }
      })
    } else if (type === 'setup') {
      result = await stripe.value.confirmCardSetup(clientSecret, {
        payment_method: {
          card: elements.value.getElement('card')!,
        }
      })
    } else {
      throw new Error('Invalid intent type received from server')
    }

    if (result.error) {
      throw new Error(result.error.message)
    }

    status.value = 'success'
    message.value = 'Welcome aboard! Your subscription is now active.'
    await subscriptionStore.fetchSubscriptionStatus()
    
    setTimeout(() => {
      emit('success')
      closeModal()
    }, 3000)
  } catch (error) {
    status.value = 'error'
    message.value = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.animate-in {
  animation: animate-in 0.3s ease-out;
}

.zoom-in {
  animation: zoom-in 0.3s ease-out;
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoom-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>