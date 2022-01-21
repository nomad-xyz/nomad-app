<template>
  <div class="end w-full">
    <!-- <nomad-button
      v-if="expired"
      primary
      class="action"
      :class="{ disabled: disabled }"
      @disabled="disabled"
      @click="cancel"
    >
      Cancel
    </nomad-button> -->
    <nomad-button
      v-if="ready"
      primary
      class="action"
      :class="{ disabled: disabled }"
      @disabled="disabled"
      @click="claim"
    >
      Claim
    </nomad-button>
    <a
      class="flex flex-row items-center justify-center cursor-pointer"
      :href="explorerLink"
      target="_blank"
    >
      View
      <img src="@/assets/icons/arrow-right-up.svg" alt="open" class="ml" />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useNotification } from 'naive-ui'
import { connextScanURL } from '@/config'
import { useStore } from '@/store'
import NomadButton from '@/components/Button.vue'

export default defineComponent({
  props: {
    txAction: {
      type: Object,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    expired: {
      type: Boolean,
    },
  },
  data() {
    return {
      disabled: false,
    }
  },
  setup: () => {
    const store = useStore()
    const notification = useNotification()

    return {
      store,
      notification,
    }
  },
  methods: {
    async claim() {
      console.log('claim', this.txAction)
      this.disabled = true
      await this.store.dispatch('finishTransfer', this.txAction)
      this.disabled = false
    },
    async cancel() {
      console.log('cancel expired connext tx', this.txAction)
      this.disabled = true
      try {
        await this.store.dispatch('cancelTransfer', this.txAction)
        this.notification.info({
          title: 'Transfer cancelled',
        })
      } catch (e) {
        this.notification.info({
          title: 'Error',
          content: 'An error occurred while cancelling your transfer.',
        })
        console.error(e)
      }
      this.disabled = false
    },
  },
  components: {
    NomadButton,
  },
  computed: {
    ready() {
      return this.status === 'ReceiverTransactionPrepared'
    },
    explorerLink() {
      return `${connextScanURL}tx/${this.hash}`
    },
  },
})
</script>

<style scoped lang="stylus">
.disabled
  opacity 50%
.action
  padding 3px 10px
.end
  display flex
  flex-direction column
  align-items flex-end
</style>
