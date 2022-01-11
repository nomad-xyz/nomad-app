<template>
  <slot />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  // TODO: consider emitting an error so that parent components
  // can determine for themselves how to handle this error instead

  // error boundary for any unhandled errors in child components
  // surface any error so we can track in sentry, just don't show everything to user
  errorCaptured(err) {
    console.error(err)
  },
})
</script>
