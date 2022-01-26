<template>
  <div v-if="active.length" class="active-txs">
    <div class="flex flex-row items-center p-2 mb-3 justify-between">
      <n-text class="uppercase text-lg font-semibold">
        Active Connext Transactions
      </n-text>
      <n-text class="opacity-70 text-lg">{{ active.length }}</n-text>
    </div>
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="active"
      :pagination="pagination"
    />
  </div>
</template>

<script lang="ts">
import { h, defineComponent, computed } from 'vue'
import { NDataTable, NText } from 'naive-ui'

import { useStore } from '@/store'
import TransactionMain from './columns/transaction.vue'
import Networks from './columns/networks.vue'
import Actions from './columns/actions.vue'
// import Amount from './columns/amount.vue'

const createColumns = () => {
  return [
    {
      title: 'Transaction',
      key: 'transaction',
      render(tx: any) {
        return h(TransactionMain, {
          status: tx.status,
          hash: tx.key,
          expired: tx.expired,
        })
      },
    },
    {
      title: 'Networks',
      key: 'networks',
      render(tx: any) {
        return h(Networks, {
          originChainId: tx.sendingChain,
          destinationChainId: tx.receivingChain,
        })
      },
    },
    // {
    //   title: 'Amount',
    //   key: 'amount',
    //   render (tx: any) {
    //     return h(
    //       Amount,
    //     )
    //   }
    // },
    {
      title: 'Status',
      key: 'status',
      render(tx: any) {
        return h(Actions, {
          txAction: tx.action,
          hash: tx.key,
          status: tx.status,
          expired: tx.expired,
        })
      },
    },
  ]
}

type ComponentData = {
  active: Array<unknown>
  pagination: {
    pageSize: number
  }
  pollActiveTxs: number | null
}

export default defineComponent({
  components: {
    NDataTable,
    NText,
  },

  data() {
    return {
      active: [],
      pagination: {
        pageSize: 5,
      },
      pollActiveTxs: null
    } as ComponentData
  },

  setup: () => {
    const store = useStore()
    return {
      store,
      columns: createColumns(),
      walletConnected: computed(() => store.state.wallet.connected),
    }
  },

  unmounted() {
    this.clearPollActiveTxs()
  },

  methods: {
    async getActive() {
      const activeTxs = await this.store.getters.getActiveConnextTxs()
      if (activeTxs.length) {
        this.active = activeTxs
      }
      console.log('Active Connext Txs: ', this.active)
    },

    clearPollActiveTxs() {
      if (this.pollActiveTxs) {
        window.clearInterval(this.pollActiveTxs)
        this.pollActiveTxs = null
      }
    },
  },

  watch: {
    walletConnected(newWalletConnected) {
      if (newWalletConnected) {
        this.getActive()
        this.pollActiveTxs = window.setInterval(this.getActive, 15000)
      } else {
        this.clearPollActiveTxs()
      }
    },
  },
})
</script>

<style scoped lang="stylus">
.active-txs
  margin-top 100px
</style>
