<template>
  <div class="flex flex-col top">
    <span>{{ text }}</span>
    <a :href="link" target="_blank" class="flex flex-row text-[#70C0E8] w-full py-1 mt-1">
      Tweet about it
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Confetti from 'vue-confetti/src/confetti.js'
import NIcon from '@/assets/N.svg'

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    confetti: new Confetti()
  }),

  mounted () {
    this.confetti.start({
      // the more often a type appears, the larger percentage of particles
      particles: [
        { type: 'rect' },
        { type: 'rect' },
        { type: 'rect' },
        { type: 'rect' },
        { type: 'circle' },
        { type: 'circle' },
        { type: 'circle' },
        { type: 'circle' },
        {
          type: 'image',
          url: NIcon
        },
      ],
      defaultDropRate: 7,
      defaultSize: 6,
      particlesPerFrame: 1,
      windSpeedMax: 0.3
    })
    setTimeout(() => {
      this.confetti.defaultDropRate = 5
      this.confetti.particlesPerFrame = 0.5
    }, 3000)
    setTimeout(() => {
      this.confetti.defaultDropRate = 2
      this.confetti.particlesPerFrame = 0.1
    }, 4500)
    setTimeout(() => {
      this.confetti.stop()
    }, 5500)
  },
})
</script>
