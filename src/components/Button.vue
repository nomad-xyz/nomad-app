<template>
  <button
    @click="onClick"
    :class="styles"
    :disabled="disabled"
    class="outline-none"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

const buttonProps = {
  onClick: Function,
  primary: Boolean,
  secondary: Boolean,
  tertiary: Boolean,
  disabled: Boolean,
}

const cssClasses = {
  base: `
    flex
    items-center
    text-sm
    rounded-lg
    px-4
    py-2
    tracking-wide
  `,
  primary: `
    bg-white
    text-black
  `,
  secondary: ``, // TODO
  disabled: `bg-opacity-70 cursor-not-allowed`,
}

export default defineComponent({
  name: 'nomad-button',
  props: buttonProps,
  setup(props) {
    return {
      styles: computed(() => {
        let styles = cssClasses.base

        if (props.primary) {
          styles += cssClasses.primary
        } else if (props.secondary) {
          styles += cssClasses.secondary
        }

        if (props.disabled) {
          styles += cssClasses.disabled
        }

        return styles
      }),
    }
  },
})
</script>
