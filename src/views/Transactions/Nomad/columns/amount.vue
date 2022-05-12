<template>
  <div class="flex flex-row">
    <div class="flex flex-col">{{ amt }} {{ token.symbol }}</div>
    <!-- <div v-if="token" class="icon-placeholder" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { BigNumber } from 'ethers'
import { fromBytes32, getNetworkByDomainID, getTokenByTokenID, toDecimals } from '@/utils'
import { IndexerTx, TokenMetadata } from '@/config/types'

interface ComponentData {
  amt: string | undefined,
  token: TokenMetadata | undefined,
}

export default defineComponent({
  props: {
    tx: {
      type: Object as () => IndexerTx,
      required: true,
    }
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
      const tokenIdentifier = {
        domain: getNetworkByDomainID(this.tx.tokenDomain).name,
        id: fromBytes32(this.tx.tokenId)
      }
      this.token = getTokenByTokenID(tokenIdentifier)!
      this.amt = toDecimals(BigNumber.from(this.tx.amount), this.token.decimals, 6)
    }
  }
})
</script>

<style scoped lang="stylus">
.icon-placeholder
  height 20px
  width 20px
  background-color #272829
  border-radius 10px
</style>