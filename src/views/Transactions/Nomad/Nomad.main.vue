<template>
  <div class="active-txs w-full max-w-lg" v-if="this.history.length">
    <div class="flex flex-row items-center p-2 mb-3 justify-between">
      <n-text class="uppercase text-lg font-semibold">
        Nomad Transaction History
      </n-text>
      <!-- <n-text class="opacity-70 text-lg">{{ history.length }}</n-text> -->
    </div>
    <div
      v-for="tx in this.history"
      :key="tx"
      @click="toTx(tx)"
      class="cursor-pointer"
    >
      <div class="flex flex-row justify-between items-center">
        <transaction :tx="tx" />
        <amount :tx="tx" />
      </div>
      <n-divider />
    </div>

    <!-- pagination -->
    <div class="flex flex-row items-center justify-between">
      <div class="flex flex-row">
        <div
          @click="changePage(page - 1)"
          class="bg-[#434343] h-8 w-8 mr-2 flex items-center justify-center rounded-sm cursor-pointer"
          :class="{ 'opacity-50': page === 1 }"
        >
          <n-icon><chevron-back-outline /></n-icon>
        </div>
        <div
          @click="changePage(page + 1)"
          class="bg-[#434343] h-8 w-8 flex items-center justify-center rounded-sm cursor-pointer"
          :class="{ 'opacity-50': page === pageCount || history.length < size }"
        >
          <n-icon><chevron-forward-outline /></n-icon>
        </div>
      </div>
      <div class="opacity-70 uppercase">Page {{ page }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { ChevronBackOutline, ChevronForwardOutline } from '@vicons/ionicons5'
import { NText, NDivider, NIcon } from 'naive-ui'

import { useStore } from '@/store'
import { getNetworkByDomainID } from '@/utils'
import { getUserHistory } from '@/utils/nomadAPI'
import Transaction from './columns/transaction.vue'
import Amount from './columns/amount.vue'

type ComponentData = {
  history: Array<unknown>
  pollActiveTxs: number | null
}

export default defineComponent({
  components: {
    ChevronBackOutline,
    ChevronForwardOutline,
    NText,
    NDivider,
    NIcon,
    Transaction,
    Amount,
  },

  data() {
    return {
      history: [],
      pollActiveTxs: null,
    } as ComponentData
  },

  setup: () => {
    const store = useStore()

    return {
      store,
      size: 7,
      page: ref(1),
      pageCount: ref(1000),
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
    async changePage(page: number) {
      if (page <= 0) return
      if (this.pageCount && page > this.pageCount) return
      if (page > this.page && this.history.length < this.size) return
      await this.getHistory(page)
    },

    async getHistory(page?: number) {
      if (!this.address) return

      const pageNum = page || this.page
      const history = await getUserHistory(this.address, pageNum, this.size)
      if (!history.length) {
        this.pageCount = this.page
        return
      }
      this.history = history
      this.page = pageNum
    },

    clearPollActiveTxs() {
      if (this.pollActiveTxs) {
        window.clearInterval(this.pollActiveTxs)
        this.pollActiveTxs = null
      }
    },

    toTx(tx: any) {
      const originNetwork = getNetworkByDomainID(tx.origin).name
      this.$router.push(`/tx/nomad/${originNetwork}/${tx.tx}`)
    },
  },

  watch: {
    address(newAddress, oldAddress) {
      if (newAddress !== oldAddress) {
        this.history = []
        this.page = 1
        this.pageCount = 1000
        this.getHistory()
      }
    }
  }
})
</script>

<style scoped lang="stylus">
.active-txs
  margin-top 100px
</style>
