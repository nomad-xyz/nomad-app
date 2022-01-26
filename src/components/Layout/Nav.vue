<template>
  <nav
    class="flex items-center justify-between flex-wrap p-6 max-w-screen-xl mx-auto"
  >
    <!-- left side of nav -->
    <!-- company wordmark -->
    <router-link to="/">
      <img src="@/assets/wordmark.svg" class="logo flex items-center" />
    </router-link>

    <!-- right side of nav -->
    <div class="flex items-center" v-if="showButton">
      <!-- metamask not installed -->
      <!-- <nomad-button
        v-if="!metamaskInstalled"
        class="uppercase"
        primary
        @click="installMetamask"
      >
        Install Metamask
      </nomad-button> -->

      <!-- connected -->
      <n-tooltip
        v-if="walletConnected"
        placement="bottom-end"
        :show-arrow="false"
        trigger="click"
      >
        <template #trigger>
          <nomad-button class="btn-wallet-connected" :disabled="buttonDisabled">
            <n-text class="mr-2 btn-connected-wallet-text uppercase"
              >Wallet</n-text
            >
            <n-text>
              {{ truncatedAddress }}
            </n-text>
            <n-icon size="12" class="ml-2 pt-0.5">
              <ChevronDown />
            </n-icon>
          </nomad-button>
        </template>
        <!-- user settings -->
        <div style="min-width: 200px" class="pb-2">
          <router-link
            to="/tx"
            class="nav-link rounded-lg hover:bg-white hover:bg-opacity-5 px-2"
            >Search Transaction</router-link
          >
          <n-divider class="divider" />
          <div class="flex flex-row justify-between w-full p-2">
            <a
              href="https://docs.nomad.xyz/bridge/nomad-gui.html"
              target="_blank"
              class="flex flex-row items-center cursor-pointer mr-2"
            >
              <n-text>Fast bridging with Connext</n-text>
              <n-icon size="17" class="ml-1">
                <help-circle-outline />
              </n-icon>
            </a>
            <n-switch
              :value="!connextDisabled"
              @update:value="handleConnextSetting"
            >
              <template #checked class="switch-tag">on</template>
              <template #unchecked class="switch-tag">off</template>
            </n-switch>
          </div>
        </div>
      </n-tooltip>

      <!-- connect to wallet button -->
      <nomad-button
        v-else
        class="uppercase"
        :disabled="buttonDisabled"
        primary
        @click="showConnectWalletModal = true"
      >
        Connect Wallet
      </nomad-button>

      <!-- connect wallet modal -->
      <n-modal :show="showConnectWalletModal" @maskClick="showConnectWalletModal = false">
        <connect-wallet v-on:close-modal="showConnectWalletModal = false"/>
      </n-modal>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { truncateAddr } from '@/utils'
import { NText, NIcon, NTooltip, NSwitch, NDivider, NModal } from 'naive-ui'
import { ChevronDown, HelpCircleOutline } from '@vicons/ionicons5'
import NomadButton from '@/components/Button.vue'
import ConnectWallet from '@/components/ConnectWallet.vue'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    NText,
    NIcon,
    NTooltip,
    NSwitch,
    NDivider,
    NModal,
    ChevronDown,
    HelpCircleOutline,
    NomadButton,
    ConnectWallet,
  },
  data: () => ({
    buttonDisabled: false,
    showConnectWalletModal: false,
  }),
  setup: () => {
    const store = useStore()
    const route = useRoute()
    return {
      walletConnected: computed(() => store.state.wallet.connected),
      connextDisabled: computed(() => store.state.userInput.disableConnext),
      showButton: computed(() => ['Bridge'].includes(route.name as string)),
      store,
    }
  },
  methods: {
    handleConnextSetting(val: boolean) {
      this.store.dispatch('setDisableConnext', !val)
    },
    // TODO: determine what to do when user has neither metamask or wallet connect
    // installMetamask() {
    //   window.open('https://metamask.io/download.html', '_blank')
    // },
  },
  computed: {
    truncatedAddress(): string {
      const { address, connected } = this.store.state.wallet
      return connected ? truncateAddr(address) : ''
    },
    // metamaskInstalled(): boolean {
    //   const { ethereum } = window
    //   if (!ethereum) return false
    //   return !ethereum.isMetamask
    // },
  },
})
</script>

<style lang="stylus">
nav
  background-color var(--bg)

.network-text-container
  &:hover
    background-color: rgba(255, 255, 255, 0.05)

.btn-wallet-connected
  background-color: #272829

.btn-connected-wallet-text
  color: rgba(255, 255, 255, 0.4)

.logo
  height 30px

.divider
  margin 0
.nav-link
  display flex
  align-items center
  height 40px
.n-popover
  --n-color #2f2f2f !important
.n-switch__checked, .n-switch__unchecked
  margin-bottom 3px
</style>
