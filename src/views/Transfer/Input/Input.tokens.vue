<template>
  <n-modal :show="show" class="bg-card" @maskClick="close">
    <n-card class="w-11/12 max-w-sm">
      <!-- header -->
      <div class="uppercase mb-5">SELECT TOKEN</div>

      <!-- tabs -->
      <div class="flex flex-row">
        <div
          class="opacity-70 cursor-pointer py-2 mr-2"
          :class="{ 'opacity-100': tab === 1 }"
          @click="tab = 1"
        >
          Your List ({{ userTokenList.length }})
        </div>
        <div
          class="opacity-70 cursor-pointer py-2"
          :class="{ 'opacity-100': tab === 2 }"
          @click="tab = 2"
        >
          Manage Tokens
        </div>
      </div>

      <!-- search bar -->
      <search @input="updateSearch" class="mb-3" />

      <!-- token list -->
      <div class="tokens-container">
        <div>
          <div v-for="token in tokenMatch" :key="token.symbol">
            <div
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
                primary
                class="capitalize"
                @click="switchAndSelect(token)"
              >
                <n-icon size="18" class="mr-1">
                  <repeat-outline />
                </n-icon>
                {{ token.nativeNetwork }}
              </nomad-button>

              <n-switch v-if="!token.default" :value="showToken(token)" @click.stop="manageToken(token)" />
            </div>
          </div>

          <!-- expand list -->
          <div
            v-if="tab === 1 && !searchText"
            class="flex flex-row items-center p-2 cursor-pointer rounded-lg hover:bg-white hover:bg-opacity-5"
            @click="tab = 2"
          >
            <div class="bg-black bg-opacity-50 rounded-lg p-2">
              <span class="flex justify-center items-center h-6 w-6">. . .</span>
            </div>
            <div class="uppercase ml-2">See all tokens ({{ tokens.length }})</div>
          </div>
        </div>
      </div>

      <n-button
        color="#3B3B3B"
        text-color="#fff"
        class="w-full mt-3 uppercase"
        @click="close"
      >
        Cancel
      </n-button>
    </n-card>
  </n-modal>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { NModal, NCard, NText, NButton, NIcon, NSwitch } from 'naive-ui'
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
    NSwitch,
    RepeatOutline,
    NomadButton,
    Search,
  },

  setup: () => {
    const store = useStore()

    return {
      network: computed(() => networks[store.state.userInput.originNetwork]),
      tokens: Object.values(tokens),
      userTokens: computed(() => store.state.wallet.tokens),
      store,
    }
  },

  data: () => ({
    tab: 1,
    searchText: '',
  }),

  methods: {
    select(token: TokenMetadata) {
      if (this.shouldSwitchToNative(token)) return
      this.$emit('selectToken', token)
      this.close()
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
        this.close()
      }
    },

    updateSearch(text: string) {
      this.searchText = text
    },

    close() {
      this.$emit('hide')
      setTimeout(() => {
        this.tab = 1
        this.searchText = ''
      }, 500)
    },

    manageToken(token: TokenMetadata) {
      if (this.showToken(token)) {
        this.store.dispatch('removeUserToken', token.key)
      } else {
        this.store.dispatch('addUserToken', token.key)
      }
    },

    showToken(token: TokenMetadata): boolean {
      return token.show || this.userTokens.some((key) => key === token.key)
    }
  },

  computed: {
    userTokenList(): TokenMetadata[] {
      return this.tokens.filter((t) => this.showToken(t))
    },
    tokenOptions(): TokenMetadata[] {
      return this.tokens.filter((t) => !t.default)
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
    tokenMatch(): TokenMetadata[] {
      if (this.searchText) return this.searchMatch
      if (this.tab === 1) return this.userTokenList
      if (this.tab === 2) return this.tokenOptions
      return this.tokens
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
