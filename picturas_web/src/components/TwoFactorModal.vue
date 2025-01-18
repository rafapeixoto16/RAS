<template>
  <div class="fixed inset-0 bg-blue-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4" id="two-factor-modal">
    <div class="relative w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-xl">
      <div class="text-center p-4 sm:p-6">
        <h3 class="text-lg sm:text-xl leading-6 font-bold text-blue-600 mb-4">Two-Factor Authentication</h3>
        <p class="text-xs sm:text-sm text-blue-500 mb-6">
          Please enter the 6-digit verification code from your authenticator app.
        </p>
        <div class="flex justify-center space-x-2 sm:space-x-4 mb-6">
          <template v-for="(digit, index) in 6" :key="index">
            <input 
              type="text"
              :ref="el => { if (el) inputRefs[index] = el as HTMLInputElement }"
              v-model="code[index]"
              @input="onInput(index)"
              @keydown="onKeyDown($event, index)"
              @paste="onPaste"
              class="w-8 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-semibold text-blue-600 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              maxlength="1"
              inputmode="numeric"
              pattern="[0-9]*"
            />
          </template>
        </div>
        <button
          @click="verify"
          class="w-full px-4 py-2 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out transform hover:scale-105"
          :disabled="code.join('').length !== 6"
        >
          Verify
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const code = reactive(Array(6).fill(''));
const inputRefs = ref<HTMLInputElement[]>([]);

const emit = defineEmits(['close', 'verify']);

const onInput = (index: number) => {
  if (code[index].length > 0 && index < 5) {
    inputRefs.value[index + 1]?.focus();
  }
};

const onKeyDown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace' && index > 0 && code[index] === '') {
    inputRefs.value[index - 1]?.focus();
  }
};

const onPaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData('text');
  if (pastedData && /^\d{6}$/.test(pastedData)) {
    for (let i = 0; i < 6; i++) {
      code[i] = pastedData[i];
    }
    inputRefs.value[5]?.focus();
  }
};

const verify = () => {
  const fullCode = code.join('');
  if (fullCode.length === 6 && /^\d+$/.test(fullCode)) {
    emit('verify', fullCode);
  }
};
</script>