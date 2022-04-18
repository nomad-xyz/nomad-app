<template>
  <!-- token select/display -->
  <!-- TODO: make into token component, incorporate in token select modal -->
  <div class="relative flex flex-col items-center">
    <div
      class="flex flex-grow flex-row justify-center items-center mt-6 cursor-pointer relative"
      @click="this.showTokenSelect = !this.showTokenSelect"
    >
      <p
        class="validation-err text-red-500 text-xs w-full"
        v-if="v$.token.$invalid"
      >
        * required
      </p>
      <div class="bg-black bg-opacity-50 rounded-lg p-2">
        <img v-if="this.token.icon" :src="this.token.icon" class="h-6" />
        <img v-else src="@/assets/icons/token.svg" class="h-6" />
      </div>
      <div class="ml-2">
        <div class="flex flex-row items-center h-3">
          <n-text>{{ this.token.symbol || 'Select token' }}</n-text>
          <img src="@/assets/icons/select.svg" class="ml-1" />
        </div>
        <!-- token balance, show if token selected -->
        <n-text v-if="this.token.symbol" class="opacity-60 text-xs">
          <span v-if="originNetwork">
            Balance: {{ balance ? toDecimals(balance, token.decimals, 6) : 0 }}
          </span>
          <span v-else>
            <n-tooltip trigger="hover">
              <template #trigger>Balance unavailable</template>
              Select origin network to view balance
            </n-tooltip>
          </span>
        </n-text>
      </div>
    </div>
  </div>

  <!-- token select modal -->
  <token-select
    :show="showTokenSelect"
    @selectToken="selectToken"
    @hide="this.showTokenSelect = false"
  />

  <!-- amount -->
  <div class="relative">
    <n-input
      type="number"
      ref="amount"
      placeholder="0.0"
      v-model:value="amt"
      size="large"
      autosize
      style="min-width: 100px; max-width: 300px; min-height: 70px"
      class="input text-5xl overflow-visible font-extra-light bg-transparent outline-none text-center"
    />
    <button
      v-if="balance && token.symbol && !token.nativeOnly"
      class="capitalize absolute left-[100%] ml-2 h-full text-lg opacity-70"
      @click="max"
    >
      Max
    </button>
  </div>

  <!-- amount errors -->
  <p
    v-if="v$.amt.$errors.length"
    class="text-center text-red-500 flex flex-col"
  >
    <span
      v-for="(error, index) of v$.amt.$errors"
      :key="index"
      class="error-msg"
      >{{ error.$message }}</span
    >
  </p>

  <!-- amount USD -->
  <p v-else class="text-center opacity-70">
    <span v-if="!amt" class="uppercase">Enter Amount</span>
    <span v-else-if="token.coinGeckoId">~ ${{ amtInUSD }} USD</span>
  </p>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { NText, NTooltip, NInput } from 'naive-ui'
import { utils, BigNumber } from 'ethers'
import useVuelidate from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'

import { useStore } from '@/store'
import { getMinAmount, toDecimals } from '@/utils'
import { TokenMetadata } from '@/config/config.types'
import TokenSelect from './Input.tokens.vue'

interface ComponentData {
  amt: string
  showTokenSelect: boolean
  amtInUSD: string
  toDecimals: (
    amnt: BigNumber,
    tokenDecimals: number,
    numDecimals?: number
  ) => string
}

export default defineComponent({
  components: {
    NText,
    NTooltip,
    NInput,
    TokenSelect,
  },
  data() {
    return {
      showTokenSelect: false,
      amt: '',
      amtInUSD: '',
      toDecimals,
    } as ComponentData
  },
  setup() {
    const store = useStore()
    const v$ = useVuelidate({ $scope: 'bridge' })

    return {
      token: computed(() => store.state.userInput.token),
      originNetwork: computed(() => store.state.userInput.originNetwork),
      balance: computed(() => store.state.sdk.balance),
      store,
      v$,
    }
  },
  validations() {
    return {
      amt: {
        required: helpers.withMessage('Enter an amount to bridge', () => {
          if (!this.amt) return false
          return Number.parseFloat(this.amt) > 0
        }),
        noToken: helpers.withMessage(
          'No token selected',
          () => !!this.token.symbol
        ),
        noFunds: helpers.withMessage(
          'No funds',
          // if token and balance exist and balance is equal to zero
          () => {
            if (!this.token.symbol) return true
            if (!this.balance) return true
            return !this.balance.isZero()
          }
        ),
        sufficientFunds: helpers.withMessage(
          'Amount exceeds balance',
          (value: number) => {
            // only show this error if the balance is not zero since we'll already show the no funds message
            if (
              this.balance &&
              !this.balance.isZero() &&
              this.amt &&
              this.token.symbol
            ) {
              const amtBN = utils.parseUnits(
                value.toString(),
                this.token.decimals
              )
              return amtBN.lte(this.balance)
            }
            return true
          }
        ),
      },
      token: {
        required: (value: TokenMetadata) => !!value.symbol,
        $lazy: true,
      },
    }
  },
  methods: {
    selectToken(token: TokenMetadata) {
      this.store.dispatch('setToken', token)
      this.showTokenSelect = false
      this.updateAmtInUSD(token.coinGeckoId)

      // reset form errors after selecting a new token
      this.v$.$reset()
    },
    async updateAmtInUSD(coinGeckoId: string) {
      if (!this.amt) {
        this.amtInUSD = ''
        return
      }
      const amtInUSD =
        (await getMinAmount(coinGeckoId)) * Number.parseFloat(this.amt)
      this.amtInUSD = amtInUSD.toFixed(2).toString()
    },
    max() {
      if (!this.balance || !this.token.symbol) return
      const formattedBalance = toDecimals(this.balance, this.token.decimals)
      this.amt = formattedBalance

      const input = this.$refs.amount as typeof NInput
      input.inputMirrorElRef.innerHTML = formattedBalance
    },
  },
  watch: {
    token(newToken) {
      // update the usd amt if the token if changed outside of this component
      this.updateAmtInUSD(newToken.coinGeckoId)
    },
    async amt(newAmt) {
      this.store.dispatch('setSendAmount', newAmt || '0')
      if (this.token.coinGeckoId) {
        // TODO: we might want to debounce this function depending on performance
        await this.updateAmtInUSD(this.token.coinGeckoId)
      }
    },
  },
})
</script>

<style scoped>
.input {
  outline: none !important;
  border: none !important;
  background-color: transparent !important;
  --n-border-hover: none !important;
  --n-border-focus: none !important;
  --n-box-shadow-focus: none !important;
  --n-border: none !important;
}
.input:hover {
  outline: none !important;
  border: none !important;
  background-color: transparent !important;
}
.input:focus {
  outline: none !important;
  border: none !important;
  background-color: transparent !important;
}
</style>
