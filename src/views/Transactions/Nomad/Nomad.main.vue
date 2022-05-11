<template>
  <div class="active-txs w-full max-w-lg">
    <div class="flex flex-row items-center p-2 mb-3 justify-between">
      <n-text class="uppercase text-lg font-semibold">
        Nomad Transaction History
      </n-text>
      <n-text class="opacity-70 text-lg">{{ history.length }}</n-text>
    </div>
    <div
      v-for="tx in this.history"
      :key="tx"
      @click="toTx"
      class="cursor-pointer"
    >
      <transaction :status="tx.state" :hash="tx.tx" :destination="tx.destination" />
      <n-divider />
    </div>
    <!-- <n-pagination v-model:page="page" :page-count="10"/> -->
    <n-button-group>
      <n-button @click="changePage(page - 1)">
        <template #icon>
          <n-icon><chevron-back-outline /></n-icon>
        </template>
        Back
      </n-button>
      <n-button @click="changePage(page + 1)">
        <template #icon>
          <n-icon><chevron-forward-outline /></n-icon>
        </template>
        Next
      </n-button>
    </n-button-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { ChevronBackOutline, ChevronForwardOutline } from '@vicons/ionicons5'
import {
  NText,
  NDivider,
  NIcon,
  NButtonGroup,
  NButton,
} from 'naive-ui'

import { useStore } from '@/store'
import Transaction from './columns/transaction.vue'
const nomadAPI = 'https://bridge-indexer.prod.madlads.tools/tx'

type ComponentData = {
  history: Array<unknown>
  pollActiveTxs: number | null
}

export default defineComponent({
  components: {
    NText,
    NDivider,
    NIcon,
    NButtonGroup,
    NButton,
    Transaction,
    ChevronBackOutline,
    ChevronForwardOutline,
  },

  data() {
    return {
      history: [],
      pollActiveTxs: null
    } as ComponentData
  },

  setup: () => {
    const store = useStore()

    return {
      store,
      page: ref(1),
      walletConnected: computed(() => store.state.wallet.connected),
      address: computed(() => store.state.wallet.address),
    }
  },

  mounted() {
    this.getHistory()
    this.pollActiveTxs = window.setInterval(this.getHistory, 15000)
  },

  unmounted() {
    this.clearPollActiveTxs()
  },

  methods: {
    changePage(page: number) {
      if (page <= 0) return
      this.page = page
    },

    async getHistory() {
      if (this.address) {
        const res = await fetch(`${nomadAPI}?amount=10&page=${this.page}&receiver=${this.address}`)
        const data = (await res.json()) as any
        console.log('data', data)
        if (!data.length) return
        this.history = data
      }
    },

    clearPollActiveTxs() {
      if (this.pollActiveTxs) {
        window.clearInterval(this.pollActiveTxs)
        this.pollActiveTxs = null
      }
    },

    toTx(tx: any) {
      const originNetwork = this.store.getters.resolveDomainName(tx.origin)
      this.$router.push(`/tx/nomad/${originNetwork}/${tx.tx}`)
    },
  },

  watch: {
    page() {
      this.getHistory()
    }
  },
})
</script>

<style scoped lang="stylus">
.active-txs
  margin-top 100px
</style>
