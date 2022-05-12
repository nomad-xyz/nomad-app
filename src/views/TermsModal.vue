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
        <nomad-button
          class="w-full uppercase mt-6 bg-[#4496ef] h-11 flex justify-center"
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
import { NModal, NCard } from 'naive-ui'
import { useStore } from '@/store'
import NomadButton from '@/components/Button.vue'
import Terms from '@/views/TermsOfUse.vue'

export default defineComponent({
  components: {
    NModal,
    NCard,
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
  }),

  mounted() {
    this.checkTerms(this.walletAddress)
  },

  methods: {
    async agree() {
      const response = await fetch(`http://localhost:1020/api/agree/${this.walletAddress}`, {
        method: 'POST',
      })
      console.log(response)
      this.checkTerms(this.walletAddress)
    },
    async checkTerms(addr: string) {
      if (!addr) {
        return this.showTermsModal = false
      }

      const response = await fetch(`http://localhost:1020/api/agreement/${addr}`)
      if (response.status === 200) {
        console.log('user agreed')
        return this.showTermsModal = false
      } else if (response.status === 404) {
        console.log('user not agreed')
        return this.showTermsModal = true
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
