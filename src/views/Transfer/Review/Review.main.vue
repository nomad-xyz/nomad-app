<template>
  <div class="review w-full rounded-md p-7">
    <!-- header -->
    <div class="flex flex-row w-full justify-between items-center px-5 pb-7">
      <breadcrumb @click="back" />
      <span class="uppercase">Review & Bridge</span>
      <transfer-steps :current="2" />
    </div>

    <!-- protocol select -->
    <div class="flex flex-row">
      <protocol
        :selected="protocol === 'nomad'"
        name="nomad"
        time="30-65 min"
        description="Bridges funds from one chain to another"
        fee="No fee"
        @click="protocol = 'nomad'"
      />
      <protocol
        :selected="protocol === 'connext'"
        name="connext"
        time="7-10 min"
        description="Swaps existing liquidity between chains"
        :fee="connextAdditionalFee"
        @click="selectConnext"
      />
    </div>

    <transfer-pending v-if="sending || preparingSwap" />

    <!-- transfer details -->
    <div v-else>
      <div class="p-4">
        <review-detail title="From">
          <div>
            <span class="mr-1 capitalize">{{ userInput.originNetwork }}</span>
            <n-tooltip trigger="hover">
              <template #trigger>
                <span class="opacity-50 cursor-pointer">| {{ truncateAddr(walletAddress) }}</span>
              </template>
              {{ walletAddress }}
            </n-tooltip>
          </div>
        </review-detail>
        <review-detail title="To">
          <div>
            <span class="mr-1 capitalize">
              {{ userInput.destinationNetwork }}
            </span>
            <n-tooltip trigger="hover">
              <template #trigger>
                <span class="opacity-50 cursor-pointer">
                  | {{ truncateAddr(userInput.destinationAddress || walletAddress) }}
                </span>
              </template>
              {{ userInput.destinationAddress || walletAddress }}
            </n-tooltip>
          </div>
        </review-detail>
        <review-detail title="Send amount">
          <div class="flex flex-row items-center">
            <img :src="userInput.token.icon" class="h-4 mr-1" />
            {{ userInput.sendAmount }} {{ userInput.token.symbol }}
          </div>
        </review-detail>
        <review-detail v-if="protocol === 'nomad'" title="Gas Fee">
          <div>
            {{ originGasFee }} GWEI ({{
              nativeAssetSymbol(userInput.originNetwork)
            }})
          </div>
        </review-detail>
        <review-detail v-if="protocol === 'connext'" title="Tx Fees">
          <div v-if="connextFee">
            {{ connextFee }} {{ userInput.token.symbol }}
          </div>
          <n-skeleton v-else :width="150" :height="21" round size="small" />
        </review-detail>
        <review-detail
          v-if="
            protocol === 'nomad' &&
            isEthereumNetwork(userInput.destinationNetwork)
          "
          title="Processing Gas Fee"
        >
          <div class="flex flex-row items-center transform">
            Calculated on Processing ({{ nativeAssetSymbol(userInput.destinationNetwork) }})
            <a
              href="https://docs.nomad.xyz/bridge/nomad-gui.html#completing-a-transfer-ethereum-destination-only"
              target="_blank"
            >
              <n-icon size="22" color="#70c0e8" class="ml-1 cursor-pointer translate-y-1">
                <alert-circle />
              </n-icon>
            </a>
          </div>
        </review-detail>
        <review-detail
          v-if="protocol === 'nomad'"
          title="Receive Amount"
          :borderBottom="false"
        >
          <div class="flex flex-row items-center">
            <img :src="userInput.token.icon" class="h-4 mr-1" />
            {{ userInput.sendAmount }} {{ receiveAssetSymbol() }}
          </div>
        </review-detail>
        <review-detail
          v-if="protocol === 'connext'"
          title="Est. Receive Amount"
          :borderBottom="false"
        >
          <div v-if="connextFee" class="flex flex-row items-center">
            <img :src="userInput.token.icon" class="h-4 mr-1" />
            {{ connextReceiveAmt() }} {{ receiveAssetSymbol() }}
          </div>
          <n-skeleton v-else :width="150" :height="21" round size="small" />
        </review-detail>
      </div>

      <!-- Send -->
      <review-send :protocol="protocol" @back="$emit('back')" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { BigNumber } from 'ethers'
import { NIcon, NSkeleton, NTooltip, useNotification } from 'naive-ui'
import { AlertCircle } from '@vicons/ionicons5'
import { useStore } from '@/store'
import { networks } from '@/config'
import { toDecimals, isEthereumNetwork, truncateAddr } from '@/utils'
import { NetworkName } from '@/config/config.types'

import Breadcrumb from '@/components/Breadcrumb.vue'
import TransferSteps from '../Transfer.steps.vue'
import TransferPending from '../Transfer.pending.vue'
import Protocol from './Review.protocol.vue'
import ReviewDetail from './Review.detail.vue'
import ReviewSend from './Review.send.vue'

export default defineComponent({
  emits: ['back'],
  components: {
    Breadcrumb,
    NIcon,
    NSkeleton,
    NTooltip,
    AlertCircle,
    TransferSteps,
    Protocol,
    ReviewDetail,
    ReviewSend,
    TransferPending,
  },
  setup: () => {
    const store = useStore()
    const notification = useNotification()
    return {
      userInput: computed(() => store.state.userInput),
      walletAddress: computed(() => store.state.wallet.address),
      originGasFee: computed(() => {
        const { gasEst } = store.state.userInput
        if (!gasEst) return
        return toDecimals(gasEst, 9, 4)
      }),
      connextFee: computed(() => {
        const { decimals } = store.state.userInput.token
        const { quote } = store.state.connext
        return quote ? toDecimals(quote.totalFee, decimals, 6) : undefined
      }),
      quote: computed(() => store.state.connext.quote),
      sending: computed(() => store.state.sdk.sending),
      preparingSwap: computed(() => store.state.connext.preparingSwap),
      store,
      notification,
    }
  },
  data: () => ({
    protocol: 'nomad',
  }),

  methods: {
    isEthereumNetwork,
    truncateAddr,
    nativeAssetSymbol(network: NetworkName) {
      return networks[network].nativeToken.symbol
    },
    receiveAssetSymbol() {
      const { token } = this.userInput
      if (token.nativeOnly) {
        return token.wrappedAsset
      }
      return token.symbol
    },
    async selectConnext() {
      this.protocol = 'connext'
      if (this.connextFee) return
      try {
        await this.store.dispatch('getTransferQuote')
      } catch (e) {
        this.notification.info({
          title: 'Unavailable',
          description:
            'Fast bridging with Connext is unavailable for this transaction. Please continue with Nomad.',
          duration: 5000,
        })
        console.log(e)
        this.protocol = 'nomad'
      }
    },
    connextReceiveAmt() {
      const fees = Number.parseFloat(this.connextFee!)
      const total = this.userInput.sendAmount - fees
      return total.toFixed(6)
    },
    back() {
      if (this.sending || this.preparingSwap) return
      this.store.dispatch('resetTransferQuote')
      this.$emit('back')
    }
  },
  computed: {
    connextAdditionalFee() {
      if (!this.quote) return
      const relayerFee = BigNumber.from(this.quote.metaTxRelayerFee)
      const routerFee = BigNumber.from(this.quote.routerFee)
      const total = relayerFee.add(routerFee)
      const formatted = toDecimals(total, 18, 4)
      return `${formatted} ${this.userInput.token.symbol}`
    }
  }
})
</script>

<style scoped lang="stylus">
.review
  background-color #2F2F2F
</style>
