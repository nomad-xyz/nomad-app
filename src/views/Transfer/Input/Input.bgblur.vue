<template>
  <svg
    viewBox="0 0 541 321"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_b_14_33)">
      <path
        d="M0 321H541V12C541 5.37259 535.627 0 529 0H12C5.37259 0 0 5.37258 0 12V321Z"
        fill="black"
        fill-opacity="0.08"
      />
    </g>
    <path d="M0 321H541V-7.62939e-06H0V321Z" fill="url(#paint0_radial_14_33)" />
    <path
      d="M0 321H541V-7.62939e-06H0V321Z"
      fill="url(#paint1_linear_14_33)"
      fill-opacity="0.26"
    />
    <path d="M0 321H541V-7.62939e-06H0V321Z" fill="black" fill-opacity="0.2" />
    <defs>
      <filter
        id="filter0_b_14_33"
        x="-104"
        y="-104"
        width="749"
        height="529"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feGaussianBlur in="BackgroundImage" stdDeviation="52" />
        <feComposite
          in2="SourceAlpha"
          operator="in"
          result="effect1_backgroundBlur_14_33"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_backgroundBlur_14_33"
          result="shape"
        />
      </filter>
      <radialGradient
        id="paint0_radial_14_33"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(193) rotate(77.613) scale(328.651 551.531)"
      >
        <!-- Set colors -->
        <stop
          :stop-color="
            this.colors && this.colors.length == 2 ? this.colors[0] : '#3b3b3b'
          "
          class="transition-all duration-700"
        />
        <stop
          offset="0.543463"
          :stop-color="
            this.colors && this.colors.length == 2 ? this.colors[1] : '#1f1f1f'
          "
          class="transition-all duration-700"
        />
        <stop
          offset="0.937639"
          :stop-color="
            this.colors && this.colors.length == 2 ? this.colors[1] : '#1f1f1f'
          "
          class="transition-all duration-700"
        />
      </radialGradient>
      <linearGradient
        id="paint1_linear_14_33"
        x1="258.5"
        y1="224.319"
        x2="261.676"
        y2="-0.00459834"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset="1" stop-opacity="0" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from '@/store'

export default defineComponent({
  setup: () => {
    const store = useStore()

    return {
      colors: computed(() => store.state.userInput.token.iconColors),
    }
  },
})
</script>

<style lang="stylus"></style>
