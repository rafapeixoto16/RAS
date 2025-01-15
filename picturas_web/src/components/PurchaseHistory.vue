<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-900 mb-6">Purchase History</h2>
    
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else class="overflow-x-auto">
      <table v-if="purchases.length" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="purchase in purchases" :key="purchase.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ purchase.date }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ purchase.description }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ purchase.amount_paid.toFixed(2) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span :class="getStatusClass(purchase.status)">
                {{ purchase.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center text-gray-500 py-6">
        No transaction history
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTransactionHistory } from '@/api/queries/subscriptions';

interface Purchase {
  id: number;
  date: string;
  description: string;
  amount_paid: number;
  status: string;
}

const purchases = ref<Purchase[]>([]);
const isLoading = ref(true);

const getStatusClass = (status: string) => {
  switch (status) {
    case 'paid':
      return 'text-green-600';
    case 'unpaid':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const fetchTransactionHistory = async () => {
  isLoading.value = true;
  try {
    const history = await getTransactionHistory();
    purchases.value = history.map((item: Purchase, index: number) => ({
      id: index + 1,
      date: new Date(item.date).toLocaleDateString(),
      description: 'Subscription Payment',
      amount_paid: item.amount_paid / 100,
      status: item.status,
    }));
  } catch (error) {
    console.error('Failed to fetch transaction history:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchTransactionHistory);
</script>