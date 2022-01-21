<template>
  <div class="header transition-all duration-400 px-5 py-8 bg-[#5185d0]">
    <div class="flex flex-col items-center">
      <n-spin stroke="#fff" class="mb-3" />
      <n-text class="uppercase opacity-60">Waiting for Router</n-text>
    </div>

    <!-- :class="[status < 3 ? 'bg-[#5185d0]' : 'bg-[#2fbb72]']" -->
    <!-- <span class="flex flex-col items-center" v-if="status < 0">
      <n-spin stroke="#fff" class="mb-3" />
      <n-text class="uppercase opacity-60">Loading . . .</n-text>
    </span>
    <span class="flex flex-col items-center" v-else-if="status < 3">
      <n-text class="text-4xl mb-2">{{ timeRemaining }}</n-text>
      <n-text class="uppercase opacity-60">Est. time remaining</n-text>
    </span>
    <span class="flex flex-col items-center" v-else>
      <img src="@/assets/icons/check.svg" alt="check" class="mb-2" />
      <n-text class="uppercase opacity-80">Transfer complete</n-text>
    </span> -->
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

<style scoped lang="stylus">
.header
  @apply w-full rounded-xl flex flex-col justify-center items-center overflow-hidden
  min-height 140px
</style>
