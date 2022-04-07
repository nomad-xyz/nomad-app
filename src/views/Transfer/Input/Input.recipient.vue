<template>
  <n-modal :show="show" class="bg-card" @maskClick="this.$emit('hide')">
    <n-card class="w-11/12 max-w-sm">
      <!-- header -->
      <n-text class="uppercase">Edit destination address</n-text>
      <br />
      <n-text class="opacity-70 text-xs leading-3">
        Sending tokens to an incorrect address on the destination chain could
        result in a permanent loss of funds.
      </n-text>

      <!-- label -->
      <div class="flex flex-row items-center mt-4 mb-1">
        <n-text class="uppercase text-xs">Address</n-text>
        <n-tooltip trigger="hover" class="max-w-xs">
          <template #trigger>
            <n-icon size="15" class="ml-1">
              <information-circle-outline />
            </n-icon>
          </template>
          An EOA address is a 42-character hexadecimal address that you can
          access from your wallet
        </n-tooltip>
      </div>

      <div
        v-if="!allowEdit"
        class="flex flex-row justify-between bg-[#434343] text-sm rounded-lg px-4 py-2"
      >
        {{ newAddress ? truncateAddr(newAddress) : truncateAddr(destAddress) }}
        <n-button text type="warning" @click="allowEdit = true">
          change
        </n-button>
      </div>

      <div v-else>
        <div
          class="flex flex-row justify-center bg-[#434343] text-sm rounded-lg px-4 py-2 border border-slate-500 border-dashed cursor-pointer"
          @click="handlePaste"
        >
          <n-text>Click to paste from clipboard</n-text>
        </div>
      </div>

      <n-button
        v-if="
          destAddress !== userAddress ||
          (newAddress && newAddress !== userAddress)
        "
        text
        color="#5A94E8"
        class="mt-1 text-xs"
        @click="setUserAddr"
        >Use wallet address</n-button
      >

      <div v-else class="flex flex-row items-center mt-1">
        <n-icon size="15" class="mr-1" color="#35D07F">
          <checkmark-circle />
        </n-icon>
        <n-text class="text-xs">Using your wallet address</n-text>
      </div>

      <!-- buttons -->
      <div class="mt-3">
        <n-button
          v-if="newAddress"
          color="#5A94E8"
          text-color="#fff"
          class="w-full mt-3 uppercase"
          @click="saveAddr"
        >
          Save
        </n-button>

        <n-button
          color="#3B3B3B"
          text-color="#fff"
          class="w-full mt-3 uppercase"
          @click="close"
        >
          Cancel
        </n-button>
      </div>
    </n-card>
  </n-modal>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import {
  NModal,
  NCard,
  NText,
  NButton,
  NIcon,
  NTooltip,
  useNotification,
} from 'naive-ui'
import { InformationCircleOutline, CheckmarkCircle } from '@vicons/ionicons5'

import { useStore } from '@/store'
import { truncateAddr, isValidAddress } from '@/utils'

export default defineComponent({
  emits: ['hide'],

  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },

  components: {
    NModal,
    NCard,
    NText,
    NButton,
    NIcon,
    NTooltip,
    InformationCircleOutline,
    CheckmarkCircle,
  },

  data() {
    return {
      newAddress: '',
      allowEdit: false,
      truncateAddr,
    }
  },

  setup: () => {
    const store = useStore()
    const notification = useNotification()

    return {
      userAddress: computed(() => store.state.wallet.address),
      destAddress: computed(() => store.state.userInput.destinationAddress),
      store,
      notification,
    }
  },

  methods: {
    close() {
      this.$emit('hide')
      this.newAddress = ''
    },

    saveAddr() {
      if (this.newAddress && isValidAddress(this.newAddress)) {
        this.store.dispatch('setDestinationAddress', this.newAddress)
      }
      this.close()
    },

    async handlePaste() {
      let text = await navigator.clipboard.readText()
      if (isValidAddress(text)) {
        console.log('got valid address: ', text)
        this.newAddress = text
        this.allowEdit = false
      } else {
        this.notification.warning({
          title: 'Invalid Input',
          content: 'Please use a valid address',
          duration: 3000,
        })
      }
    },

    setUserAddr() {
      this.store.dispatch('setDestinationAddress', this.userAddress)
      this.close()
    },
  },
})
</script>
