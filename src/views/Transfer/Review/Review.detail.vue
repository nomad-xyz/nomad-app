<template>
  <div
    class="flex flex-row justify-between px py-2"
    :class="{ 'border-b border-opacity-5': borderBottom }"
  >
    <div class="opacity-50 capitalize">{{ title }}</div>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    borderBottom: {
      type: Boolean,
      default: true,
    },
  },
})
</script>
