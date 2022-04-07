<template>
  <n-modal :show="show" class="bg-card" @maskClick="$emit('hide')">
    <n-card class="w-11/12 max-w-xs">
      <!-- header -->
      <div class="mb-5">
        <n-text class="block">{{ title }}</n-text>
      </div>

      <!-- network list -->
      <div
        v-for="network in networks"
        :key="network.name"
        class="flex flex-row items-center p-2 rounded-lg cursor-pointer hover:bg-white hover:bg-opacity-5"
        :class="{ 'opacity-40': unavailable(network) }"
        @click="select(network)"
      >
        <div class="bg-black bg-opacity-50 rounded-lg p-2">
          <img :src="network.icon" class="h-6" />
        </div>
        <div class="flex flex-col ml-2">
          <n-text>{{ network.displayName }}</n-text>
        </div>
      </div>
      <!-- TODO: support secondary nomad-button and use here -->
      <n-button
        color="#3B3B3B"
        text-color="#fff"
        class="w-full mt-3 uppercase"
        @click="$emit('hide')"
      >
        Cancel
      </n-button>
    </n-card>
  </n-modal>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { NModal, NCard, NText, NButton } from 'naive-ui'
import { NetworkMetadata } from '@/config/config.types'
import { useStore } from '@/store'

export default defineComponent({
  emits: ['hide'],

  props: {
    show: {
      type: Boolean,
      required: true,
    },
    isSelectingDestination: Boolean,
  },

  components: {
    NModal,
    NCard,
    NText,
    NButton,
  },

  setup(props) {
    const store = useStore()

    return {
      networks: computed(() => store.getters.activeNetworks()),
      title: computed(() => {
        return props.isSelectingDestination
          ? 'SELECT DESTINATION'
          : 'SELECT ORIGIN'
      }),
      store,
    }
  },

  computed: {
    otherNetwork() {
      const { originNetwork, destinationNetwork } = this.store.state.userInput
      return this.isSelectingDestination ? originNetwork : destinationNetwork
    },
  },

  methods: {
    select(network: NetworkMetadata) {
      const isUnavailable = this.unavailable(network)
      if (this.isSelectingDestination) {
        if (isUnavailable) {
          this.store.dispatch('setOriginNetwork', null)
        }
        this.store.dispatch('setDestinationNetwork', network.name)
      } else {
        if (isUnavailable) {
          this.store.dispatch('setDestinationNetwork', null)
        }
        this.store.dispatch('switchNetwork', network.name)
      }
      this.$emit('hide')
    },
    unavailable(network: NetworkMetadata): boolean {
      if (!this.otherNetwork) return false
      if (network.name === this.otherNetwork) return true

      const { connections } = this.networks.find((n: NetworkMetadata) => {
        return n.name === this.otherNetwork
      })
      return !connections.includes(network.name)
    },
  },
})
</script>
