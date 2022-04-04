<template>
  <div
    class="bg-black bg-opacity-50 p-4 rounded-lg flex flex-row inputs-container"
  >
    <div class="origin flex-grow relative">
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
            {{ getDisplayName(originNetwork) }}
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
    </div>

    <!-- arrow -->
    <img src="@/assets/icons/bridge-arrow.svg" class="arrow mx-4" />

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
            {{ getDisplayName(destinationNetwork) }}
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
    </div>

    <!-- origin network select modal -->
    <network-select
      :show="showSelectOriginNetwork"
      @hide="this.showSelectOriginNetwork = false"
    />

    <!-- destination network select modal -->
    <network-select
      :show="showSelectDestinationNetwork"
      isSelectingDestination
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
import { truncateAddr, isValidAddress } from '@/utils/index'
import { networks } from '@/config'
import NetworkSelect from './Input.networks.vue'
import EditRecipient from './Input.recipient.vue'

interface ComponentData {
  showSelectOriginNetwork: boolean
  showSelectDestinationNetwork: boolean
  showEditRecipient: boolean
  truncateAddr: (addr: string) => string
}

export default defineComponent({
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
    getDisplayName(name: string) {
      if (!name) return 'Select Network'
      return networks[name].displayName
    },
  },
})
</script>

<style lang="stylus">
.inputs-container
  border: 1px solid rgba(255, 255, 255, 0.08);

.divider
  margin 10px 0 !important

@media (max-width 600px)
  .inputs-container
    flex-direction column !important
  .arrow
    display none
  .origin
    margin-bottom 40px
</style>
