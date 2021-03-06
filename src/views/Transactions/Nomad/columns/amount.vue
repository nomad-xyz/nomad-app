<template>
  <div v-if="token" class="flex flex-row items-center">
    <div class="flex flex-col items-end leading-4">
      <div>{{ amt }}</div>
      <div>{{ token.symbol }}</div>
    </div>
    <div class="bg-black bg-opacity-50 rounded-lg p-3 ml-2">
      <img :src="token.icon" class="h-4" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { BigNumber } from 'ethers'
import {
  fromBytes32,
  getNetworkByDomainID,
  getTokenByTokenID,
  toDecimals,
} from '@/utils'
import { TokenMetadata } from '@/config/types'
import { IndexerTx } from '@/utils/nomadAPI'

interface ComponentData {
  amt: string | undefined
  token: TokenMetadata | undefined
}

export default defineComponent({
  props: {
    tx: {
      type: Object as () => IndexerTx,
      required: true,
    },
  },
  data() {
    return {
      amt: undefined,
      token: undefined,
    } as ComponentData
  },
  mounted() {
    this.getAmount()
  },
  methods: {
    getAmount() {
      const { amount, tokenDomain, tokenId } = this.tx
      const tokenIdentifier = {
        domain: getNetworkByDomainID(tokenDomain).name,
        id: fromBytes32(tokenId),
      }
      this.token = getTokenByTokenID(tokenIdentifier)!
      this.amt = toDecimals(BigNumber.from(amount), this.token.decimals, 6)
    },
  },
})
</script>
