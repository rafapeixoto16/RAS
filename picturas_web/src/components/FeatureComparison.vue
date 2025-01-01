<template>
    <div class="overflow-x-auto">
      <table class="w-full text-sm sm:text-base">
        <thead>
          <tr class="border-b">
            <th class="py-3 sm:py-4 px-3 sm:px-6 text-left font-semibold text-gray-900">Features</th>
            <th class="py-3 sm:py-4 px-3 sm:px-6 text-center font-semibold text-gray-900">Anonymous</th>
            <th class="py-3 sm:py-4 px-3 sm:px-6 text-center font-semibold text-gray-900">Free Account</th>
            <th class="py-3 sm:py-4 px-3 sm:px-6 text-center font-semibold text-gray-900">Premium</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(category, index) in features" :key="index">
            <!-- Category Header -->
            <tr class="bg-gray-50">
              <td 
                colspan="4" 
                class="py-2 sm:py-3 px-3 sm:px-6 text-left font-semibold text-gray-900"
              >
                {{ category.category }}
              </td>
            </tr>
            <!-- Features -->
            <tr 
              v-for="(feature, featureIndex) in category.features" 
              :key="featureIndex"
              class="border-b"
            >
              <td class="py-3 sm:py-4 px-3 sm:px-6 text-gray-900">
                {{ feature.name }}
              </td>
              <td class="py-3 sm:py-4 px-3 sm:px-6 text-center">
                <template v-if="typeof feature.anonymous === 'boolean'">
                  <i v-if="feature.anonymous" class="bi bi-check2 text-[#3B82F6] text-lg sm:text-xl"></i>
                  <i v-else class="bi bi-x text-gray-400 text-lg sm:text-xl"></i>
                </template>
                <span v-else class="text-gray-600">{{ feature.anonymous }}</span>
              </td>
              <td class="py-3 sm:py-4 px-3 sm:px-6 text-center">
                <template v-if="typeof feature.free === 'boolean'">
                  <i v-if="feature.free" class="bi bi-check2 text-[#3B82F6] text-lg sm:text-xl"></i>
                  <i v-else class="bi bi-x text-gray-400 text-lg sm:text-xl"></i>
                </template>
                <span v-else class="text-gray-600">{{ feature.free }}</span>
              </td>
              <td class="py-3 sm:py-4 px-3 sm:px-6 text-center">
                <template v-if="typeof feature.premium === 'boolean'">
                  <i v-if="feature.premium" class="bi bi-check2 text-[#3B82F6] text-lg sm:text-xl"></i>
                  <i v-else class="bi bi-x text-gray-400 text-lg sm:text-xl"></i>
                </template>
                <span v-else class="text-gray-600">{{ feature.premium }}</span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Feature {
    name: string;
    anonymous: boolean | string;
    free: boolean | string;
    premium: boolean | string;
  }
  
  interface Category {
    category: string;
    features: Feature[];
  }
  
  defineProps<{
    features: Category[];
  }>()
  </script>  