<template>
  <transfer-input v-if="step === 1" @next="step = 2" />
  <transfer-review v-if="step === 2" @back="step = 1" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TransferInput from './Input/Input.main.vue'
import TransferReview from './Review/Review.main.vue'

export default defineComponent({
  components: {
    TransferInput,
    TransferReview,
  },
  data: () => ({
    step: 1,
  }),
})
</script>
