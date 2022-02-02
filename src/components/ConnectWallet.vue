<template>
  <n-modal :show="showConnectWalletModal" @maskClick="closeConnectWalletModal">
    <n-card
      style="width: 95%; max-width: 450px; background-color: #2f2f2f"
      class="rounded-md"
      size="small"
    >
      <div
        class="wallet-select flex align-center justify-between rounded-md bg-translucent m-2"
        @click="
          metamaskInstalled() ? handleMetamaskButtonClick() : installMetamask()
        "
      >
        <div class="w-full flex items-center justify-center">
          <img src="@/assets/metamask-logo.svg" width="200" />
        </div>
        <div class="wallet-connect flex flex-col justify-center items-center">
          <div class="m-2">Metamask</div>
          <nomad-button primary>
            {{ metamaskInstalled() ? 'Connect' : 'Install' }}
          </nomad-button>
        </div>
      </div>

      <div
        class="wallet-select flex align-center justify-center rounded-md bg-translucent m-2"
        @click="handleWalletConnectButtonClick"
      >
        <div
          class="bg-walletconnect rounded-md w-full flex items-center justify-center p-4 m-2"
        >
          <img
            src="@/assets/walletconnect-logo.svg"
            width="200"
            class="h-full"
          />
        </div>
        <div class="wallet-connect flex flex-col justify-center items-center">
          <div class="m-2">WalletConnect</div>
          <nomad-button primary>Connect</nomad-button>
        </div>
      </div>
    </n-card>
  </n-modal>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { NModal, NCard } from 'naive-ui'
import NomadButton from '@/components/Button.vue'
import { useStore } from '@/store'
import { WalletType } from '@/utils/wallet'

export default defineComponent({
  components: {
    NModal,
    NCard,
    NomadButton,
  },
  data: () => ({
    disableMetamaskButton: false,
    disableWalletConnectButton: false,
  }),
  setup: () => {
    const store = useStore()

    return {
      showConnectWalletModal: computed(
        () => store.state.wallet.showConnectWalletModal
      ),
      store,
    }
  },
  methods: {
    async handleWalletConnectButtonClick() {
      this.disableWalletConnectButton = true

      try {
        await this.store.dispatch('connectWallet', WalletType.WalletConnect)
      } catch (error) {
        // TODO: determine how we want to handle connect wallet errors
        console.log('connect wallet error', error)
      } finally {
        this.disableWalletConnectButton = false
        this.closeConnectWalletModal()
      }
    },
    async handleMetamaskButtonClick() {
      this.disableMetamaskButton = true

      try {
        await this.store.dispatch('connectWallet', WalletType.Metamask)
      } catch (error) {
        // TODO: determine how we want to handle metamask errors
        console.log('metamask error', error)
      } finally {
        this.disableMetamaskButton = false
        this.closeConnectWalletModal()
      }
    },
    installMetamask() {
      console.log('here')
      window.open('https://metamask.io/download.html', '_blank')
    },
    metamaskInstalled(): boolean {
      const { ethereum } = window
      if (!ethereum) return false
      return !ethereum.isMetamask
    },
    closeConnectWalletModal() {
      this.store.dispatch('closeConnectWalletModal')
    },
  },
})
</script>

<style lang="stylus">
.wallet-select
  max-height 116px
.wallet-connect
  min-width 150px
.bg-translucent
  background-color rgba(255, 255, 255, 0.07)
  cursor pointer
  &:hover
    background-color rgba(255, 255, 255, 0.2)
.bg-walletconnect
  background-color #3B99FC
</style>
