<template>
  <div class="flex flex-row justify-between mt-4 opacity-70">
    Fees:
    <div v-if="!fee" class="flex flex-row">
      <div class="mr-2">Calculating</div>
      <loader-spin />
    </div>
    <div v-else>{{ fee.toString() }} {{ token.symbol }}</div>
  </div>

  <div class="estimated flex flex-row justify-between mt-2">
    Estimated Received:
    <div class="flex flex-row">
      <div v-if="total">{{ total.toString() }}</div>
      <loader-bounce v-else />
      <div class="ml-1">{{ token.symbol }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store'
import { utils } from 'ethers'
import { toDecimals } from '@/utils'

import LoaderSpin from '@/components/LoaderDots.vue'
import LoaderBounce from '@/components/LoaderBounce.vue'

export default defineComponent({
  components: {
    LoaderSpin,
    LoaderBounce,
  },

  setup() {
    const store = useStore()

    return {
      fee: computed(() => {
        const { decimals } = store.state.userInput.token
        return store.state.connext.fee
          ? toDecimals(store.state.connext.fee, decimals, 6)
          : undefined
      }),
      token: computed(() => store.state.userInput.token),
      amount: computed(() => store.state.userInput.sendAmount),
      total: computed(() => {
        const { fee } = store.state.connext
        const { sendAmount, token } = store.state.userInput
        if (!fee || !sendAmount) return
        const amountBN = utils.parseUnits(sendAmount.toString(), token.decimals)
        const totalBN = amountBN.sub(fee)
        return toDecimals(totalBN, token.decimals, 6)
      }),
      store,
    }
  },
})
</script>

<style scoped lang="stylus">
.estimated
  font-size 16px
</style>
