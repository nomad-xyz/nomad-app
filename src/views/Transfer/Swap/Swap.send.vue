<template>
  <!-- ETA -->
  <div class="flex flex-row justify-between">
    <n-text class="opacity-50">Est. time to delivery</n-text>
    <n-text>Less than 10 minutes</n-text>
  </div>

  <n-divider />

  <!-- Connext -->
  <div class="flex flex-row items-center">
    <img src="@/assets/icons/connext.svg" class="h-9 mr-2" />
    <div class="flex flex-col">
      <div class="flex flex-row justify-between">
        <n-text>Your transfer will be filled by Connext.</n-text>
        <nomad-button primary class="small" @click="useNomad">
          Use Nomad
        </nomad-button>
      </div>
      <n-text class="opacity-50">
        For an additional fee, Connext will swap tokens for an ultra-fast
        cross-chain transfer.
        <a
          href="https://docs.connext.network/Integration/SystemOverview/howitworks"
          target="_blank"
          class="text-white underline cursor-pointer"
        >
          Learn more
        </a>
      </n-text>
    </div>
  </div>

  <bridge-quote v-if="quoteInitiated" />

  <nomad-button
    v-if="checkingLiquidity"
    class="w-full uppercase mt-6 bg-white text-black h-11 flex flex-row justify-center bg-opacity-70 cursor-default"
  >
    Checking
    <img src="@/assets/connext-logo-black.png" class="h-6 px-2" />
    availability
  </nomad-button>

  <nomad-button
    v-else-if="!quoteInitiated"
    class="w-full uppercase mt-6 bg-white text-black h-11 flex justify-center"
    @click="quoteSwap"
  >
    Preview Send
  </nomad-button>

  <nomad-button
    v-else
    class="w-full uppercase mt-6 bg-white text-black h-11 flex justify-center disabled:opacity-30"
    @disabled="!quote"
    @click="swap"
  >
    Send Tokens
  </nomad-button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { NText, NDivider, useNotification } from 'naive-ui'
import { useStore } from '@/store'
import NomadButton from '@/components/Button.vue'
import BridgeQuote from './Swap.quote.vue'

export default defineComponent({
  components: {
    NText,
    NDivider,
    NomadButton,
    BridgeQuote,
  },
  props: {
    v$: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      quoteInitiated: false,
    }
  },
  setup: () => {
    const store = useStore()
    const notification = useNotification()

    return {
      userInput: computed(() => store.state.userInput),
      quote: computed(() => store.state.connext.quote),
      checkingLiquidity: computed(() => store.state.connext.checkingLiquidity),
      notification,
      store,
    }
  },

  methods: {
    useNomad() {
      this.store.dispatch('overrideConnext')
    },
    // use connext to swap tokens
    async quoteSwap() {
      if (!this.metamaskInstalled) {
        this.notification.info({
          title: 'Install Metamask',
          content: 'Please install Metamask to continue',
        })
        return
      }
      // validate inputs, return if invalid
      const inputsValid = await this.v$.$validate()
      if (!inputsValid) return

      this.quoteInitiated = true
      // instantiate connext
      await this.store.dispatch('instantiateConnext')

      // get transfer quote
      try {
        await this.store.dispatch('getTransferQuote')
      } catch (e: any) {
        this.notification.info({
          title: 'Error preparing transfer',
          content: e.message,
        })
        this.quoteInitiated = false
      }
    },
    async swap() {
      await this.store.dispatch('prepareTransfer')
      this.notification.success({
        title: 'Success',
        content: 'Transaction dispatched',
      })
    },
  },

  watch: {
    userInput: {
      async handler() {
        // user should initiate the quote first by clicking quote swap first
        if (!this.quoteInitiated) {
          return
        }

        // reset and show user the quote swap button again
        await this.store.dispatch('resetTransferQuote')
        this.quoteInitiated = false
      },
      deep: true,
    },
    async sendAmount(newAmt) {
      console.log('send amount changed!', newAmt)
      // user should initiate the quote first by clicking quote swap first
      if (!this.quoteInitiated) {
        return
      }

      // reset and show user the quote swap button again
      await this.store.dispatch('resetTransferQuote')
      this.quoteInitiated = false
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

<style scoped lang="stylus">
.small
  padding 1px 10px
  font-size 13px
</style>
