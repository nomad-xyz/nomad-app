<template>
  <div v-if="payload.isNative">
    <div class="bg-white bg-opacity-5 rounded-lg p-4 mb-4">
      <div class="mb-4 text-lg">Send Transaction</div>
      <div class="p-2">
        <div
          class="glow flex flex-row items-end w-full p-4 rounded-md text-[16px] cursor-pointer relative"
          @click="copy('a', 'send')"
        >
          <div class="break-words raw-tx">{{ sendTx }}</div>
          <img
            src="@/assets/icons/copy.svg"
            alt="copy"
            class="inline ml-2 cursor-pointer"
          />
          <div v-if="copiedSend" class="absolute w-full h-full left-0 top-0 flex items-center justify-center bg-[#3C3C3C] bg-opacity-80 rounded-md transition-all transition-duration-600">
            <div class="bg-[#2fbb72] rounded-full h-10 w-10 flex items-center justify-center">
              <n-icon size="30"><checkmark-outline /></n-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="bg-white bg-opacity-5 rounded-lg p-4 mb-4">
      <div class="flex flex-row items-center mb-4">
        <div class="flex justify-center rounded-full bg-white text-black h-6 w-6 mr-2">1</div>
        <div class="text-lg">Approve Transaction</div>
      </div>
      <div class="p-2">
        <div
          class="glow flex flex-row items-end w-full p-4 rounded-md text-[16px] cursor-pointer relative"
          @click="copy('a', 'approve')"
        >
          <div class="break-words raw-tx">{{ approveTx }}</div>
          <img
            src="@/assets/icons/copy.svg"
            alt="copy"
            class="inline ml-2 cursor-pointer"
          />
          <div v-if="copiedApprove" class="absolute w-full h-full left-0 top-0 flex items-center justify-center bg-[#3C3C3C] bg-opacity-80 rounded-md transition-all transition-duration-600">
            <div class="bg-[#2fbb72] rounded-full h-10 w-10 flex items-center justify-center">
              <n-icon size="30"><checkmark-outline /></n-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white bg-opacity-5 rounded-lg p-4">
      <div class="flex flex-row items-center mb-4">
        <div class="flex justify-center rounded-full bg-white text-black h-6 w-6 mr-2">2</div>
        <div class="text-lg">Send Transaction</div>
      </div>
      <div class="p-2">
        <div
          class="glow flex flex-row items-end w-full p-4 rounded-md text-[16px] cursor-pointer relative"
          @click="copy('a', 'send')"
        >
          <div class="break-words raw-tx">{{ sendTx }}</div>
          <img
            src="@/assets/icons/copy.svg"
            alt="copy"
            class="inline ml-2 cursor-pointer"
          />
          <div v-if="copiedSend" class="absolute w-full h-full left-0 top-0 flex items-center justify-center bg-[#3C3C3C] bg-opacity-80 rounded-md transition-all transition-duration-600">
            <div class="bg-[#2fbb72] rounded-full h-10 w-10 flex items-center justify-center">
              <n-icon size="30"><checkmark-outline /></n-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <nomad-button
      class="w-full uppercase bg-white text-black h-11 flex justify-center mt-6"
      @click="$emit('back')"
    >
      Back
    </nomad-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, h, computed } from 'vue'
import { useNotification, NIcon } from 'naive-ui'
import { CheckmarkOutline } from '@vicons/ionicons5'
import { useStore } from '@/store'
import NomadButton from '@/components/Button.vue'
import NotificationError from '@/components/NotificationError.vue'
// import { SendData } from '@/store/modules/sdk'

export default defineComponent({
  emits: ['back'],
  components: {
    NomadButton,
    NIcon,
    CheckmarkOutline,
  },
  props: {
    payload: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      approveTx: '',
      sendTx: '',
      copiedApprove: false,
      copiedSend: false,
      isNativeAsset: false
    }
  },
  setup: () => {
    const store = useStore()
    const notification = useNotification()

    return {
      notification,
      store,
      walletAddress: computed(() => store.state.wallet.address),
      connected: computed(() => store.state.wallet.connected),
    }
  },
  async mounted() {
    if (!this.payload.isNative) {
      await this.getRawApproveTx()
    }
    await this.getRawSendTx()
  },
  methods: {
    copy(copyText: string, type: string) {
      console.log(copyText)
      if (type === 'send') {
        this.copiedSend = true
        setTimeout(() => {
          this.copiedSend = false
        }, 5000)
      } else {
        this.copiedApprove = true
        setTimeout(() => {
          this.copiedApprove = false
        }, 5000)
      }
    },
    async getRawApproveTx() {
      const { payload } = this

      // send tx
      try {
        this.approveTx = await this.store.dispatch('getRawApproveTx', payload)
        console.log('raw transaction: ', this.approveTx)
      } catch (e: unknown) {
        this.notification.warning({
          title: 'Unable to fetch raw approve transaction',
          content: () =>
            h(NotificationError, {
              text: 'Please reach out to us in Discord support',
              error: e as Error,
            }),
        })
        throw e
      }
    },
    async getRawSendTx() {
      const { payload } = this

      // send tx
      try {
        this.sendTx = await this.store.dispatch('getRawSendTx', payload)
        console.log('raw transaction: ', this.sendTx)
      } catch (e: unknown) {
        this.notification.warning({
          title: 'Unable to fetch raw send transaction',
          content: () =>
            h(NotificationError, {
              text: 'Please reach out to us in Discord support',
              error: e as Error,
            }),
        })
        throw e
      }
    },
  },
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.raw-tx {
  max-width: calc(100% - 20px);
}
.glow {
  border: 1px solid white;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.3);
}
</style>
