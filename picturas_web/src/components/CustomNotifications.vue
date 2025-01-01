<template>
    <div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-6">Notifications</h2>
      
      <div class="space-y-6">
        <div v-for="category in notificationCategories" :key="category.id" class="border-b pb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">{{ category.name }}</h3>
          <div class="space-y-4">
            <div v-for="setting in category.settings" :key="setting.id" class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-700">{{ setting.name }}</p>
                <p class="text-sm text-gray-500">{{ setting.description }}</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="setting.enabled">
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const notificationCategories = ref([
    {
      id: 1,
      name: 'Email Notifications',
      settings: [
        { id: 1, name: 'Project Updates', description: 'Receive updates about your projects', enabled: true },
        { id: 2, name: 'New Features', description: 'Be notified about new features and improvements', enabled: true },
        { id: 3, name: 'Marketing', description: 'Receive promotional emails and offers', enabled: false },
      ]
    },
    {
      id: 2,
      name: 'Push Notifications',
      settings: [
        { id: 4, name: 'Project Collaborations', description: 'Receive notifications about project collaborations', enabled: true },
        { id: 5, name: 'Comments', description: 'Be notified when someone comments on your projects', enabled: true },
      ]
    },
  ]);
  </script>
  
  <style scoped>
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }
  
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
  }
  
  input:checked + .slider {
    background-color: #3B82F6;
  }
  
  input:checked + .slider:before {
    transform: translateX(26px);
  }
  
  .slider.round {
    border-radius: 34px;
  }
  
  .slider.round:before {
    border-radius: 50%;
  }
  </style>  