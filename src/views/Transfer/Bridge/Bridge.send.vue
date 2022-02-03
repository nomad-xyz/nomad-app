<template>
  <!-- ETA -->
  <div class="flex flex-row justify-between">
    <n-text class="opacity-50">Est. time to delivery</n-text>
    <n-text v-if="userInput.destinationNetwork">{{ timeToDelivery }}</n-text>
    <n-text v-else>—</n-text>
  </div>

  <n-divider />

  <!-- nomad -->
  <div class="flex flex-row items-center">
    <img src="@/assets/icons/nomad.svg" class="h-9 mr-2 rounded-md" />
    <div class="flex flex-col">
      <n-text>Send via the Nomad bridge</n-text>
      <n-text class="opacity-50">
        Nomad is a secure, cost-efficent cross-chain protocol
        <a
          href="https://docs.nomad.xyz/bridge/nomad-gui.html"
          target="_blank"
          class="text-white underline cursor-pointer"
        >
          Learn more
        </a>
      </n-text>
    </div>
  </div>

  <!-- Fast Liquidity -->
  <!-- Not supported currently, will be optional setting in the future -->
  <!-- <div v-else class="flex flex-row items-center">
    <img src="@/assets/icons/fast-liquidity.svg" class="h-9 mr-2" />
    <div class="flex flex-col">
      <n-text>Your funds may be delivered instantaneously.</n-text>
      <n-text class="opacity-50">
        If successful, this will incur a 0.5% fee.
        <a href="" target="_blank" class="text-white hover:underline">
          Learn more
        </a>
      </n-text>
    </div>
  </div> -->

  <nomad-button
    v-if="checkingLiquidity"
    class="w-full uppercase mt-6 bg-white text-black h-11 flex flex-row justify-center bg-opacity-70 cursor-default"
  >
    Checking
    <img src="@/assets/connext-logo-black.png" class="h-6 px-2" />
    availability
  </nomad-button>

  <nomad-button
    v-else
    class="w-full uppercase mt-6 bg-white text-black h-11 flex justify-center"
    @click="bridge"
  >
    Bridge Tokens
  </nomad-button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { NText, NDivider, useNotification } from 'naive-ui'
import { networks, BUFFER_CONFIRMATION_TIME_IN_MINUTES } from '@/config'
import { useStore } from '@/store'
import NomadButton from '@/components/Button.vue'

export default defineComponent({
  components: {
    NText,
    NDivider,
    NomadButton,
  },
  props: {
    v$: {
      type: Object,
      required: true,
    },
    bridge: {
      type: Function,
      required: true,
    },
  },
  setup: () => {
    const store = useStore()
    const notification = useNotification()

    return {
      userInput: computed(() => store.state.userInput),
      checkingLiquidity: computed(() => store.state.connext.checkingLiquidity),
      originAddress: computed(() => store.state.wallet.address),
      balance: computed(() => store.state.sdk.balance),
      sending: computed(() => store.state.sdk.sending),
      timeToDelivery: computed(() => {
        const n = networks[store.state.userInput.destinationNetwork]
        const min = n?.confirmationTimeInMinutes + 5
        const max = min + BUFFER_CONFIRMATION_TIME_IN_MINUTES
        return `${min} - ${max} minutes`
      }),
      notification,
      store,
    }
  },
})
</script>
