<template>
  <div class="review w-full rounded-md p-7">
    <!-- header -->
    <div class="flex flex-row w-full justify-between items-center px-5 pb-7">
      <breadcrumb @click="this.$emit('back')"/>
      <span class="uppercase">Review & Bridge</span>
      <transfer-steps :current="2" />
    </div>

    <!-- protocol select -->
    <div class="flex flex-row mb-6">
      <protocol
        :selected="protocol === 'nomad'"
        name="nomad"
        time="30-65 min"
        description="Bridges funds from one chain to another"
        fee="No fee"
        @click="protocol = 'nomad'"
      />
      <protocol
        :selected="protocol === 'connext'"
        name="connext"
        time="7-10 min"
        description="Swaps existing liquidity between chains"
        fee="0.5% TX fee"
        @click="protocol = 'connext'"
      />
    </div>
    <!-- transfer details -->
    <review-detail title="From">
      <div>
        <span class="mr">Ethereum</span>
        <span class="opacity-50">| 0x979...678</span>
      </div>
    </review-detail>
    <review-detail title="To">
      <div>
        <span class="mr">Moonbeam</span>
        <span class="opacity-50">| 0x979...678</span>
      </div>
    </review-detail>
    <review-detail title="Send amount">
      <div>7.5 ETH</div>
    </review-detail>
    <review-detail title="Receive Amount">
      <div>7.5 wETH</div>
    </review-detail>
    <review-detail title="Gas Fee">
      <div>1000 GWEI</div>
    </review-detail>
    <review-detail title="Tx Fee">
      <div>1000 GWEI</div>
    </review-detail>
    <review-detail title="Processing Gas Fee" :borderBottom="false">
      <div>~1000 GWEI</div>
    </review-detail>

    <!-- Send -->
    <review-send />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Breadcrumb from '@/components/Breadcrumb.vue'
import TransferSteps from '../Transfer.steps.vue'
import Protocol from './Review.protocol.vue'
import ReviewDetail from './Review.detail.vue'
import ReviewSend from './Review.send.vue'

export default defineComponent({
  emits: ['back'],
  components: {
    Breadcrumb,
    TransferSteps,
    Protocol,
    ReviewDetail,
    ReviewSend,
  },
  data: () => ({
    protocol: 'nomad',
  }),
})
</script>

<style scoped lang="stylus">
.review
  background-color #2F2F2F
</style>
