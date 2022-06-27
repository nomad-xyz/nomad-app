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
    We apologize for any inconvenience, please
    <a href="https://discord.gg/nomadxyz" class="underline" target="_blank">
      join Discord
    </a>
    for updates.

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
    warning: `The Moonbeam Network has gone into Maintenance Mode to deploy time-sensitive network fixes. Bridging to and from moonbeam is not available at this time.`,
    network: 'moonbeam',
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
