<template>
  <nomad-button
    primary
    :disabled="disabled"
    class="w-full flex justify-center h-11 mt-4 uppercase bg-white text-black"
    @click="send"
  >
    Send
  </nomad-button>
</template>

<script lang="ts">
import { defineComponent, computed, h } from 'vue'
import { utils } from 'ethers'
import { useStore } from '@/store'
import { useNotification } from 'naive-ui'
import NomadButton from '@/components/Button.vue'
import NotificationLink from '@/components/NotificationLink.vue'
import { networks } from '@/config'
import { isNativeToken, getNetworkDomainIDByName } from '@/utils'

export default defineComponent({
  props: {
    protocol: {
      // TODO: make better type
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    NomadButton,
  },
  setup: () => {
    const store = useStore()
    const notification = useNotification()
    return {
      fee: computed(() => store.state.connext.fee),
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
        this.bridge()
      } else if (this.protocol === 'connext') {
        this.swap()
      } else {
        console.error('no protocol selected')
      }
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
        this.store.dispatch('clearInputs')
      } else {
        // TODO: better error
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
        this.notification.success({
          title: 'Success',
          content: () =>
            h(NotificationLink, {
              text: 'Transaction dispatched successfully!',
              linkText: 'View on Connextscan',
              link: `https://connextscan.io/tx/${transfer.transactionId}`,
            }),
        })
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
  },
})
</script>
