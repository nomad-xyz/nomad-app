<template>
  <!-- BRIDGE TOKENS card -->
  <div>
    <!-- color blur section -->
    <div class="bridge">
      <bg-blur class="absolute inset-0 w-full h-full z-negative" />
      <div class="absolute top-0 w-full flex justify-end py-5 px-8">
        <transfer-steps :current="1" />
      </div>
      <transfer-amount />
    </div>

    <!-- bottom drawer -->
    <div class="drawer py-5 px-8">
      <transfer-inputs class="bridge-inputs" />
      <nomad-button
        class="w-full uppercase mt-6 bg-white text-black h-11 flex justify-center"
        @click="next"
      >
        <span>Next</span>
      </nomad-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'

import { useStore } from '@/store'

import BgBlur from './Input.bgblur.vue'
import TransferSteps from '../Transfer.steps.vue'
import TransferAmount from './Input.amount.vue'
import TransferInputs from './Input.inputs.vue'
import NomadButton from '@/components/Button.vue'

export default defineComponent({
  emits: ['next'],

  components: {
    BgBlur,
    TransferSteps,
    TransferAmount,
    TransferInputs,
    NomadButton,
  },

  setup: () => {
    const store = useStore()

    // contains validation scope, collects validations from children components but does not emit up to parent
    const v$ = useVuelidate({
      $scope: 'bridge',
      $stopPropagation: true,
    })

    return {
      userInput: computed(() => store.state.userInput),
      store,
      v$,
    }
  },

  methods: {
    async next() {
      const valid = await this.v$.$validate()
      if (valid) this.$emit('next')
    },
  },
})
</script>

<style lang="stylus">
.bridge
  position relative
  display flex
  flex-direction column
  justify-content center
  align-items center
  padding 20px
  min-height 300px
  border-radius 12px 12px 0 0
  background-repeat no-repeat
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  overflow: hidden;

.bridge-inputs
  backdrop-filter: blur(66px);

.drawer
  background-color #2F2F2F
  border-radius 0 0 12px 12px

.z-negative
  z-index -1
</style>
