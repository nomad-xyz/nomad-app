<template>
  <div class="flex flex-row">
    <div
      class="loader-bg flex justify-center items-center mr-2"
      :class="{ green: status === 4 }"
    >
      <n-icon class="cursor-pointer opacity-70" size="25">
        <checkmark-outline v-if="this.status === 4" />
        <arrow-redo-outline v-else-if="this.readyToClaim" />
        <hourglass-outline v-else />
      </n-icon>
    </div>
    <div class="flex flex-col">
      <copy-hash :address="hash" />
      <div v-if="status === 4">Complete</div>
      <div v-else-if="readyToClaim">Ready to claim</div>
      <div v-else>Pending</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NIcon } from 'naive-ui'
import {
  HourglassOutline,
  ArrowRedoOutline,
  CheckmarkOutline,
} from '@vicons/ionicons5'
import CopyHash from '@/components/CopyHash.vue'

export default defineComponent({
  props: {
    status: Number,
    hash: String,
    readyToClaim: Boolean || undefined,
  },
  components: {
    NIcon,
    CopyHash,
    HourglassOutline,
    ArrowRedoOutline,
    CheckmarkOutline,
  },
})
</script>

<style scoped lang="stylus">
.loader-bg
  height 40px
  width 40px
  background-color #272829
  border-radius 50%
.green
  background-color #2aa665
</style>
