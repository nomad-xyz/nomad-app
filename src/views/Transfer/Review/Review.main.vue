<template>
  <div class="review w-full rounded-md p-7">
    <!-- header -->
    <div class="flex flex-row w-full justify-between items-center px-5 pb-7">
      <breadcrumb @click="this.$emit('back')"/>
      <span class="uppercase">Review & Bridge</span>
      <transfer-steps :current="2" />
    </div>

    <!-- protocol select -->
    <div class="flex flex-row">
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
    <div class="p-4">
      <review-detail title="From">
        <div>
          <span class="mr-1 capitalize">{{ userInput.originNetwork }}</span>
          <span class="opacity-50">| 0x979...678</span>
        </div>
      </review-detail>
      <review-detail title="To">
        <div>
          <span class="mr-1 capitalize">{{ userInput.destinationNetwork }}</span>
          <span class="opacity-50">| 0x979...678</span>
        </div>
      </review-detail>
      <review-detail title="Send amount">
        <div class="flex flex-row items-center">
          <img :src="userInput.token.icon" class="h-4 mr-1" />
          {{ userInput.sendAmount }} {{ userInput.token.symbol }}
        </div>
      </review-detail>
      <review-detail title="Receive Amount">
        <div class="flex flex-row items-center">
          <img :src="userInput.token.icon" class="h-4 mr-1" />
          {{ userInput.sendAmount }} {{ userInput.token.nativeOnly ? 'W' : '' }}{{ userInput.token.symbol }}
        </div>
      </review-detail>
      <review-detail title="Gas Fee">
        <div>1000 GWEI (ETH)</div>
      </review-detail>
      <review-detail title="Tx Fee">
        <div>1000 GWEI (ETH)</div>
      </review-detail>
      <review-detail title="Processing Gas Fee" :borderBottom="false">
        <!-- TODO: get native asset -->
        <div class="flex flex-row items-center">
          ~1000 GWEI (ETH)
          <n-icon size="22" color="#70c0e8" class="ml-1 cursor-pointer">
            <alert-circle />
          </n-icon>
        </div>
      </review-detail>
    </div>

    <!-- Send -->
    <review-send />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { NIcon } from 'naive-ui'
import { AlertCircle } from '@vicons/ionicons5'
import { useStore } from '@/store'

import Breadcrumb from '@/components/Breadcrumb.vue'
import TransferSteps from '../Transfer.steps.vue'
import Protocol from './Review.protocol.vue'
import ReviewDetail from './Review.detail.vue'
import ReviewSend from './Review.send.vue'

export default defineComponent({
  emits: ['back'],
  components: {
    Breadcrumb,
    NIcon,
    AlertCircle,
    TransferSteps,
    Protocol,
    ReviewDetail,
    ReviewSend,
  },
  setup: () => {
    const store = useStore()
    return {
      userInput: computed(() => store.state.userInput),
      store,
    }
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
