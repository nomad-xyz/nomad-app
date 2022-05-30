<template>
  <!-- Network-specific App Alert -->
  <card-alert
    warning
    v-if="
      ($route.name === 'Bridge' || $route.name === 'NomadTransaction') &&
      showWarning
    "
  >
    {{ warning }}
    <br />
    <br />
    Need support?
    <a href="https://discord.gg/nomadxyz" class="underline" target="_blank">
      Join Discord
    </a>
  </card-alert>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from '@/store'

import CardAlert from '@/components/CardAlert.vue'

export default defineComponent({
  components: {
    CardAlert,
  },

  data: () => ({
    showWarning: false,
    warning: 'some text',
    network: 'rinkeby',
  }),

  setup: () => {
    const store = useStore()

    return {
      originNetwork: computed(() => store.state.userInput.originNetwork),
      destinationNetwork: computed(
        () => store.state.userInput.destinationNetwork
      ),
    }
  },

  watch: {
    originNetwork(network) {
      this.showWarning =
        network === this.network || this.originNetwork === this.network
    },
    destinationNetwork(network) {
      this.showWarning =
        network === this.network || this.originNetwork === this.network
    },
  },
})
</script>
