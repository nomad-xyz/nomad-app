<template>
  <div
    class="bg-black bg-opacity-50 p-4 rounded-lg flex flex-row inputs-container"
  >
    <div class="flex-grow relative">
      <!-- origin network not selected -->
      <p
        class="validation-err text-red-500 text-xs"
        v-if="v$.originNetwork.$invalid"
      >
        * required
      </p>
      <!-- network selector -->
      <div
        class="flex flex-row items-center justify-between cursor-pointer"
        @click="this.showSelectOriginNetwork = true"
      >
        <n-text class="opacity-50">Origin</n-text>
        <div class="flex flex-row items-center max-w-[300]">
          <n-text class="font-bold text-base capitalize">
            {{ originNetwork || 'Select Network' }}
          </n-text>
          <img src="@/assets/icons/select.svg" class="ml-1" />
        </div>
      </div>

      <n-divider class="divider" />

      <!-- origin address -->
      <div class="flex flex-row justify-between">
        <n-text class="opacity-50">Address</n-text>
        <n-text>{{ truncateAddr(originAddr) || '—' }}</n-text>
      </div>

      <n-divider class="divider" />

      <!-- gas fee -->
      <div class="flex flex-row justify-between">
        <n-text class="opacity-50">Gas Fee (GWEI)</n-text>
        <div v-if="originNetwork && originGasFee">
          <n-text>{{ displayGasFee() }}</n-text>
        </div>
        <n-text v-else>—</n-text>
      </div>
    </div>

    <!-- arrow -->
    <img src="@/assets/icons/bridge-arrow.svg" class="mx-4" />

    <!-- right -->
    <div class="flex-grow relative">
      <!-- destination network not selected -->
      <p
        class="validation-err text-red-500 text-xs"
        v-if="v$.destinationNetwork.$invalid"
      >
        * required
      </p>
      <!-- network selector -->
      <div
        class="flex flex-row items-center justify-between cursor-pointer"
        @click="this.showSelectDestinationNetwork = true"
      >
        <n-text class="opacity-50">Destination</n-text>
        <div class="flex flex-row items-center max-w-[300]">
          <n-text class="font-bold text-base capitalize">
            {{ destinationNetwork || 'Select Network' }}
          </n-text>
          <img src="@/assets/icons/select.svg" class="ml-1" />
        </div>
      </div>

      <n-divider class="divider" />

      <!-- destination address -->
      <div class="flex flex-row justify-between relative">
        <!-- invalid destination address -->
        <p
          class="validation-err text-red-500 text-xs"
          v-if="v$.destinationAddr.$invalid"
        >
          * invalid
        </p>
        <n-text class="opacity-50">Address</n-text>
        <div class="flex flex-row">
          <n-text>
            {{ truncateAddr(destinationAddr) || '—' }}
          </n-text>
          <n-button
            v-if="destinationAddr"
            text
            color="#fff"
            class="opacity-50 ml-1 cursor-pointer"
            @click="showEditRecipient = true"
          >
            edit
          </n-button>
        </div>
        <!-- Edit destination address modal -->
        <edit-recipient
          :show="showEditRecipient"
          @hide="showEditRecipient = false"
        />
      </div>

      <n-divider class="divider" v-if="claimGasFee" />

      <!-- gas fee -->
      <div v-if="claimGasFee" class="flex flex-row justify-between">
        <n-text class="opacity-50">Gas Fee</n-text>
        <div>
          <a
            href="https://docs.nomad.xyz/bridge/nomad-gui.html#completing-a-transfer-ethereum-destination-only"
            target="_blank"
            class="flex align-center underline"
          >
            Paid on claim
            <img
              src="@/assets/icons/arrow-right-up.svg"
              alt="open"
              class="opacity-70"
            />
          </a>
        </div>
      </div>
    </div>

    <!-- origin network select modal -->
    <network-select
      :show="showSelectOriginNetwork"
      @selectNetwork="selectOriginNetwork"
      @hide="this.showSelectOriginNetwork = false"
    />

    <!-- destination network select modal -->
    <network-select
      :show="showSelectDestinationNetwork"
      isSelectingDestination
      @selectNetwork="selectDestinationNetwork"
      @hide="this.showSelectDestinationNetwork = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { NText, NDivider, NButton } from 'naive-ui'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { useStore } from '@/store'
import { truncateAddr, toDecimals, isValidAddress } from '@/utils/index'
import { NetworkMetadata } from '@/config/config.types'
import { networks, hubNetwork } from '@/config'
import NetworkSelect from './Transfer.networks.vue'
import EditRecipient from './Transfer.recipient.vue'

interface ComponentData {
  showSelectOriginNetwork: boolean
  showSelectDestinationNetwork: boolean
  showEditRecipient: boolean
  truncateAddr: (addr: string) => string
}

export default defineComponent({
  props: {
    connextAvail: {
      type: Boolean,
    },
  },
  components: {
    NText,
    NDivider,
    NButton,
    NetworkSelect,
    EditRecipient,
  },
  data() {
    return {
      showSelectOriginNetwork: false,
      showSelectDestinationNetwork: false,
      showEditRecipient: false,
      truncateAddr,
    } as ComponentData
  },
  setup: () => {
    const store = useStore()
    const v$ = useVuelidate({ $scope: 'bridge' })

    return {
      originAddr: computed(() => store.state.wallet.address),
      destinationAddr: computed(() => store.state.userInput.destinationAddress),
      originGasFee: computed(() => store.state.userInput.gasEst),
      originNetwork: computed(() => store.state.userInput.originNetwork),
      destinationNetwork: computed(
        () => store.state.userInput.destinationNetwork
      ),
      store,
      v$,
    }
  },
  validations() {
    return {
      originNetwork: { required, $lazy: true },
      destinationNetwork: { required, $lazy: true },
      destinationAddr: {
        required,
        isValid: (value: string) => isValidAddress(value),
        $lazy: true,
      },
    }
  },
  methods: {
    selectOriginNetwork(network: NetworkMetadata) {
      this.v$.originNetwork.$touch()
      this.store.dispatch('switchNetwork', network.name)
      this.store.dispatch('setDestinationNetwork', null)

      this.showSelectOriginNetwork = false
    },
    selectDestinationNetwork(network: NetworkMetadata) {
      this.v$.destinationNetwork.$touch()
      this.store.dispatch('setDestinationNetwork', network.name)

      this.showSelectDestinationNetwork = false
    },
    displayGasFee() {
      const { nativeToken } = networks[this.originNetwork]
      if (this.originGasFee) {
        return toDecimals(this.originGasFee, nativeToken.decimals - 9, 6)
      }
    },
  },
  computed: {
    claimGasFee() {
      if (!this.destinationNetwork) return false
      if (this.connextAvail) return true
      return this.destinationNetwork === hubNetwork.name
    },
  },
})
</script>

<style lang="stylus">
.inputs-container
  border: 1px solid rgba(255, 255, 255, 0.08);

.divider
  margin 10px 0 !important
</style>
