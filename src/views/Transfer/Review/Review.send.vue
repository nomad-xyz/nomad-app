<template>
  <nomad-button
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
import { useNotification, NSpin } from 'naive-ui'
import NomadButton from '@/components/Button.vue'
import NotificationLink from '@/components/NotificationLink.vue'
import { networks, connextScanURL } from '@/config'
import { isNativeToken, getNetworkDomainIDByName } from '@/utils'

export default defineComponent({
  emits: ['back'],
  props: {
    protocol: {
      // TODO: make better type
      type: String,
      required: true,
    },
  },
  components: {
    NomadButton,
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
      this.$emit('back')
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
      // null if not successful
      const transferMessage = await this.store.dispatch('send', payload)
      // handle tx success/error
      if (transferMessage) {
        console.log('transferMessage', transferMessage)
        const txHash = transferMessage.receipt.transactionHash
        this.$router.push(`/tx/nomad/${originNetwork}/${txHash}`)
      } else {
        this.notification.warning({
          title: 'Transaction send failed',
          content:
            'We encountered an error while dispatching your transaction.',
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
      } catch (e: any) {
        this.notification.error({
          title: 'Error sending Connext transaction',
          description: e.message,
          duration: 3000,
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
  },
})
</script>
