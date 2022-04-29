<template>
  <status-header
    :status="status"
    :confirm-at="confirmAt"
    :destination-network="destNet"
  />

  <div class="w-full mt-8">
    <div class="flex items-center justify-between mb-8">
      <copy-hash class="text-xl font-medium" :address="$route.params.id" />
      <n-text
        v-if="status >= 0 && status < 4"
        class="flex flex-row text-sm text-white opacity-60 font-medium"
      >
        <img src="@/assets/icons/progress.svg" alt="in progress" />
        <!-- tx is dispatched but not processed -->
        <n-text class="uppercase ml-2">IN PROGRESS</n-text>
      </n-text>
    </div>

    <detail title="AMOUNT">
      <n-text v-if="amount" class="flex flex-row">
        <span>{{ amount }} {{ tokenSymbol }}</span>
        <span
          class="opacity-70 flex flex-row ml-2 cursor-pointer"
          @click="addToken"
        >
          add
          <img
            src="@/assets/icons/arrow-right-up.svg"
            alt="open"
            class="opacity-70"
          />
        </span>
      </n-text>
      <n-text v-else>{{ nullVal }}</n-text>
    </detail>
    <detail :title="`ORIGIN: ${originNet.toUpperCase()}`">
      <copy-hash v-if="originAddr" :address="originAddr" />
      <n-text v-else>{{ nullVal }}</n-text>
    </detail>
    <detail :title="`DESTINATION: ${destNet.toUpperCase()}`">
      <copy-hash v-if="destAddr" :address="destAddr" />
      <n-text v-else>{{ nullVal }}</n-text>
    </detail>
    <detail title="TRANSFER INITIATED">
      <n-time v-if="timeSent" :time="timeSent" format="yyyy-MM-dd hh:mm" />
      <n-text v-else>{{ nullVal }}</n-text>
    </detail>

    <n-divider />

    <!-- link to block explorer -->
    <div class="flex flex-row" v-if="explorerLink">
      <a
        :href="explorerLink"
        class="flex items-center hover:underline"
        target="_blank"
      >
        <n-text>Block Explorer</n-text>
        <img
          src="@/assets/icons/arrow-right-up.svg"
          alt="open"
          class="ml-2 cursor-pointer"
        />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'
import { utils, BigNumber } from 'ethers'
import { TokenIdentifier, TransferMessage } from '@nomad-xyz/sdk-bridge'
import { NText, NDivider, NTime, useNotification } from 'naive-ui'
import { useStore } from '@/store'
import { fromBytes32, toNetworkName, truncateAddr } from '@/utils'
import { nomadAPI, networks } from '@/config'
import Detail from '@/views/Transaction/Detail.vue'
import CopyHash from '@/components/CopyHash.vue'
import StatusHeader from './Header.vue'
import NotificationError from '@/components/NotificationError.vue'
import { NetworkName } from '@/config/types'

interface ComponentData {
  transferMessage: TransferMessage | null
  status: number
  confirmAt: BigNumber | null
  amount: string
  tokenSymbol: string
  tokenId: TokenIdentifier | undefined
  originNet: NetworkName
  destNet: NetworkName
  originAddr: string
  destAddr: string
  timeSent: number | undefined
  nullVal: string
  truncateAddr: (addr: string) => string
}

export default defineComponent({
  components: {
    StatusHeader,
    Detail,
    NText,
    NDivider,
    NTime,
    CopyHash,
  },

  setup: () => {
    const store = useStore()
    const notification = useNotification()
    return {
      notification,
      store,
    }
  },

  data() {
    return {
      transferMessage: null,
      status: -1,
      confirmAt: null,
      amount: '',
      tokenSymbol: '',
      tokenId: undefined,
      originNet: '',
      destNet: '',
      originAddr: '',
      destAddr: '',
      timeSent: undefined,
      nullVal: '—',
      truncateAddr,
    } as ComponentData
  },

  async mounted() {
    const { network, id } = this.$route.params
    this.checkUrlParams(network as string, id as string)
    this.originNet = toNetworkName(network as string)
    const txData = {
      network: this.originNet,
      hash: id,
    }
    const message = await this.store.getters.getTxMessage(txData)
    this.transferMessage = message
    console.log('transaction:\n', message)
    if (!message) {
      this.notification.error({
        title: 'Invalid URL',
        description:
          'Please check that the url has the correct network and transaction ID',
      })
      throw new Error('Unable to fetch transaction details')
    }

    // destination network
    this.destNet = this.store.getters.resolveDomainName(message.destination)
    // destination/origin addr
    this.originAddr = message.receipt.from
    this.destAddr = fromBytes32(message.to)
    // get token
    this.tokenId = message.token
    const token = await this.store.getters.resolveRepresentation(
      message.origin,
      message.token
    )
    if (token) {
      try {
        // token symbol
        this.tokenSymbol = await token.symbol()
        // amount divided by decimals
        const amountBN = message.amount.toString()
        const tokenDecimals = await token.decimals()
        this.amount = await utils.formatUnits(amountBN, tokenDecimals)
      } catch (e) {
        console.log(e)
      }
    }

    // status
    try {
      await this.updateStatus()
    } catch (e) {
      this.status = 0
      console.error(e)
    }

    setInterval(async () => {
      if (this.status < 4) {
        await this.updateStatus()
      }
    }, 60000)
  },

  methods: {
    checkUrlParams(network: string, id: string) {
      if (!network || !id) {
        this.notification.error({
          title: 'Incomplete URL',
          description:
            'Please add the origin network and ID of your transaction',
        })
        throw new Error(
          "Incomplete transaction URL, can't fetch transaction details"
        )
      }
      if (id.length !== 66) {
        this.notification.error({
          title: 'Invalid Transaction',
          description: 'Please check that you have the correct transaction ID',
        })
        throw new Error(
          "Invalid transaction ID, can't fetch transaction details"
        )
      }
      try {
        toNetworkName(network as string)
      } catch (e) {
        this.notification.error({
          title: 'Invalid Network Name',
          description: 'Please check that you have the correct network',
        })
        throw new Error(
          "Invalid network param, can't fetch transaction details"
        )
      }
    },
    async addToken() {
      const payload = {
        network: this.destNet,
        tokenId: this.tokenId,
      }
      try {
        await this.store.dispatch('addToken', payload)
      } catch (error: unknown) {
        this.notification.warning({
          title: 'Error adding token to Metamask',
          content: () =>
            h(NotificationError, {
              text: `Please try adding this token manually: ${
                this.tokenId!.id
              }`,
              error: error as Error,
            }),
        })
        throw error
      }
    },
    async updateStatus() {
      const { id } = this.$route.params
      const { optimisticSeconds } = networks[this.originNet]

      // fetch tx
      const res = await fetch(`${nomadAPI}${id}`)
      const tx = (await res.json())[0]
      console.log('tx data: ', tx)

      if (tx) {
        if (tx.dispatchedAt > 0) {
          this.timeSent = tx.dispatchedAt * 1000
        }

        if (tx.state === 2) {
          if (tx.relayedAt && tx.relayedAt > 0) {
            // calculate confirmation time (in case confirmAt check errors out)
            this.confirmAt = BigNumber.from(tx.relayedAt + optimisticSeconds)
          }
        }
        // set status after we have confirmAt
        this.status = tx.state
      } else {
        const message: TransferMessage = await this.store.getters.getTxMessage({
          network: toNetworkName(this.originNet),
          hash: id,
        })

        const processed = await message.getProcess()
        if (processed) {
          this.status = 4
          return
        }

        if (!this.confirmAt) {
          const relayed = await message.getReplicaUpdate()
          if (!relayed) {
            this.status = 0
            return
          }

          const relayedAt = await this.store.getters.getTimestamp(
            message.destination,
            relayed.event.blockNumber
          )
          this.confirmAt = BigNumber.from(relayedAt + optimisticSeconds)
        }

        // set status after we have confirmAt
        this.status = 2
      }
    },
  },

  computed: {
    explorerLink(): string {
      if (!this.originNet) return ''
      const n = networks[this.originNet]
      return `${n.blockExplorer}/tx/${this.$route.params.id}`
    },
  },
})
</script>
