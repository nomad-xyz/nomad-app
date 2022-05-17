<template>
  <n-alert
    title="This page is an advanced feature for generating raw unsigned transactions. Please do your research before proceeding."
    type="warning"
    class="max-w-lg mb-4"
  />
  <div class="rounded-md bg-[#2F2F2F] w-full max-w-lg p-8">
    <div class="uppercase flex justify-center pb-4">Bridge</div>
    <div>
      <!-- Amount -->
      <n-text>Amount</n-text>
      <n-input type="number" ref="amount" placeholder="0.0" v-model:value="amount" class="mb-4" />
      <!-- Token select -->
      <n-text>Token</n-text>
      <n-popselect
        v-model:value="token"
        :options="tokenOptions"
        placement="bottom-start"
        trigger="click"
        width="trigger"
      >
        <div
          class="border border-white border-opacity-50 rounded-md flex flex-row px-2 py-1 mb-4"
        >
          <input
            v-model="token"
            placeholder="Select token"
            readonly
            class="w-full border-0 outline-none bg-transparent"
          />
          <img src="@/assets/icons/select.svg" />
        </div>
      </n-popselect>

      <!-- Origin network select -->
      <n-text>Origin Network</n-text>
      <n-popselect
        v-model:value="originNetwork"
        :options="networkOptions"
        placement="bottom-start"
        trigger="click"
        width="trigger"
        class="capitalize"
      >
        <div
          class="border border-white border-opacity-50 rounded-md flex flex-row px-2 py-1 mb-4"
        >
          <input
            v-model="originNetwork"
            placeholder="Select Origin Network"
            readonly
            class="w-full border-0 outline-none bg-transparent capitalize"
          />
          <img src="@/assets/icons/select.svg" />
        </div>
      </n-popselect>

      <!-- Destination network select -->
      <n-text>Destination Network</n-text>
      <n-popselect
        v-model:value="destinationNetwork"
        :options="networkOptions"
        placement="bottom-start"
        trigger="click"
        width="trigger"
        class="capitalize"
      >
        <div
          class="border border-white border-opacity-50 rounded-md flex flex-row px-2 py-1 mb-4"
        >
          <input
            v-model="destinationNetwork"
            placeholder="Select Destination Network"
            readonly
            class="w-full border-0 outline-none bg-transparent capitalize"
          />
          <img src="@/assets/icons/select.svg" />
        </div>
      </n-popselect>

      <!-- Address -->
      <n-text>Address</n-text>
      <n-input ref="address" placeholder="0x123...789" v-model="address" class="mb-4" />

      <!-- Recipient -->
      <n-text>Recipient Address</n-text>
      <n-input ref="recipient" placeholder="0x123...789" v-model="address" />
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
import { defineComponent, h } from 'vue'
import { utils } from 'ethers'
import { NPopselect, NInput, NAlert, NText, useNotification } from 'naive-ui'
import { generateNetworkOptions, isNativeToken, getNetworkDomainIDByName } from '@/utils'
import { tokens } from '@/config'
import { useStore } from '@/store'
import NomadButton from '@/components/Button.vue'
import NotificationError from '@/components/NotificationError.vue'

export default defineComponent({
  components: {
    NText,
    NAlert,
    NInput,
    NPopselect,
    NomadButton,
  },
  data() {
    return {
      token: '',
      amount: null,
      originNetwork: '',
      destinationNetwork: '',
      address: '',
      recipient: '',
      rawTx: '',
      networkOptions: generateNetworkOptions(),
      tokenOptions: Object.keys(tokens).map((t) => ({
        label: t,
        value: t,
        key: t,
      })),
    }
  },
  setup: () => {
    const store = useStore()
    const notification = useNotification()
    return {
      notification,
      store,
    }
  },
  methods: {
    async getRawTx() {
      // TODO: add basic validation
      const valid = true
      if (valid) {
        console.log('TODO')
      }

      console.log(this.amount, this.token)
      const token = tokens[this.token]
      console.log(token)

      // set up for tx
      const payload = {
        isNative: isNativeToken(this.originNetwork, token),
        originNetwork: getNetworkDomainIDByName(this.originNetwork),
        destNetwork: getNetworkDomainIDByName(this.destinationNetwork),
        asset: token.tokenIdentifier,
        amnt: utils.parseUnits(`${this.amount}`, token.decimals),
        recipient: this.recipient,
      }
      console.log(payload)

      // send tx
      try {
        this.rawTx = await this.store.dispatch('getRawTx', payload)
        console.log('raw transaction: ', this.rawTx)
      } catch (e: any) {
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
    },
  },
})
</script>
