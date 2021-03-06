<template>
  <n-modal :show="show" class="bg-card" @maskClick="this.$emit('hide')">
    <n-card class="w-11/12 max-w-sm">
      <!-- header -->
      <div class="uppercase mb-5">SELECT TOKEN</div>

      <!-- search bar -->
      <search @input="updateSearch" class="mb-3" />

      <!-- token list -->
      <div class="tokens-container">
        <div
          v-for="token in tokensFilter"
          :key="token.symbol"
          class="flex flex-row items-center justify-between p-2 cursor-pointer rounded-lg hover:bg-white hover:bg-opacity-5"
          :class="{ disabled: shouldSwitchToNative(token) }"
          @click="select(token)"
        >
          <div class="flex flex-row items-center">
            <div class="bg-black bg-opacity-50 rounded-lg p-2">
              <img :src="token.icon" class="h-6 w-6" />
            </div>
            <div class="flex flex-col ml-2">
              <n-text>{{ token.symbol }}</n-text>
              <n-text class="opacity-60 text-xs">{{ token.name }}</n-text>
            </div>
          </div>
          <nomad-button
            v-if="shouldSwitchToNative(token)"
            class="capitalize bg-black bg-opacity-30 text-white"
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
import Search from '@/components/Search.vue'

import { networks, tokens } from '@/config'
import { TokenMetadata } from '@/config/types'
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
    Search,
  },

  setup: () => {
    const store = useStore()

    return {
      network: computed(() => networks[store.state.userInput.originNetwork]),
      tokens: Object.values(tokens),
      store,
    }
  },

  data: () => ({
    searchText: '',
  }),

  methods: {
    select(token: TokenMetadata) {
      if (this.shouldSwitchToNative(token)) return
      this.$emit('selectToken', token)
      this.$emit('hide')
    },

    shouldSwitchToNative(token: TokenMetadata): boolean {
      if (!this.network || !token.nativeOnly) return false
      return token.nativeNetwork !== this.network.name
    },

    async switchAndSelect(token: TokenMetadata) {
      try {
        await this.store.dispatch('switchNetwork', token.nativeNetwork)
        this.select(token)
      } catch (e: unknown) {
        this.$emit('hide')
      }
    },

    updateSearch(text: string) {
      this.searchText = text
    },
  },

  computed: {
    tokensFilter() {
      if (this.store.state.userInput.destinationNetwork === 'avalanche') {
        return this.tokens.filter((t) => t.symbol === 'HBOT')
      }
      if (this.searchText.length) {
        return this.searchMatch
      }
      return this.tokens
    },
    searchMatch(): TokenMetadata[] {
      return this.tokens.filter((t) => {
        const search = this.searchText.toLowerCase()
        const symbol = t.key.toLowerCase()
        const name = t.name.toLowerCase()
        if (symbol.includes(search)) return true
        if (name.includes(search)) return true
        if (t.tokenIdentifier) {
          const address = (t.tokenIdentifier.id as string).toLowerCase()
          if (address === search) return true
        }
        return false
      })
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
