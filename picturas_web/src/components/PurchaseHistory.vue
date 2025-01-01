<template>
    <div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-6">Purchase History</h2>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ purchase.amount.toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span :class="getStatusClass(purchase.status)">
                  {{ purchase.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const purchases = ref([
    { id: 1, date: '2023-05-01', description: 'Premium Subscription', amount: 9.99, status: 'Completed' },
    { id: 2, date: '2023-04-01', description: 'Premium Subscription', amount: 9.99, status: 'Completed' },
    { id: 3, date: '2023-03-01', description: 'Premium Subscription', amount: 9.99, status: 'Completed' },
    { id: 4, date: '2023-02-01', description: 'Premium Subscription', amount: 9.99, status: 'Refunded' },
  ]);
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600';
      case 'Refunded':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  </script>
  
  