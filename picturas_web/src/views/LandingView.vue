<template>
    <div
        class="w-full min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
            <div
                class="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob">
            </div>
            <div
                class="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000">
            </div>
            <div
                class="absolute bottom-0 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000">
            </div>

            <div class="absolute inset-0 animate-float">
                <div class="absolute top-1/4 left-1/4 w-12 h-12 bg-blue-400 rounded-lg rotate-45 opacity-20"></div>
                <div class="absolute top-3/4 right-1/4 w-16 h-16 bg-blue-300 rounded-full opacity-20"></div>
                <div class="absolute bottom-1/4 left-1/2 w-20 h-20 bg-blue-200 rounded-lg rotate-12 opacity-20"></div>
            </div>
        </div>


        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="relative inset-0 z-20">
                <div class="mx-auto max-w-2xl lg:text-center">
                    <h1 class="text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-bold text-azure-radiance-700 "
                        style="font-family: 'Caveat', cursive;">
                        Picturas
                    </h1>
                    <h2 class="text-base/7 font-semibold text-azure-radiance-800 ">Design faster</h2>
                    <p
                        class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-azure-radiance-950 sm:text-5xl lg:text-balance">
                        What will you design today?</p>
                    <p class="mt-6 text-lg/8 text-gray-600">Picturas makes it easy to create professional designs and to
                        share or print them.</p>

                    <button type="button" @click="redirector"
                        class="mt-5 w-2/3 sm:w-1/2 lg:w-1/4 py-2 px-4 bg-azure-radiance-600 hover:bg-azure-radiance-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                        Design Now
                    </button>
                </div>
            </div>
            <div class="relative z-10">
                <div class=" lg:block lg:w-1/2 relative">
                    <div class="fixed inset-0 bg-blue-900 opacity-0 z-10"></div>
                    <transition-group name="fade" tag="div" class="relative w-full h-full">
                        <img v-for="(image, index) in carouselImages" :key="image.id" :src="image.imageUrl"
                            :alt="image.title" v-show="currentImageIndex === index"
                            class="fixed inset-0 w-full h-full object-cover transition-opacity opacity-25 duration-1000 ease-in-out" />
                    </transition-group>
                    <div
                        class="fixed bottom-0 left-0 right-0 p-6 text-white z-20 bg-gradient-to-t from-blue-900 to-transparent">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref, onMounted, onUnmounted, computed} from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn());


const carouselImages = [
    { id: 1, title: 'Beautiful Nature', imageUrl: 'https://picsum.photos/id/24/3840/2160' },
    { id: 2, title: 'Mountain Sunset', imageUrl: 'https://picsum.photos/id/17/3840/2160' },
    { id: 3, title: 'City Skyline', imageUrl: 'https://picsum.photos/id/32/3840/2160' },
    { id: 4, title: 'Calm Beach', imageUrl: 'https://picsum.photos/id/19/3840/2160' },
    { id: 5, title: 'Forest Pathway', imageUrl: 'https://picsum.photos/id/55/3840/2160' },
    { id: 6, title: 'Sunny Day', imageUrl: 'https://picsum.photos/id/63/3840/2160' },
    { id: 7, title: 'Snowy Peaks', imageUrl: 'https://picsum.photos/id/71/3840/2160' },
    { id: 8, title: 'Desert Dunes', imageUrl: 'https://picsum.photos/id/82/3840/2160' },
];


const currentImageIndex = ref(0);
let carouselInterval: number | null = null;

const rotateCarousel = () => {
    currentImageIndex.value = (currentImageIndex.value + 1) % carouselImages.length;
};

onMounted(() => {
    carouselInterval = setInterval(rotateCarousel, 5000);
});

onUnmounted(() => {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
});

const redirector = () => {
    if (isLoggedIn.value) {
        router.push('/dashboard');
    } else {
        router.push('/login');
    }
};

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes blob {

    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }

    25% {
        transform: translate(20px, -50px) scale(1.1);
    }

    50% {
        transform: translate(-20px, 20px) scale(0.9);
    }

    75% {
        transform: translate(50px, 50px) scale(1.05);
    }
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

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    25% {
        transform: translateY(-20px) rotate(5deg);
    }

    50% {
        transform: translateY(0) rotate(-5deg);
    }

    75% {
        transform: translateY(20px) rotate(5deg);
    }
}

.animate-float {
    animation: float 15s infinite;
}

.text-3xl {
    font-size: 9.875rem; /* Desktop grande */
    line-height: 7.25rem;
}

@media (max-width: 1024px) { /* Tablets */
    .text-3xl {
        font-size: 6rem;
        line-height: 5rem;
    }
}

@media (max-width: 768px) { /* Smartphones */
    .text-3xl {
        font-size: 3rem;
        line-height: 4rem;
    }
}

</style>