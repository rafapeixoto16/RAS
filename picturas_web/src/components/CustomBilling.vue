<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-900 mb-6">Billing</h2>
    
    <div class="mb-8">
      <h3 class="text-lg font-medium text-gray-900 mb-2">Current Plan</h3>
      <div class="bg-gray-100 p-4 rounded-lg">
        <p class="text-lg font-semibold">{{ currentPlan.name }}</p>
        <p class="text-gray-600">${{ currentPlan.price }} / {{ currentPlan.interval }}</p>
        <button @click="goToPlans" class="mt-2 text-blue-600 hover:text-blue-800">Check our available plans</button>
      </div>
    </div>

    <div class="mb-8">
      <h3 class="text-lg font-medium text-gray-900 mb-2">Payment Method</h3>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <i class="bi bi-credit-card text-2xl mr-2"></i>
          <span>•••• •••• •••• {{ paymentMethod.last4 }}</span>
        </div>
        <button @click="showChangePaymentModal = true" class="text-blue-600 hover:text-blue-800">Update</button>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Billing Address</h3>
      <address class="text-gray-600 mb-2">
        {{ billingAddress.street }}<br>
        {{ billingAddress.city }}, {{ billingAddress.state }} {{ billingAddress.zip }}<br>
        {{ billingAddress.country }}
      </address>
      <button @click="showChangeBillingAddressModal = true" class="text-blue-600 hover:text-blue-800">Edit</button>
    </div>

    <Modal v-if="showChangePaymentModal" @close="showChangePaymentModal = false">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Update Payment Method</h3>
      <form @submit.prevent="updatePaymentMethod">
        <input v-model="newCardNumber" type="text" placeholder="Card Number" class="w-full px-3 py-2 border rounded-md mb-4" required>
        <div class="flex space-x-4 mb-4">
          <input v-model="newCardExpiry" type="text" placeholder="MM/YY" class="w-1/2 px-3 py-2 border rounded-md" required>
          <input v-model="newCardCVC" type="text" placeholder="CVC" class="w-1/2 px-3 py-2 border rounded-md" required>
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Update Payment Method</button>
      </form>
    </Modal>

    <Modal v-if="showChangeBillingAddressModal" @close="showChangeBillingAddressModal = false">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Edit Billing Address</h3>
      <form @submit.prevent="updateBillingAddress">
        <input v-model="newBillingAddress.street" type="text" placeholder="Street Address" class="w-full px-3 py-2 border rounded-md mb-4" required>
        <input v-model="newBillingAddress.city" type="text" placeholder="City" class="w-full px-3 py-2 border rounded-md mb-4" required>
        <div class="flex space-x-4 mb-4">
          <input v-model="newBillingAddress.state" type="text" placeholder="State" class="w-1/2 px-3 py-2 border rounded-md" required>
          <input v-model="newBillingAddress.zip" type="text" placeholder="ZIP Code" class="w-1/2 px-3 py-2 border rounded-md" required>
        </div>
        <input v-model="newBillingAddress.country" type="text" placeholder="Country" class="w-full px-3 py-2 border rounded-md mb-4" required>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Update Billing Address</button>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '@/components/CustomModal.vue';

const router = useRouter();

const currentPlan = ref({
  name: 'Premium',
  price: 9.99,
  interval: 'month'
});

const paymentMethod = ref({
  last4: '4242'
});

const billingAddress = ref({
  street: 'Rua das Imagens, 123',
  city: 'BRAGA SIUU',
  state: 'NAO HA NADA DISSO',
  zip: '12345',
  country: 'Portugal'
});

const showChangePaymentModal = ref(false);
const showChangeBillingAddressModal = ref(false);

const newCardNumber = ref('');
const newCardExpiry = ref('');
const newCardCVC = ref('');

const newBillingAddress = ref({
  street: '',
  city: '',
  state: '',
  zip: '',
  country: ''
});

const goToPlans = () => {
  router.push('/plans');
};

const updatePaymentMethod = () => {
  paymentMethod.value.last4 = newCardNumber.value.slice(-4);
  showChangePaymentModal.value = false;
};

const updateBillingAddress = () => {
  billingAddress.value = { ...newBillingAddress.value };
  showChangeBillingAddressModal.value = false;
};
</script>
