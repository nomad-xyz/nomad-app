<template>
  <!-- BRIDGE TOKENS card -->
  <div class="relative">
    <!-- color blur section -->
    <div class="bridge pt-8 pb-28 px-5 relative">
      <bg-blur class="absolute inset-0 w-full h-full z-negative" />
      <transfer-amount />
    </div>

    <!-- bridge inputs overlay -->
    <div class="bridge-inputs-container absolute w-full">
      <transfer-inputs class="bridge-inputs mx-8" />
    </div>

    <!-- bottom drawer -->
    <div class="drawer pt-24 pb-5 px-8">
      <transfer-pending v-if="sending || preparingSwap" />
      <bridge-send v-else-if="!connextAvail" :v$="v$" />
      <swap-send v-else :v$="v$" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'

import { useStore } from '@/store'
import { checkConnext } from '@/utils'

import BgBlur from './Transfer.bgblur.vue'
import TransferAmount from './Transfer.amount.vue'
import TransferInputs from './Transfer.inputs.vue'
import TransferPending from './Transfer.pending.vue'
import BridgeSend from './Bridge/Bridge.send.vue'
import SwapSend from './Swap/Swap.send.vue'

export default defineComponent({
  components: {
    TransferAmount,
    BgBlur,
    TransferInputs,
    TransferPending,
    BridgeSend,
    SwapSend,
  },

  setup: () => {
    const store = useStore()

    // contains validation scope, collects validations from children components but does not emit up to parent
    const v$ = useVuelidate({
      $scope: 'bridge',
      $stopPropagation: true,
    })

    return {
      sending: computed(() => store.state.sdk.sending),
      preparingSwap: computed(() => store.state.connext.preparingSwap),
      userInput: computed(() => store.state.userInput),
      store,
      v$,
    }
  },

  data() {
    return {
      connextAvail: false,
    }
  },

  watch: {
    userInput: {
      async handler() {
        // if connext is disabled, return false
        if (this.store.state.userInput.disableConnext) {
          this.connextAvail = false
          return
        }

        // if input is not valid, return false
        const invalid = this.v$.$invalid
        if (invalid) {
          this.connextAvail = false
          return
        }

        // if asset not supported, return false
        const { token, destinationNetwork } = this.store.state.userInput
        if (!checkConnext(destinationNetwork, token.symbol)) {
          this.connextAvail = false
          return
        }

        // if none of the above conditions return, check liquidity
        this.connextAvail = await this.store.dispatch('checkTransferLiquidity')
      },
      deep: true,
    },
  },
})
</script>

<style lang="stylus">
.bridge
  border-radius 12px 12px 0 0
  background-repeat no-repeat
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  overflow: hidden;

.bridge-inputs-container
  top: 230px

  .bridge-inputs
    backdrop-filter: blur(66px);

.drawer
  background-color #2F2F2F
  border-radius 0 0 12px 12px

.z-negative
  z-index -1
</style>
