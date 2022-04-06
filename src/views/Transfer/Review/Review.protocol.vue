<template>
  <div
    class="w-full m-2 p-4 rounded-md border border-white border-opacity-30 text-[16px] cursor-pointer"
    :class="{ active: selected }"
  >
    <div class="mb-10 capitalize">
      <span class="opacity-50">Via</span>
      {{ name }}
    </div>
    Est. {{ time }}
    <div class="opacity-50 mb-2">{{ description }}</div>
    <div v-if="fee" class="p-2 rounded-md bg-white bg-opacity-10 inline-block">
      {{ fee }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    fee: {
      type: String,
      required: false,
    },
  },
})
</script>

<style scoped>
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.active {
  --orange: rgba(238, 119, 82, 0.1);
  --pink: rgba(231, 60, 126, 0.1);
  --blue: rgba(35, 166, 213, 0.1);
  --green: rgba(35, 213, 171, 0.1);
  border: 1px solid white;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.3);
  background-image: linear-gradient(
    -45deg,
    var(--orange),
    var(--pink),
    var(--blue),
    var(--green)
  );
  background-size: 400%;
  animation: gradient 15s ease infinite;
}
</style>
