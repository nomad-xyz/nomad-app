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
import Confetti from "vue-confetti/src/confetti.js";

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
    confetti: new Confetti(),
  }),

  mounted () {
    this.confetti.update({
      particles: [
        {
          type: 'heart',
        },
        {
          type: 'circle',
        },
      ],
      defaultColors: [
        'red',
        'pink',
        '#ba0000'
      ],
      defaultDropRate: 1, 
    });
    this.confetti.start()
    setTimeout(() => {
      this.confetti.stop()
    }, 3000)
  },

  methods: {
    start() {
      this.start()
      this.start();
    },

    stop() {
      this.stop();
    },
  }
})
</script>
