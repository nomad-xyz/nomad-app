<template>
  <n-card
    style="width: 600px;"
    size="small"
  >
    <div
      class="flex align-center justify-center"
    >
      <img
        src="@/assets/metamask-logo-2.svg"
        width="200"
        class=""
      />
      <div class="w-2/5">
        <n-text>
          metamask
        </n-text>
        <nomad-button
          primary
          @click="handleMetamaskButtonClick"
        >
          Connect
        </nomad-button>
      </div>
    </div>
    <div
      class="flex align-center justify-center"
    >
      <img
        src="@/assets/walletconnect-logo.svg"
        width="200"
        class=""
        />
      <div class="w-2/5">
        <n-text>
          wallet connect
        </n-text>
        <nomad-button
          primary
          @click="handleWalletConnectButtonClick"
        >
          Connect
        </nomad-button>
      </div>
    </div>
  </n-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NCard } from 'naive-ui'
import NomadButton from '@/components/Button.vue'
import { useStore } from '@/store'
import { WALLET } from '@/utils/wallet'

export default defineComponent({
  components: {
    NCard,
    NomadButton,
  },
  data: () =>  ({
    disableMetamaskButton: false,
    disableWalletConnectButton: false,
  }),
  setup: () => {
    const store = useStore()

    return {
      store,
    }
  },
  methods: {
    async handleWalletConnectButtonClick() {
      this.disableWalletConnectButton = true

      try {
        await this.store.dispatch('connectWallet', WALLET.WALLETCONNECT)
      } catch (error) {
        // TODO: determine how we want to handle connect wallet errors
        console.log('connect wallet error', error)
      } finally {
        this.disableWalletConnectButton = false
        this.$emit('closeModal')
      }
    },
    async handleMetamaskButtonClick() {
      this.disableMetamaskButton = true

      try {
        await this.store.dispatch('connectWallet', WALLET.METAMASK)
      } catch (error) {
        // TODO: determine how we want to handle metamask errors
        console.log('metamask error', error)
      } finally {
        this.disableMetamaskButton = false
        this.$emit('closeModal')
      }
    },
  },
})
</script>

<style lang="stylus">
</style>