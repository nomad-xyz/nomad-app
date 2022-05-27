<template>
  <div
    class="border border-white border-opacity-50 rounded-md flex flex-row px-2 py-1"
  >
    <img src="@/assets/icons/search.svg" class="mr-2" />
    <input v-model="text" class="w-full border-0 outline-none bg-transparent" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['input'],
  data: () => ({ text: null }),
  watch: {
    text(newText) {
      this.$emit('input', newText)
    },
  },
})
</script>
