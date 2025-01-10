<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity"></div>
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl"
            >
              <div class="bg-white px-6 pt-5 pb-6">
                <div class="flex flex-col sm:flex-row items-center">
                  <!-- Left Content -->
                  <div class="sm:w-2/3 text-center sm:text-left">
                    <h3 class="text-xl font-semibold text-gray-900">
                      Try Pro Features Free for 30 Days
                    </h3>
                    <p class="mt-2 text-sm text-gray-500">
                      Unlock access to premium features including:
                    </p>
                    <ul class="mt-4 space-y-2 text-sm text-gray-700">
                      <li class="flex items-start">
                        <i
                          class="bi bi-check-circle-fill text-green-600 mr-2"
                        ></i>
                        Access to 100M+ photos, videos, and premium templates
                      </li>
                      <li class="flex items-start">
                        <i
                          class="bi bi-check-circle-fill text-green-600 mr-2"
                        ></i>
                        Resize, Background Remover, and premium animations
                      </li>
                      <li class="flex items-start">
                        <i
                          class="bi bi-check-circle-fill text-green-600 mr-2"
                        ></i>
                        1TB of storage and Brand Kits
                      </li>
                    </ul>
                    <p class="mt-4 text-xs text-gray-500">
                      Cancel anytime. We’ll remind you 7 days before your trial
                      ends.
                    </p>
                  </div>

                  <!-- Right Image -->
                  <div
                    class="mt-6 sm:mt-0 sm:ml-6 sm:w-1/3"
                    style="margin-left: 0px; width: 50%;"
                  >
                    <img
                      :src="imagePremium"
                      alt="Trial Illustration"
                      class="w-full h-auto rounded-lg"
                      style="
                        margin: 24px;
                        position: relative;
                        padding: 0px;
                        top: -3rem;
                      "
                    />
                  </div>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                <router-link
                  class="inline-flex w-full justify-center rounded-md bg-azure-radiance-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-azure-radiance-700 sm:ml-3 sm:w-auto"
                  to="/plans"
                  @click="closeModal"
                >
                  Start Free Trial
                </router-link>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="closeModal"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import imagePremium from "@/assets/imgs/premium.jpg";

import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { defineProps, defineEmits } from "vue";

defineProps(["open"]);
const emit = defineEmits(["close", "start"]);

const closeModal = () => {
  emit("close");
};
</script>
