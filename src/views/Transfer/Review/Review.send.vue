<template>
  <nomad-button
    primary
    :disabled="disabled"
    class="w-full flex justify-center h-11 mt-4 uppercase bg-white text-black"
    @click="send"
  >Send</nomad-button>
</template>

<script lang="ts">
import { defineComponent, computed, h } from 'vue'
import { useStore } from '@/store'
import { useNotification } from 'naive-ui'
import NomadButton from '@/components/Button.vue'
import ConnextLink from './ConnextLink.vue'

export default defineComponent({
  props: {
    protocol: {
      // TODO: make better type
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    NomadButton,
  },
  setup: () => {
    const store = useStore()
    const notification = useNotification()
    return {
      fee: computed(() => store.state.connext.fee),
      quote: computed(() => store.state.connext.quote),
      store,
      notification,
    }
  },
  methods: {
    send () {
      if (this.protocol === 'nomad') {
        this.bridge()
      } else if (this.protocol === 'connext') {
        this.swap()
      } else {
        console.error('no protocol selected')
      }
    },
    bridge () {
      console.log('bridge with nomad')
    },
    async swap () {
      try {
        const transfer = await this.store.dispatch('prepareTransfer')
        this.notification.success({
          title: 'Success',
          content: () => h(ConnextLink, {
            text: 'Transaction dispatched successfully!',
            linkText: 'View on Connextscan.',
            link: `https://connextscan.io/tx/${transfer.transactionId}`
          })
        })
      } catch (e: any) {
        this.notification.error({
          title: 'Error sending Connext transaction',
          description: e.message,
          duration: 3000,
        })
      }
    },
  }
})
</script>

<style scoped lang="stylus">

</style>
