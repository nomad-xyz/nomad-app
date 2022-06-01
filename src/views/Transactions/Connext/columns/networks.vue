<template>
  <div class="flex flex-row">
    <n-text class="font-bold capitalize">{{ originName }}</n-text>
    <n-text class="opacity-70 px-2">to</n-text>
    <n-text class="font-bold capitalize">{{ destinationName }}</n-text>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NText } from 'naive-ui'
import { getNetworkByChainID } from '@/utils'

export default defineComponent({
  props: {
    originChainId: {
      type: Number,
      required: true,
    },
    destinationChainId: {
      type: Number,
      required: true,
    },
  },
  components: {
    NText,
  },
  computed: {
    originName() {
      const network = getNetworkByChainID(this.originChainId)
      return network ? network.name : this.originChainId
    },
    destinationName() {
      const network = getNetworkByChainID(this.destinationChainId)
      return network ? network.name : this.destinationChainId
    },
  },
})
</script>
