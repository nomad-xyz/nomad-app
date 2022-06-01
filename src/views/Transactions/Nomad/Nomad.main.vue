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
import { request, gql } from 'graphql-request'

import { useStore } from '@/store'
import { getNetworkByDomainID } from '@/utils'
import { nomadAPI } from '@/config'
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
      const pageNum = page || this.page
      if (this.address) {
        // const res = await fetch(
        //   `${nomadAPI}tx?page=${pageNum - 1}&size=${this.size}&recipient=${
        //     this.address
        //   }`
        // )
        // graphql sandbox:
        // https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Fbridge-indexer.dev.madlads.tools%2Fgraphql&explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4QEcYIE4CeABAIq6EAUAJAO4AW%2BC6RAsggM7sCGA5hwOoM8CAJJIADjBQBKIsAA6SIkQBmASyRgWXJATadeHCvUbNaQhABoiKLgGsmRAKzX2dteOYAGWQqXKiNTBFAKJEAz4ACS52OhCAiDw1Hg145TAOFA0uLIgkNKIkPKgEAo0UfCQuABsAZWQMvDLUSpqAJQQoDzVkFAK4dh4AFQJxUv9lPAgIPomidlsKgrA1dnEcqDoAIWroO2XV9ZRNhDAAQVnQmHEwHNOLguFqrgJ7y4DhErUANzeC8SmJU4fzmUDy6jwcAec3YDXwj063V6BS4cAgMFQKOquxoADEYu90ghbGpquxorECigIA4kAARCBwLipObU2kiYJzABGEDABAK1QQXBUYgyAA8qRK5jwYhc6YcNnFpbKUABVG53Aoy9gXDrPfnKnUoDpfX5alUABUBHHYBVhmLm11uFU5oSeL1OCNNnrmAOgNp9oSgwju53eAF9FOGQOGgA
        const variables = JSON.stringify({
          where: {
            OR: [
              {
                recipient: {
                  equals: "0x9791c9dF02D34F2e7d7322D655535d9849E8da5c"
                },
                sender: {
                  equals: "0x9791c9dF02D34F2e7d7322D655535d9849E8da5c"
                }
              }
            ]
          }
        })
        const query = gql`
          {
            Query(
              where: MessagesWhereInput,
            )  {
              findManyMessages(where, take: 5, skip: 0) {
                id
                messageHash
                origin
                destination
                nonce
                internalSender
                internalRecipient
                msgType
                root
                state
                dispatchBlock
                dispatchedAt
                updatedAt
                relayedAt
                receivedAt
                processedAt
                confirmAt
                sender
                recipient
                amount
                allowFast
                detailsHash
                tokenDomain
                tokenId
                body
                leafIndex
                tx
                gasAtDispatch
                gasAtUpdate
                gasAtRelay
                gasAtReceive
                gasAtProcess
                sent
                updated
                relayed
                received
                processed
                createdAt
              }
            }
          }`
        request({
          url: `${nomadAPI}graphql`,
          document: query,
          variables: variables,
          // requestHeaders: headers,
        }).then((data) => console.log('DATA', data))
      }
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
})
</script>

<style scoped lang="stylus">
.active-txs
  margin-top 100px
</style>
