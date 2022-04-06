<template>
  <div class="flex flex-row justify-end">
    <div v-for="step in [1, 2]" :key="step" class="flex flex-row items-center">
      <span
        class="flex justify-center items-center w-5 h-5 rounded-full bg-white bg-opacity-30 text-white text-xs"
        :class="{ active: step === current }"
      >
        {{ step }}
      </span>
      <div
        class="bg-white bg-opacity-50 w-2 h-0.5 m-0.5"
        v-if="step != 2"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    current: {
      type: Number,
      required: true,
    },
  },
})
</script>

<style scoped>
.active {
  background-color: #fff !important;
  color: #000 !important;
}
</style>
