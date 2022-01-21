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
        class="flex flex-row items-center p-2 cursor-pointer rounded-lg hover:bg-white hover:bg-opacity-5"
        @click="select(network)"
      >
        <div class="bg-black bg-opacity-50 rounded-lg p-2">
          <img :src="network.icon" class="h-6" />
        </div>
        <div class="flex flex-col ml-2">
          <n-text class="capitalize">{{ network.name }}</n-text>
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
import { networks } from '@/config/index'
import { NetworkMetadata } from '@/config/config.types'
import { filterDestinationNetworks } from '@/utils'
import { useStore } from '@/store'

export default defineComponent({
  emits: ['selectNetwork', 'hide'],

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
      networks: computed(() =>
        props.isSelectingDestination
          ? filterDestinationNetworks(
              networks,
              store.state.userInput.originNetwork
            )
          : networks
      ),
      title: computed(() =>
        props.isSelectingDestination ? 'SELECT DESTINATION' : 'SELECT ORIGIN'
      ),
    }
  },

  methods: {
    select(network: NetworkMetadata) {
      this.$emit('selectNetwork', network)
    },
  },
})
</script>
