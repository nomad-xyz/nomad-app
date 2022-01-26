<template>
  <div class="app-container">
    <div class="header"><Nav /></div>
    <div class="main flex flex-col items-center m-auto relative">
      <router-view></router-view>
    </div>
    <div class="footer"><Footer /></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from '@/store'

import { RouterView } from 'vue-router'
import Nav from '@/components/Layout/Nav.vue'
import Footer from '@/components/Layout/Footer.vue'

export default defineComponent({
  components: {
    RouterView,
    Nav,
    Footer,
  },
  async mounted() {
    const store = useStore()

    // instantiate Nomad
    await store.dispatch('instantiateNomad')
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
