<template>
  <n-alert
    title="This page is an advanced feature for generating raw unsigned transactions. Please do your research before proceeding."
    type="warning"
    class="max-w-lg mb-4"
  />
  <div class="rounded-md bg-[#2F2F2F] w-full max-w-lg p-8">
    <div class="uppercase flex justify-center pb-4">Bridge</div>
    <!-- Origin -->
    <div class="bg-white bg-opacity-5 rounded-lg py-2 px-4">
      <!-- amount -->
      <n-text>Amount</n-text>
      <p class="text-red-500 text-xs" v-if="v$.amount.$invalid">* required</p>
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
        * required
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
        * required
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
    <div>
      <nomad-button
        class="w-full uppercase bg-white text-black h-11 flex justify-center mt-4"
        @click="getRawTx"
      >
        <span>Copy encoded transaction</span>
      </nomad-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, h, computed } from 'vue'
import { utils } from 'ethers'
import { NPopselect, NInput, NAlert, NText, NIcon, useNotification } from 'naive-ui'
import { ArrowDownOutline } from '@vicons/ionicons5'
import {
  generateNetworkOptions,
  isNativeToken,
  getNetworkDomainIDByName,
} from '@/utils'
import { tokens } from '@/config'
import { useStore } from '@/store'
import NomadButton from '@/components/Button.vue'
import NotificationError from '@/components/NotificationError.vue'
import { useVuelidate } from '@vuelidate/core'
import { isValidAddress } from '@/utils'
import { required } from '@vuelidate/validators'

export default defineComponent({
  components: {
    NText,
    NAlert,
    NInput,
    NIcon,
    NPopselect,
    NomadButton,
    ArrowDownOutline
  },
  data() {
    return {
      token: '',
      amount: null,
      originNetwork: '',
      destinationNetwork: '',
      address: '',
      destinationAddress: '',
      rawTx: '',
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
      token: { required, $lazy: true },
      amount: { required, $lazy: true },
      originNetwork: { required, $lazy: true },
      destinationNetwork: { required, $lazy: true },
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
    async getRawTx() {
      const valid = await this.v$.$validate()

      console.log('valid', valid)

      if (valid) {
        const token = tokens[this.token]
        console.log(token)

        // set up for tx
        const payload = {
          isNative: isNativeToken(this.originNetwork, token),
          originNetwork: getNetworkDomainIDByName(this.originNetwork),
          destNetwork: getNetworkDomainIDByName(this.destinationNetwork),
          asset: token.tokenIdentifier,
          amnt: utils.parseUnits(`${this.amount}`, token.decimals),
          recipient: this.destinationAddress,
        }
        console.log(payload)

        // send tx
        try {
          this.rawTx = await this.store.dispatch('getRawTx', payload)
          console.log('raw transaction: ', this.rawTx)
        } catch (e: unknown) {
          this.notification.warning({
            title: 'Unable to fetch raw transaction',
            content: () =>
              h(NotificationError, {
                text: 'Please reach out to us in Discord support',
                error: e as Error,
              }),
          })
          throw e
        }
      }
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
  }
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
