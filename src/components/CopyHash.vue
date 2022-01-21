<template>
  <div class="inline cursor-pointer" @click="handleCopy" @mouseleave="reset">
    <n-tooltip
      trigger="hover"
      placement="right"
      :style="{ padding: '0 5px 3px 5px' }"
    >
      <template #trigger>
        <span class="inline-flex items-center">
          <n-text>{{ truncatedAddress }}</n-text>
          <img
            src="@/assets/icons/copy.svg"
            alt="copy"
            class="inline ml-2 cursor-pointer"
          />
        </span>
      </template>
      {{ copyText }}
    </n-tooltip>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { NTooltip, NText } from 'naive-ui'
import { truncateAddr } from '@/utils'

export default defineComponent({
  props: {
    address: {
      type: String,
      required: true,
    },
    large: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    NTooltip,
    NText,
  },
  data() {
    return {
      truncatedAddress: computed(() => truncateAddr(this.address)),
      copyText: 'copy',
    }
  },
  methods: {
    handleCopy() {
      if (!this.address) {
        this.copyText = 'error'
        return
      }
      navigator.clipboard.writeText(this.address).then(
        () => {
          console.log('Async: Copying to clipboard was successful!')
          this.copyText = 'copied'
        },
        (err) => {
          console.error('Async: Could not copy text: ', err)
        }
      )
    },
    reset() {
      setTimeout(() => (this.copyText = 'copy'), 500)
    },
  },
})
</script>
