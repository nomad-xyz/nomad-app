<template>
  <div class="flex flex-row">
    <div
      class="loader-bg flex justify-center items-center mr-2"
      :class="{ orange: expired, green: ready }"
    >
      <n-icon class="cursor-pointer opacity-70" size="25">
        <close-outline v-if="expired" />
        <arrow-redo-outline v-else-if="ready" />
        <hourglass-outline v-else />
      </n-icon>
    </div>
    <div class="flex flex-col">
      <copy-hash :address="hash" />
      <div v-if="expired">Expired</div>
      <div v-else-if="ready">Ready to claim</div>
      <div v-else>Waiting for router</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NIcon } from 'naive-ui'
import {
  HourglassOutline,
  ArrowRedoOutline,
  CloseOutline,
} from '@vicons/ionicons5'
import CopyHash from '@/components/CopyHash.vue'

export default defineComponent({
  props: {
    status: String,
    hash: String,
    expired: Boolean,
  },
  components: {
    NIcon,
    CopyHash,
    HourglassOutline,
    ArrowRedoOutline,
    CloseOutline,
  },
  computed: {
    ready() {
      return this.status === 'ReceiverTransactionPrepared'
    },
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
.orange
  background-color rgb(240 138 0) !important
  color #000
</style>
