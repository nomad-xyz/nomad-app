<template>
  <div
    class="w-full m-2 p-4 rounded-md bg-white bg-opacity-5 border border-white border-opacity-30 text-[16px] cursor-pointer"
    :class="{ active: selected }"
  >
    <div class="mb-10">
      <span class="opacity-50">Via</span>
      {{ name }}
    </div>
    Est. {{ time }}
    <div class="opacity-50 mb-2">{{ description }}</div>
    <div class="p-2 rounded-md bg-white bg-opacity-10 inline-block">{{ fee }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    selected: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    fee: {
      type: String,
      required: true
    }
  }
})
</script>

<style scoped lang="stylus">
.active
  border 1px solid white
  box-shadow 0 0 0 4px rgba(255, 255, 255, 0.3)
</style>
