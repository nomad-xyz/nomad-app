<template>
  <nomad-button
    primary
    class="w-full flex justify-center h-11 mt-4 uppercase bg-white text-black"
  >Send</nomad-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NomadButton from '@/components/Button.vue'

export default defineComponent({
  props: {
    protocol: {
      // TODO: make better type
      type: String,
      required: true
    },
  },
  components: {
    NomadButton,
  },
  methods: {
    send () {
      if (this.protocol === 'nomad') {
        this.bridge()
      } else if (this.protocol === 'connext') {
        this.swap()
      } else {
        console.log('no protocol selected')
      }
    },
    bridge () {
      console.log('bridge with nomad')
    },
    swap () {
      console.log('swap with Connext')
    },
  }
})
</script>

<style scoped lang="stylus">

</style>
