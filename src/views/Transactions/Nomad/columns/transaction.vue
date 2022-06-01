<template>
  <div class="flex flex-row">
    <div
      class="loader-bg flex justify-center items-center mr-2"
      :class="{ orange: manualProcess && tx.state < 4, green: tx.state === 4 }"
    >
      <n-icon class="cursor-pointer opacity-70" size="25">
        <checkmark-outline v-if="tx.state === 4" />
        <arrow-redo v-else-if="manualProcess" class="click-me" />
        <hourglass-outline v-else />
      </n-icon>
    </div>
    <div class="flex flex-col">
      <copy-hash :address="tx.tx" />
      <div v-if="tx.state === 4">Complete</div>
      <div v-else-if="manualProcess">Action required</div>
      <div v-else>Pending</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NIcon } from 'naive-ui'
import {
  HourglassOutline,
  ArrowRedo,
  CheckmarkOutline,
} from '@vicons/ionicons5'
import CopyHash from '@/components/CopyHash.vue'
import { getNetworkByDomainID } from '@/utils'
import { IndexerTx } from '@/config/types'

export default defineComponent({
  props: {
    tx: {
      type: Object as () => IndexerTx,
      required: true,
    },
  },
  components: {
    NIcon,
    CopyHash,
    HourglassOutline,
    ArrowRedo,
    CheckmarkOutline,
  },
  computed: {
    manualProcess() {
      const dest = getNetworkByDomainID(this.tx.destination!)
      return dest.manualProcessing
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
  background-color #2aa665 !important
.orange
  background-color rgb(242, 201, 125)
  color #000
</style>
