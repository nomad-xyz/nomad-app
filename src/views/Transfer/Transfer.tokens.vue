<template>
  <n-modal :show="show" class="bg-card" @maskClick="this.$emit('hide')">
    <n-card class="w-11/12 max-w-xs">
      <!-- header -->
      <div class="uppercase mb-5">SELECT TOKEN</div>

      <!-- search bar -->
      <!-- TODO: search by token symbol or address -->
      <!-- <search class="mb-3" /> -->

      <!-- token list -->
      <div class="tokens-container">
        <div
          v-for="token in tokens"
          :key="token.symbol"
          class="flex flex-row items-center p-2 cursor-pointer rounded-lg hover:bg-white hover:bg-opacity-5"
          @click="select(token)"
        >
          <div class="bg-black bg-opacity-50 rounded-lg p-2">
            <img :src="token.icon" class="h-6" />
          </div>
          <div class="flex flex-col ml-2">
            <n-text>{{ token.symbol }}</n-text>
            <n-text class="opacity-60 text-xs">{{ token.name }}</n-text>
          </div>
        </div>
      </div>
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
import { defineComponent, computed } from 'vue'
import { NModal, NCard, NText, NButton } from 'naive-ui'

import { networks, tokens } from '@/config/index'
import { TokenMetadata } from '@/config/config.types'
import { useStore } from '@/store'

export default defineComponent({
  emits: ['selectToken', 'hide'],

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
  },

  setup: () => {
    const store = useStore()

    return {
      network: computed(() => networks[store.state.userInput.originNetwork]),
      tokens: Object.values(tokens),
      store,
    }
  },

  methods: {
    select(token: TokenMetadata) {
      this.$emit('selectToken', token)
    },
  },
})
</script>

<style scoped lang="stylus">
.tokens-container
  height 90%
  max-height 300px
  overflow-x scroll
</style>
