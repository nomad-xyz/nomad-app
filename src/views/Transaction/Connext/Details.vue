<template>
  <status-header />
  <div class="w-full mt-8">
    <div class="flex items-center justify-between mb-8">
      <copy-hash class="text-xl font-medium" :address="$route.params.id" />
      <n-text class="flex flex-row text-sm text-white opacity-60 font-medium">
        <!-- v-if="status >= 0 && status < 3" -->
        <img src="@/assets/icons/progress.svg" alt="in progress" />
        <!-- tx is dispatched but not processed -->
        <n-text class="uppercase ml-2">IN PROGRESS</n-text>
      </n-text>
    </div>

    <!-- <detail title="AMOUNT">
      <n-text v-if="amount">{{ amount }} {{ tokenSymbol }}</n-text>
      <n-text v-else>{{ nullVal }}</n-text>
    </detail>
    <detail :title="`FROM (${$route.params.network.toUpperCase()})`">
      <copy-hash v-if="originAddr" :address="originAddr" />
      <n-text v-else>{{ nullVal }}</n-text>
    </detail>
    <detail :title="`TO (${destNet.toUpperCase()})`">
      <copy-hash v-if="destAddr" :address="destAddr" />
      <n-text v-else>{{ nullVal }}</n-text>
    </detail> -->
    <!-- <detail title="TRANSFER INITIATED">
      <n-text>{{ timeSent || nullVal }}</n-text>
    </detail> -->

    <n-divider />

    <!-- link to block explorer -->
    <div class="flex flex-row">
      <a
        :href="explorerLink"
        class="flex items-center hover:underline"
        target="_blank"
      >
        <n-text>Block Explorer</n-text>
        <img
          src="@/assets/icons/arrow-right-up.svg"
          alt="open"
          class="ml-2 cursor-pointer"
        />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NText, NDivider } from 'naive-ui'

import { connextScanURL } from '@/config'
// import Detail from '@/views/Transaction/Detail.vue'
import CopyHash from '@/components/CopyHash.vue'
import StatusHeader from './Header.vue'

export default defineComponent({
  components: {
    StatusHeader,
    // Detail,
    NText,
    NDivider,
    CopyHash,
  },

  computed: {
    explorerLink() {
      return `${connextScanURL}tx/${this.$route.params.id}`
    },
  },
})
</script>
