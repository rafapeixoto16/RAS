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
            <div class="mx-auto max-w-2xl lg:text-center">
                <h1 class="text-3xl xl:text-5xl font-bold text-azure-radiance-700 "
                    style="font-family: 'Caveat', cursive;">
                    Picturas
                </h1>
                <h2 class="text-base/7 font-semibold text-azure-radiance-800 ">Design faster</h2>
                <p
                    class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-azure-radiance-950 sm:text-5xl lg:text-balance">
                    What will you design today?</p>
                <p class="mt-6 text-lg/8 text-gray-600">Picturas makes it easy to create professional designs and to
                    share or print them.</p>

                <button type="button" @click="router.push('/login')"
                    class="mt-5 w-1/4 py-2 px-4 bg-azure-radiance-600 hover:bg-azure-radiance-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                    Design Now
                </button>
            </div>
            <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                    <div v-for="feature in features" :key="feature.name" class="relative pl-16">
                        <dt class="text-base/7 font-semibold text-gray-900">
                            <div
                                class="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                                <component :is="feature.icon" class="size-6 text-white" aria-hidden="true" />
                            </div>
                            {{ feature.name }}
                        </dt>
                        <dd class="mt-2 text-base/7 text-gray-600">{{ feature.description }}</dd>
                    </div>
                </dl>
            </div>
        </div>
    </div>
</template>

<script setup>
import router from '@/router';


const features = [
    {
        name: 'Push to deploy',
        description:
            'Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi. Odio urna massa nunc massa.',
        icon: "CloudArrowUpIcon",
    },
    {
        name: 'SSL certificates',
        description:
            'Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.',
        icon: "LockClosedIcon",
    },
    {
        name: 'Simple queues',
        description:
            'Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.',
        icon: "ArrowPathIcon",
    },
    {
        name: 'Advanced security',
        description:
            'Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.',
        icon: "FingerPrintIcon",
    },
]
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
    font-size: 9.875rem;
    line-height: 7.25rem;
}
</style>