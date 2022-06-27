<template>
  <div class="flex flex-col items-center">
    <transfer-input v-if="step === 1" />
    <transfer-review v-if="step === 2" />
    <!-- <nomad-history /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from '@/store'
import TransferInput from './Input/Input.main.vue'
import TransferReview from './Review/Review.main.vue'
// import NomadHistory from '@/views/Transactions/Nomad/Nomad.main.vue'

export default defineComponent({
  components: {
    TransferInput,
    TransferReview,
    // NomadHistory,
  },
  setup: () => {
    const store = useStore()
    return {
      step: computed(() => store.state.userInput.step),
    }
  },
})
</script>
