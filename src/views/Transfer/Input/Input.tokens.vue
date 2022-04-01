<template>
  <n-modal :show="show" class="bg-card" @maskClick="this.$emit('hide')">
    <n-card class="w-11/12 max-w-sm">
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
          class="flex flex-row items-center justify-between p-2 cursor-pointer rounded-lg hover:bg-white hover:bg-opacity-5"
          :class="{ disabled: shouldSwitchToNative(token) }"
          @click="select(token)"
        >
          <div class="flex flex-row items-center">
            <div class="bg-black bg-opacity-50 rounded-lg p-2">
              <img :src="token.icon" class="h-6" />
            </div>
            <div class="flex flex-col ml-2">
              <n-text>{{ token.symbol }}</n-text>
              <n-text class="opacity-60 text-xs">{{ token.name }}</n-text>
            </div>
          </div>
          <nomad-button
            v-if="shouldSwitchToNative(token)"
            primary
            class="capitalize"
            @click="switchAndSelect(token)"
          >
            <n-icon size="18" class="mr-1">
              <repeat-outline />
            </n-icon>
            {{ token.nativeNetwork }}
          </nomad-button>
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
import { NModal, NCard, NText, NButton, NIcon } from 'naive-ui'
import { RepeatOutline } from '@vicons/ionicons5'
import NomadButton from '@/components/Button.vue'

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
    NIcon,
    RepeatOutline,
    NomadButton,
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
      if (this.shouldSwitchToNative(token)) return
      this.$emit('selectToken', token)
    },

    shouldSwitchToNative(token: TokenMetadata): boolean {
      if (!this.network || !token.nativeOnly) return false
      return token.nativeNetwork !== this.network.name
    },

    async switchAndSelect(token: TokenMetadata) {
      await this.store.dispatch('switchNetwork', token.nativeNetwork)
      this.select(token)
    },
  },
})
</script>

<style scoped lang="stylus">
.tokens-container
  height 90%
  max-height 300px
  overflow-x scroll
.disabled
  opacity 0.7
  cursor default
</style>
