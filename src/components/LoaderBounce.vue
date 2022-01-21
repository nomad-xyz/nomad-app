<template>
  <div class="dots-container">
    <div
      class="shape shape1"
      :style="`background-color: ${color || 'white'}`"
    ></div>
    <div
      class="shape shape2"
      :style="`background-color: ${color || 'white'}`"
    ></div>
    <div
      class="shape shape3"
      :style="`background-color: ${color || 'white'}`"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    color: String,
  },
})
</script>

<style scoped lang="stylus">
@keyframes bounce {
  40% {
    transform translateY(-2px)
  } 70% {
    transform translateY(0)
  }
}

.dots-container
  display flex
  flex-direction row
  align-items flex-end
  justify-content center
  padding-bottom 3px

.shape
  animation gravity 1s infinite
  width 5px
  height 5px
  background-color white
  border-radius 50%
  margin 0 3px

.shape1
  animation bounce 1s infinite
.shape2
  animation bounce 1s infinite 0.2s
.shape3
  animation bounce 1s infinite 0.4s
</style>
