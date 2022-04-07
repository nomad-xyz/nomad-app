<template>
  <div class="flex justify-center my-10">
    <div class="fade-in flex flex-col items-center text-center p-4">
      <n-spin />
      <n-text class="text-[20px] uppercase text-lg font-medium text-white my-5">
        Sending transaction
      </n-text>
      <n-text class="opacity-70 mb-3">
        Please continue to Metamask to<br />approve your bridge transaction
      </n-text>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NText, NSpin } from 'naive-ui'
export default defineComponent({
  components: {
    NText,
    NSpin,
  },
})
</script>
