<template>
  <n-modal :show="showTermsModal">
    <div class="p-4">
      <n-card class="terms-card max-w-xl rounded-xl">
        <h2 class="uppercase text-xl font-semibold mb-4">Before you proceed...</h2>
        <div class="opacity-80 text-xl mb-6">Please read and agree to our Terms of Use:</div>
        <div class="rounded-xl bg-white bg-opacity-5 border border-white border-opacity-20">
          <div class="relative">
            <div class="fade-overlay" />
            <terms class="p-4 max-h-[500px] overflow-y-scroll" />
          </div>
        </div>

        <n-checkbox
          v-model:checked="readDisclaimer"
          class="mt-6 mb-2"
        >
          I have read the disclaimer and accept the risks
        </n-checkbox>
        <n-checkbox v-model:checked="readToS">
          I have read and agree to the Terms of Use
        </n-checkbox>

        <nomad-button
          class="w-full uppercase mt-6 bg-[#4496ef] h-11 flex justify-center"
          :disabled="!readDisclaimer || !readToS"
          @click="agree"
        >
          Agree and continue
        </nomad-button>
      </n-card>
    </div>
  </n-modal>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { NModal, NCard, NCheckbox } from 'naive-ui'
import { useStore } from '@/store'
import { termsAPI } from '@/config'
import NomadButton from '@/components/Button.vue'
import Terms from '@/views/TermsOfUse.vue'

export default defineComponent({
  components: {
    NModal,
    NCard,
    NCheckbox,
    NomadButton,
    Terms,
  },

  setup: () => {
    const store = useStore()
    return {
      walletAddress: computed(() => store.state.wallet.address),
      store,
    }
  },

  data: () => ({
    showTermsModal: false,
    readDisclaimer: false,
    readToS: false,
  }),

  mounted() {
    this.checkTerms(this.walletAddress)
  },

  methods: {
    async agree() {
      try {
        const response = await fetch(`${termsAPI}api/agree/${this.walletAddress}`, {
          method: 'POST',
        })
        console.log(response)
        this.checkTerms(this.walletAddress)
      } catch (e) {
        // if db is down, allow user to proceed after agreeing
        this.showTermsModal = false
        throw new Error(`Database for Terms & Agreements is down: \n${e}`)
      }
    },
    async checkTerms(addr: string) {
      if (!addr) {
        return this.showTermsModal = false
      }

      try {
        const response = await fetch(`${termsAPI}api/agreement/${addr}`)
        if (response.status === 200) {
          console.log('user agreed')
          return this.showTermsModal = false
        } else if (response.status === 404) {
          return this.showTermsModal = true
        }
      } catch(e) {
        // if db is down, show terms by default
        this.showTermsModal = true
        throw new Error(`Database for Terms & Agreements is down: \n${e}`)
      }
    }
  },

  watch: {
    walletAddress(newAddr) {
      this.checkTerms(newAddr)
    }
  }
})
</script>

<style scoped lang="stylus">
.terms-card
  background-color #232323 !important
.fade-overlay
  position absolute
  left 0
  right 0
  bottom 0
  height 60px
  z-index 5
  border-radius 15px
  // background-color red
  background-image linear-gradient(
    rgba(35, 35, 35, 0) 0%,
    rgba(35, 35, 35, 1) 100%
  )
</style>
