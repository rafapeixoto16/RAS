<template>
    <div :class="['relative', placement]" ref="triggerElement">
        <span @click="toggleDropdown" class="cursor-pointer">
            <i v-if="isIcon" :class="trigger"></i>
            <span v-else>{{ trigger }}</span>
        </span>
        <transition name="dropdown">
            <Teleport v-if="appendToBody && isOpen" to="body">
                <div :style="dropdownStyle" class="absolute bg-[#F5F7FA] shadow-md rounded mt-2 border border-gray-200 z-50 text-gray-700">
                    <ul>
                        <li 
                            v-for="option in options" 
                            :key="option.label" 
                            class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <i v-if="option.icon" :class="option.icon"></i>
                            <span class="text-gray-700">{{ option.label }}</span>
                        </li>
                    </ul>
                </div>
            </Teleport>
            <div v-else-if="isOpen" class="absolute bg-[#F5F7FA] shadow-md rounded mt-2 border border-gray-200 z-50">
                <ul>
                    <li 
                        v-for="option in options" 
                        :key="option.label" 
                        class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                        <i v-if="option.icon" :class="option.icon"></i>
                        <span class="text-gray-700">{{ option.label }}</span>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface Option {
    label: string;
    icon?: string;
}

interface Props {
    placement: 'right' | 'left' | 'top' | 'bottom';
    trigger: string;
    options: Option[];
    isIcon?: boolean;
    appendToBody?: boolean;
}

const props = defineProps<Props>();

const placement = props.placement;
const trigger = props.trigger;
const options = props.options;
const isIcon = props.isIcon;
const appendToBody = props.appendToBody;

const isOpen = ref(false);
const triggerElement = ref<HTMLElement | null>(null);
const dropdownStyle = ref({});

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value && appendToBody) {
        updateDropdownPosition();
    }
};

const updateDropdownPosition = () => {
    if (triggerElement.value) {
        const rect = triggerElement.value.getBoundingClientRect();
        dropdownStyle.value = {
            top: `${rect.bottom + window.scrollY}px`,
            left: `${rect.left + window.scrollX}px`,
        };
    }
};

onMounted(() => {
    window.addEventListener('resize', updateDropdownPosition);
    window.addEventListener('scroll', updateDropdownPosition);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateDropdownPosition);
    window.removeEventListener('scroll', updateDropdownPosition);
});
</script>

<style scoped>
.relative.bottom .absolute {
    top: calc(100% + 8px);
    left: 0;
}

.relative.top .absolute {
    bottom: calc(100% + 8px);
    left: 0;
}

.relative.left .absolute {
    top: 0;
    right: calc(100% + 8px);
}

.relative.right .absolute {
    top: 0;
    left: calc(100% + 8px);
}

.dropdown-enter-active, .dropdown-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.dropdown-enter-from, .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.absolute {
    width: max-content;
}

.absolute ul {
    display: inline-block;
}
</style>