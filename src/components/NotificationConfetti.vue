<template>
  <div class="flex flex-col top">
    <span>{{ text }}</span>
    <a :href="link" target="_blank" class="flex flex-row text-white">
      bird
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
      particles: [
        {
          type: 'rect',
        },
        {
          type: 'circle',
        },
        {
          type: 'image',
          url: NIcon
        },
        {
          type: 'rect',
        },
        {
          type: 'circle',
        },
        {
          type: 'rect',
        },
        {
          type: 'circle',
        },
        {
          type: 'rect',
        },
        {
          type: 'circle',
        },
      ],
      defaultDropRate: 5,
      defaultSize: 6,
      particlesPerFrame: 1,
      windSpeedMax: 0.3
    })
    setTimeout(() => {
      this.confetti.defaultDropRate = 4
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
