<template>
  <div class="flex flex-col">
    <span>{{ text }}</span>
    <a :href="link" target="_blank" class="flex flex-row text-white">
      <span class="underline">{{ linkText }}</span>
      <img src="@/assets/icons/arrow-right-up.svg" alt="open" />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
    linkText: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
})
</script>
