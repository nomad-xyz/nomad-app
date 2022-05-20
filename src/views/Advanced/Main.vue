<template>
  <n-alert
    title="This page is an advanced feature for generating raw unsigned transactions. Please do your research before proceeding."
    type="warning"
    class="max-w-lg mb-4"
  />
  <div class="rounded-md bg-[#2F2F2F] w-full max-w-lg p-8">
    <!-- INPUT -->
    <div v-if="step === 1">
      <div class="uppercase flex justify-center pb-4">Bridge</div>
      <!-- Origin -->
      <div class="bg-white bg-opacity-5 rounded-lg py-2 px-4">
        <!-- amount -->
        <n-text>Amount</n-text>
        <p class="text-red-500 text-xs" v-if="v$.amount.$invalid || v$.token.$invalid">* invalid</p>
        <div class="flex flex-row">
          <n-input
            type="number"
            ref="amount"
            placeholder="0.0"
            v-model:value="amount"
            class="input mr-2"
          />
          <n-popselect
            v-model:value="token"
            :options="tokenOptions"
            placement="bottom-start"
            trigger="click"
            width="trigger"
          >
            <div class="select">
              <input
                v-model="token"
                placeholder="Select token"
                readonly
                class="w-full border-0 outline-none bg-transparent"
              />
              <img src="@/assets/icons/select.svg" class="h-5" />
            </div>
          </n-popselect>
        </div>

        <!-- Origin network select -->
        <n-text>Origin Network</n-text>
        <p class="text-red-500 text-xs" v-if="v$.originNetwork.$invalid">
          * invalid
        </p>
        <n-popselect
          v-model:value="originNetwork"
          :options="networkOptions"
          placement="bottom-start"
          trigger="click"
          width="trigger"
          class="capitalize"
        >
          <div class="select">
            <input
              v-model="originNetwork"
              placeholder="Select Origin Network"
              readonly
              class="w-full border-0 outline-none bg-transparent capitalize"
            />
            <img src="@/assets/icons/select.svg" class="h-5" />
          </div>
        </n-popselect>

        <!-- Address -->
        <n-text>Address</n-text>
        <p class="text-red-500 text-xs" v-if="v$.address.$invalid">* invalid</p>
        <div class="relative">
          <n-input
            ref="address"
            placeholder="0x123...789"
            v-model:value="address"
            class="input"
          />
          <n-text
            v-if="walletAddress && isValidAddress(walletAddress) && address !== walletAddress"
            class="cursor-pointer absolute bottom-0 left-0 translate-y-1 text-[#70c0e8]"
            @click="useWalletAddress"
          >
            Use wallet address
          </n-text>
        </div>
      </div>

      <div class="flex justify-center w-full p-4">
        <n-icon size="30" color="#5185d0">
          <arrow-down-outline />
        </n-icon>
      </div>

      <!-- Destination -->
      <div class="bg-white bg-opacity-5 rounded-lg py-2 px-4">
        <!-- Destination network select -->
        <n-text>Destination Network</n-text>
        <p class="text-red-500 text-xs" v-if="v$.destinationNetwork.$invalid">
          * invalid
        </p>
        <n-popselect
          v-model:value="destinationNetwork"
          :options="networkOptions"
          placement="bottom-start"
          trigger="click"
          width="trigger"
          class="capitalize"
        >
          <div class="select">
            <input
              v-model="destinationNetwork"
              placeholder="Select Destination Network"
              readonly
              class="w-full border-0 outline-none bg-transparent capitalize"
            />
            <img src="@/assets/icons/select.svg" class="h-5" />
          </div>
        </n-popselect>

        <!-- Recipient -->
        <n-text>Destination Address</n-text>
        <p class="text-red-500 text-xs" v-if="v$.destinationAddress.$invalid">* invalid</p>
        <div class="relative">
          <n-input
            ref="destinationAddress"
            placeholder="0x123...789"
            v-model:value="destinationAddress"
            class="input"
          />
          <n-text
            v-if="address && isValidAddress(address) && address !== destinationAddress"
            class="cursor-pointer absolute bottom-0 left-0 translate-y-1 text-[#70c0e8]"
            @click="useSenderAddress"
          >
            Use sender address
          </n-text>
        </div>
      </div>

      <nomad-button
        class="w-full uppercase bg-white text-black h-11 flex justify-center mt-6"
        @click="next"
      >
        Next
      </nomad-button>
    </div>

    <!-- COPY -->
    <advanced-copy v-else-if="payload && step === 2" :payload="payload" />
  </div>
</template>

<script lang="ts">
import { defineComponent, h, computed } from 'vue'
import { utils } from 'ethers'
import { NPopselect, NInput, NAlert, NText, NIcon, useNotification } from 'naive-ui'
import { ArrowDownOutline } from '@vicons/ionicons5'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import {
  generateNetworkOptions,
  isNativeToken,
  getNetworkDomainIDByName,
} from '@/utils'
import { tokens, networks } from '@/config'
import { useStore } from '@/store'
import { isValidAddress } from '@/utils'
import NomadButton from '@/components/Button.vue'
import AdvancedCopy from './Copy.vue'

export default defineComponent({
  components: {
    NText,
    NAlert,
    NInput,
    NIcon,
    NPopselect,
    NomadButton,
    ArrowDownOutline,
    AdvancedCopy,
  },
  data() {
    return {
      step: 1,
      payload: {},
      token: '',
      amount: null,
      originNetwork: '',
      destinationNetwork: '',
      address: '',
      destinationAddress: '',
      networkOptions: generateNetworkOptions(),
      tokenOptions: Object.keys(tokens).map((t) => ({
        label: t,
        value: t,
        key: t,
      })),
      isValidAddress,
    }
  },
  setup: () => {
    const store = useStore()
    const v$ = useVuelidate()
    const notification = useNotification()

    return {
      notification,
      store,
      walletAddress: computed(() => store.state.wallet.address),
      connected: computed(() => store.state.wallet.connected),
      v$,
    }
  },
  validations() {
    return {
      token: {
        required,
        isValid: (value: string) => {
          const token = tokens[value]
          return !(token.nativeOnly && token.nativeNetwork !== this.originNetwork)
        },
        $lazy: true
      },
      amount: { required, $lazy: true },
      originNetwork: { required, $lazy: true },
      destinationNetwork: {
        required,
        isValid: (value: string) => {
          if (!this.originNetwork) return false
          const { connections } = networks[this.originNetwork]
          return connections.includes(value)
        },
        $lazy: true
      },
      address: {
        required,
        isValid: (value: string) => isValidAddress(value),
        $lazy: true,
      },
      destinationAddress: {
        required,
        isValid: (value: string) => isValidAddress(value),
        $lazy: true,
      },
    }
  },
  methods: {
    async next() {
      const valid = await this.v$.$validate()
      console.log('valid', valid)
      if (!valid) return


      // set up for tx
      const token = tokens[this.token]
      const payload = {
        isNative: isNativeToken(this.originNetwork, token),
        originNetwork: getNetworkDomainIDByName(this.originNetwork),
        destNetwork: getNetworkDomainIDByName(this.destinationNetwork),
        asset: token.tokenIdentifier,
        amnt: utils.parseUnits(`${this.amount}`, token.decimals),
        recipient: this.destinationAddress,
        sender: this.address,
      }
      console.log(payload)

      this.payload = payload
      this.step = 2
    },
    back() {
      this.token = ''
      this.amount = null
      this.originNetwork = ''
      this.destinationNetwork = ''
      this.address = ''
      this.destinationAddress = ''
      this.payload = {}
      this.step = 1
    },
    useWalletAddress() {
      if (this.walletAddress && isValidAddress(this.walletAddress)) {
        this.address = this.walletAddress
        if (!this.destinationAddress) {
          this.destinationAddress = this.walletAddress
        }
      }
    },
    useSenderAddress() {
      if (this.address && isValidAddress(this.address)) {
        this.destinationAddress = this.address
      }
    },
  },
  watch: {
    connected(connected: boolean) {
      console.log('connect', connected, this.walletAddress)
      if (!connected || !this.walletAddress || this.address) return

      this.useWalletAddress()
    }
  },
})
</script>

<style scoped>
.input {
  @apply border border-white border-opacity-50 rounded-md mb-4 bg-transparent;
}
.select {
  @apply border border-white border-opacity-50 rounded-md flex flex-row items-center px-2 py-1 mb-4 bg-transparent;
}
</style>
