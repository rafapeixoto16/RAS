<template>
  <div class="flex min-h-screen w-full bg-white">
    <div class="w-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-0 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div class="absolute inset-0 animate-float">
          <div class="absolute top-1/4 left-1/4 w-12 h-12 bg-blue-400 rounded-lg rotate-45 opacity-20"></div>
          <div class="absolute top-3/4 right-1/4 w-16 h-16 bg-blue-300 rounded-full opacity-20"></div>
          <div class="absolute bottom-1/4 left-1/2 w-20 h-20 bg-blue-200 rounded-lg rotate-12 opacity-20"></div>
        </div>
      </div>

      <div class="w-full max-w-md relative z-10 text-center">
        <h1 class="text-9xl font-bold text-blue-600 mb-4">404</h1>
        <h2 class="text-4xl font-bold text-blue-800 mb-4">Page Not Found</h2>
        <p class="text-xl text-blue-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
        <router-link 
          to="/dashboard" 
          class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg transition duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg"
        >
          Go Back Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(20px, -50px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.9); }
  75% { transform: translate(50px, 50px) scale(1.05); }
}

.animate-blob {
  animation: blob 20s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(5deg); }
  50% { transform: translateY(0) rotate(-5deg); }
  75% { transform: translateY(20px) rotate(5deg); }
}

.animate-float {
  animation: float 15s infinite;
}
</style>
