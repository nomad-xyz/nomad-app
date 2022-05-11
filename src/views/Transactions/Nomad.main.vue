<template>
  <div class="active-txs">
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
    >
      {{ tx.origin }}
    </div>
  </div>
</template>

<script lang="ts">
import { h, defineComponent, computed, reactive } from 'vue'
import { NText } from 'naive-ui'

import { useStore } from '@/store'
import TransactionMain from './columns/transaction.vue'
const nomadAPI = 'https://bridge-indexer.dev.madlads.tools/tx'
// import Networks from './columns/networks.vue'
// import Actions from './columns/actions.vue'
// import Amount from './columns/amount.vue'

const createColumns = () => {
  return [
    {
      title: 'Transaction',
      key: 'transaction',
      render(tx: any) {
        return h(TransactionMain, {
          status: 'status',
          hash: tx.hash,
          expired: false,
        })
      },
    },
    // {
    //   title: 'Networks',
    //   key: 'networks',
    //   render(tx: any) {
    //     return h(Networks, {
    //       originChainId: tx.sendingChain,
    //       destinationChainId: tx.receivingChain,
    //     })
    //   },
    // },
    // // {
    // //   title: 'Amount',
    // //   key: 'amount',
    // //   render (tx: any) {
    // //     return h(
    // //       Amount,
    // //     )
    // //   }
    // // },
    // {
    //   title: 'Status',
    //   key: 'status',
    //   render(tx: any) {
    //     return h(Actions, {
    //       txAction: tx.action,
    //       hash: tx.key,
    //       status: tx.status,
    //       expired: tx.expired,
    //     })
    //   },
    // },
  ]
}

type ComponentData = {
  history: Array<unknown>
  pollActiveTxs: number | null
}

export default defineComponent({
  components: {
    NText,
  },

  data() {
    return {
      history: [],
      pollActiveTxs: null
    } as ComponentData
  },

  setup: () => {
    const store = useStore()
    const paginationReactive = reactive({
      page: 2,
      pageSize: 10,
      onChange: (page: number) => {
        paginationReactive.page = page
      },
    })
    return {
      store,
      pagination: paginationReactive,
      columns: createColumns(),
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
    async getHistory() {
      if (this.address) {
        const res = await fetch(`${nomadAPI}?amount=${this.pagination.pageSize}&page=1&receiver=${this.address}`)
        console.log('res', res)
        const data = (await res.json()) as any
        console.log('data', data)
        this.history = data
      }
      // if (history.length) {
      //   this.history = history
      // }
      // console.log('Active Connext Txs: ', this.history)
    },

    clearPollActiveTxs() {
      if (this.pollActiveTxs) {
        window.clearInterval(this.pollActiveTxs)
        this.pollActiveTxs = null
      }
    },

    toTx() {
      // TODO:
    }
  },

  // watch: {
  //   walletConnected(newWalletConnected) {
  //     if (newWalletConnected) {
  //       this.getHistory()
  //       this.pollActiveTxs = window.setInterval(this.getHistory, 15000)
  //     } else {
  //       this.clearPollActiveTxs()
  //     }
  //   },
  // },
})
</script>

<style scoped lang="stylus">
.active-txs
  margin-top 100px
</style>
