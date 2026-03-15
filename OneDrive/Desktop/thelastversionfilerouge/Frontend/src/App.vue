<template>
  <main class="min-h-screen bg-gray-50">
    <Navbar />

    <RouterView />
  </main>
</template>

<script setup>
import { RouterView } from 'vue-router';
import Navbar from './components/layout/Navbar.vue';
</script>
