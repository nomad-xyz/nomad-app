<template>
  <n-popconfirm
    v-if="showConfirmPopup"
    @positive-click="send"
    :negative-button-props="{ quaternary: true }"
  >
    <template #trigger>
      <nomad-button
        primary
        :disabled="disableSend"
        class="w-full flex justify-center h-11 mt-4 uppercase bg-white text-black"
        :class="{ 'bg-opacity-70': disableSend }"
      >
        <n-spin
          v-if="protocol === 'connext' && !quote"
          stroke="rgba(0,0,0,0.5)"
        />
        <span v-else>Send</span>
      </nomad-button>
    </template>
    <div>
      <p>
        <b>Important</b>: Additional step required to complete Ethereum bound
        transactions.
      </p>
      <p>
        You must return to the transaction page to submit transaction to claim
        funds.
      </p>
      <div class="flex flex-row">
        <a
          class="underline"
          href="https://docs.nomad.xyz/bridge/nomad-gui.html#completing-a-transfer-ethereum-destination-only"
          target="_blank"
        >
          Learn more
        </a>
        <img
          src="@/assets/icons/arrow-right-up.svg"
          alt="open"
          class="mt-1 cursor-pointer"
        />
      </div>
    </div>
  </n-popconfirm>
  <nomad-button
    v-else
    primary
    :disabled="disableSend"
    class="w-full flex justify-center h-11 mt-4 uppercase bg-white text-black"
    :class="{ 'bg-opacity-70': disableSend }"
    @click="send"
  >
    <n-spin v-if="protocol === 'connext' && !quote" stroke="rgba(0,0,0,0.5)" />
    <span v-else>Send</span>
  </nomad-button>
</template>

<script lang="ts">
import { defineComponent, computed, h } from 'vue'
import { utils } from 'ethers'
import { useStore } from '@/store'
import { useNotification, NPopconfirm, NSpin } from 'naive-ui'
import NomadButton from '@/components/Button.vue'
import NotificationLink from '@/components/NotificationLink.vue'
import { networks, connextScanURL } from '@/config'
import { isNativeToken, getNetworkDomainIDByName } from '@/utils'

export default defineComponent({
  props: {
    protocol: {
      // TODO: make better type
      type: String,
      required: true,
    },
  },
  components: {
    NomadButton,
    NPopconfirm,
    NSpin,
  },
  setup: () => {
    const store = useStore()
    const notification = useNotification()
    return {
      quote: computed(() => store.state.connext.quote),
      userInput: computed(() => store.state.userInput),
      store,
      notification,
    }
  },
  methods: {
    async send() {
      if (!this.metamaskInstalled) {
        this.notification.info({
          title: 'Install Metamask',
          content: 'Please install Metamask to continue',
        })
        return
      }
      await this.store.dispatch('switchNetwork', this.userInput.originNetwork)
      if (this.protocol === 'nomad') {
        await this.bridge()
      } else if (this.protocol === 'connext') {
        await this.swap()
      } else {
        console.error('no protocol selected')
      }
      // clear user input and switch back to input screen
      this.store.dispatch('clearInputs')
      this.store.dispatch('setTransferStep', 1)
    },
    async bridge() {
      const {
        sendAmount,
        token,
        destinationAddress,
        originNetwork,
        destinationNetwork,
      } = this.userInput
      // set signer
      this.store.dispatch('registerSigner', networks[originNetwork])
      // set up for tx
      const payload = {
        isNative: isNativeToken(originNetwork, token),
        originNetwork: getNetworkDomainIDByName(originNetwork),
        destNetwork: getNetworkDomainIDByName(destinationNetwork),
        asset: token.tokenIdentifier,
        amnt: utils.parseUnits(sendAmount.toString(), token.decimals),
        recipient: destinationAddress,
      }

      // send tx
      try {
        const transferMessage = await this.store.dispatch('send', payload)
        console.log('transferMessage', transferMessage)
        const txHash = transferMessage.receipt.transactionHash
        this.$router.push(`/tx/nomad/${originNetwork}/${txHash}`)
      } catch (e: any) {
        this.notification.error({
          title: 'Transaction send failed',
          description: e.message,
        })
      }
    },
    async swap() {
      try {
        const transfer = await this.store.dispatch('prepareTransfer')
        const txLink = `${connextScanURL}tx/${transfer.transactionId}`
        this.notification.success({
          title: 'Success',
          content: () =>
            h(NotificationLink, {
              text: 'Transaction dispatched successfully!',
              linkText: 'View on Connextscan',
              link: txLink,
            }),
        })
        // window.open(txLink, '_blank')
      } catch (e: unknown) {
        this.notification.error({
          title: 'Error sending Connext transaction',
          description: (e as Error).message,
        })
      }
    },
  },
  computed: {
    metamaskInstalled(): boolean {
      const { ethereum } = window
      if (!ethereum) return false
      return !ethereum.isMetamask
    },
    disableSend(): boolean {
      return this.protocol === 'connext' && !this.quote
    },
    showConfirmPopup(): boolean {
      return (
        this.protocol === 'nomad' &&
        networks[this.userInput.destinationNetwork].manualProcessing
      )
    },
  },
})
</script>

<style lang="stylus">
.n-popover.n-popconfirm,
.n-popover-arrow
  background-color rgba(75, 75, 75, 1) !important
</style>
