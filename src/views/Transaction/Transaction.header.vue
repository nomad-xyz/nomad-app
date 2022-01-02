<template>
  <div
    class="header transition-all duration-400 px-5 py-8"
    :class="[status < 3 ? 'bg-[#5185d0]' : 'bg-[#2fbb72]']"
  >
    <!-- loading -->
    <span class="flex flex-col items-center" v-if="status < 0">
      <n-spin stroke="#fff" class="mb-3" />
      <n-text class="uppercase opacity-60">Loading . . .</n-text>
    </span>
    <!-- Manual process -->
    <span class="flex flex-col items-center" v-else-if="status === 2 && readyToProcess">
      <n-text class="text-4xl mb-2">Ready to process</n-text>
      <n-text
        @click="process"
        class="uppercase opacity-60 border border-white rounded-full py-1 px-4 mt-1 cursor-pointer"
      >
        Click to process
      </n-text>
    </span>
    <!-- in progress -->
    <span class="flex flex-col items-center" v-else-if="status < 3">
      <div>
        <n-text class="text-4xl mb-2">{{ minutesRemaining ? `${minutesRemaining} minutes` : '—' }}</n-text>
        <n-text class="uppercase opacity-60">Est. time remaining</n-text>
      </div>

      <!-- dropdown status stepper -->
      <n-icon
        size="16"
        class="mt-4 cursor-pointer"
        @click="showStatus = !showStatus"
      >
        <ChevronDown
          class="transition-all"
          :class="{ 'rotate-180': showStatus }"
        />
      </n-icon>
      <div>
        <n-collapse-transition :show="showStatus">
          <n-steps vertical :current="stepperStatus" size="small" class="mt-2">
            <n-step value="0" title="Dispatched" />
            <n-step value="1" title="Included" />
            <n-step value="2" title="Relayed" />
            <n-step value="3" title="Confirmation Time" >
              <div v-if="status === 2 && minutesRemaining" class="flex flex-row">
                <n-progress
                  type="line"
                  color="#fff"
                  rail-color="rgba(255, 255, 255, 0.5"
                  :percentage="confirmationProgress"
                  indicator-text-color="#fff"
                />
              </div>
            </n-step>
            <n-step value="4" title="Processed" />
          </n-steps>
        </n-collapse-transition>
      </div>
    </span>
    <!-- complete -->
    <span class="flex flex-col items-center" v-else>
      <img src="@/assets/icons/check.svg" alt="check" class="mb-2" />
      <n-text class="uppercase opacity-80">Transfer complete</n-text>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  NText,
  NSpin,
  NSteps,
  NStep,
  NIcon,
  NCollapseTransition,
  NProgress,
} from 'naive-ui'
import { ChevronDown } from '@vicons/ionicons5'

import { useStore } from '@/store'
import {
  BUFFER_CONFIRMATION_TIME_IN_MINUTES,
} from '@/utils/time'

export default defineComponent({
  props: {
    status: {
      type: Number,
    },
    minutesRemaining: {
      type: Number,
    },
  },
  components: {
    NText,
    NSpin,
    NSteps,
    NStep,
    NIcon,
    NCollapseTransition,
    NProgress,
    ChevronDown,
  },
  data: () => ({
    showStatus: false,
  }),
  setup: () => {
    const store = useStore()
    return { store }
  },
  methods: {
    process() {
      this.store.dispatch('processTx', { origin: this.$route.params.network, hash: this.$route.params.id })
    },
  },
  computed: {
    stepperStatus(): number {
      if (this.status === 0) {
        return 1
      } else if (this.status === 1) {
        return 2
      } else if (this.status === 2) {
        return 4
      } else if (this.status === 3) {
        return 5
      }
      return 1
    },
    // TODO: calculate from confirmAt, more accurate
    // TODO: use actual confirmationTime from network
    confirmationProgress(): number {
      const confirmationMinutes = this.minutesRemaining! - BUFFER_CONFIRMATION_TIME_IN_MINUTES
      console.log(confirmationMinutes, ' minutes remaining')
      const fraction = (15 - confirmationMinutes) / 15
      return fraction * 100
    },
    // TODO: check network as well as confirmation time
    // TODO: use confirmAt
    readyToProcess(): boolean {
      if (!this.minutesRemaining) return false
      return this.minutesRemaining === BUFFER_CONFIRMATION_TIME_IN_MINUTES
    },
  }
})
</script>

<style scoped lang="stylus">
.header
  @apply w-full rounded-xl flex flex-col justify-center items-center overflow-hidden
  min-height 140px

.rotate
  transform rotateZ(180deg)
</style>
