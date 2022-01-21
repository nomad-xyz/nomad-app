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
        v-if="status >= 0 && status < 3"
        class="flex flex-row text-sm text-white opacity-60 font-medium"
      >
        <img src="@/assets/icons/progress.svg" alt="in progress" />
        <!-- tx is dispatched but not processed -->
        <n-text class="uppercase ml-2">IN PROGRESS</n-text>
      </n-text>
    </div>

    <detail title="AMOUNT">
      <n-text v-if="amount">{{ amount }} {{ tokenSymbol }}</n-text>
      <n-text v-else>{{ nullVal }}</n-text>
    </detail>
    <detail :title="`ORIGIN: ${$route.params.network.toUpperCase()}`">
      <copy-hash v-if="originAddr" :address="originAddr" />
      <n-text v-else>{{ nullVal }}</n-text>
    </detail>
    <detail :title="`DESTINATION: ${destNet.toUpperCase()}`">
      <copy-hash v-if="destAddr" :address="destAddr" />
      <n-text v-else>{{ nullVal }}</n-text>
    </detail>
    <!-- <detail title="TRANSFER INITIATED">
      <n-text>{{ timeSent || nullVal }}</n-text>
    </detail> -->

    <n-divider />

    <!-- link to block explorer -->
    <div class="flex flex-row">
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
import { defineComponent } from 'vue'
import { utils, BigNumber } from 'ethers'
import { TransferMessage } from '@nomad-xyz/sdk/nomad'
import { NText, NDivider } from 'naive-ui'

import { useStore } from '@/store'
import { truncateAddr, fromBytes32 } from '@/utils'
import { networks } from '@/config'
import Detail from '@/views/Transaction/Detail.vue'
import CopyHash from '@/components/CopyHash.vue'
import StatusHeader from './Header.vue'

interface ComponentData {
  transferMessage: TransferMessage | null
  status: number
  confirmAt: BigNumber | null
  amount: string
  tokenSymbol: string
  destNet: string
  originAddr: string
  destAddr: string
  timeSent: string
  nullVal: string
  truncateAddr: (addr: string) => string
}

export default defineComponent({
  components: {
    StatusHeader,
    Detail,
    NText,
    NDivider,
    CopyHash,
  },

  setup: () => {
    const store = useStore()
    return { store }
  },

  data() {
    return {
      transferMessage: null,
      status: -1,
      confirmAt: null,
      amount: '',
      tokenSymbol: '',
      destNet: '',
      originAddr: '',
      destAddr: '',
      timeSent: '19:12 PM UTC, 12/23/2021',
      nullVal: '—',
      truncateAddr,
    } as ComponentData
  },

  async mounted() {
    const txData = {
      network: this.$route.params.network,
      hash: this.$route.params.id,
    }
    const message = await this.store.getters.getTxMessage(txData)
    this.transferMessage = message
    console.log('transaction:\n', message)

    // destination network
    this.destNet = this.store.getters.resolveDomainName(message.destination)
    // destination/origin addr
    this.originAddr = message.receipt.from
    this.destAddr = fromBytes32(message.to)
    // get token
    const token = await this.store.getters.resolveRepresentation(
      message.origin,
      message.token
    )
    // token symbol
    this.tokenSymbol = await token?.symbol()
    // amount as BN
    const amountBN = message.amount.toString()
    // amount divided by decimals
    this.amount = await utils.formatUnits(amountBN, await token!.decimals())
    // status
    await this.getStatus(message)

    setInterval(() => {
      if (this.status < 3) {
        this.getStatus(message)
      }
    }, 60000)
  },

  methods: {
    async getStatus(message: TransferMessage) {
      if (!message) return
      const status = (await message.events()).status
      console.log('status: ', status)
      this.status = status
      // if status is 2, get confirmAt timestamp
      if (this.status === 2 && !this.confirmAt) {
        this.confirmAt = await message.confirmAt()
      }
    },
  },

  computed: {
    explorerLink(): string {
      const n = networks[this.$route.params.network as string]
      return `${n.blockExplorer}/tx/${this.$route.params.id}`
    },
  },
})
</script>
