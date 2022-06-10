<template>
  <div class="app-container">
    <terms-modal />

    <div class="header"><Nav /></div>
    <div class="main flex flex-col items-center m-auto relative">
      <!-- Display if any Homes are in a failed state -->
      <card-alert
        :show="failedHomes.size > 0"
        title="Under maintenance, temporarily unavailable:"
      >
        <span
          v-for="(domain, i) in failedHomes"
          :key="domain"
          class="capitalize mr-2"
        >
          {{ getNetworkByDomainID(domain).name }}
          <span v-if="i < failedHomes.size - 1">,</span>
        </span>
      </card-alert>

      <!-- Network-specific App Alert -->
      <!-- uncomment, update warning text and network -->
      <!-- <network-alert /> -->

      <!-- page view -->
      <router-view></router-view>
    </div>
    <div class="footer"><Footer /></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import * as Sentry from '@sentry/browser'
import { useStore } from '@/store'

import { RouterView } from 'vue-router'
import Nav from '@/components/Layout/Nav.vue'
import Footer from '@/components/Layout/Footer.vue'
import CardAlert from '@/components/CardAlert.vue'
import TermsModal from '@/views/TermsModal.vue'
// import NetworkAlert from '@/components/NetworkAlert.vue'
import { getNetworkByDomainID } from '@/utils'
import analytics from '@/services/analytics'

export default defineComponent({
  components: {
    RouterView,
    Nav,
    Footer,
    CardAlert,
    TermsModal,
  },

  data: () => ({
    failedHomes: new Set(),
  }),

  setup: () => {
    const store = useStore()

    return {
      originNetwork: computed(() => store.state.userInput.originNetwork),
      destinationNetwork: computed(
        () => store.state.userInput.destinationNetwork
      ),
      address: computed(() => store.state.wallet.address),
    }
  },

  async mounted() {
    if (this.address) {
      Sentry.setUser({ id: this.address })
    }
    const store = useStore()

    // instantiate Nomad & Connext
    await store.dispatch('instantiateNomad')

    // set failedHomes
    setInterval(() => {
      this.failedHomes = store.getters.blacklist()
    }, 3000)
  },

  methods: { getNetworkByDomainID },

  watch: {
    address(newAddr) {
      if (newAddr) {
        Sentry.setUser({ id: newAddr })
      }
    },
    $route(to) {
      // track page changes
      analytics.page(to.name)
    },
  },
})
</script>

<style lang="stylus">
.app-container
  min-height 100vh

  /* grid container settings */
  display grid
  grid-template-columns 1fr
  grid-template-rows auto 1fr auto
  grid-template-areas 'header' 'main' 'footer'

  > .header
    grid-area header
    width 100vw
    position -webkit-sticky
    position sticky
    top 0px
    z-index 999

  > .main
    grid-area main
    width 100vw
    min-height 100%
    max-width 1200px
    padding 50px 20px

  > .footer
    grid-area footer
    width 100vw
</style>
