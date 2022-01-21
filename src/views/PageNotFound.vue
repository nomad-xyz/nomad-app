<template>
  <div class="flex flex-col items-center">
    <h1 class="text-9xl mb-6">404</h1>
    <!-- links -->
    <router-link to="/" class="text-lg hover:underline cursor-pointer mb-4">
      Go to Home
    </router-link>
    <router-link to="/tx" class="text-lg hover:underline cursor-pointer">
      Search Transaction
    </router-link
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>
