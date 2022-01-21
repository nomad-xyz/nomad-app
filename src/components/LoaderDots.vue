<template>
  <div class="container spin flex flex-col justify-center items-center">
    <div class="flex flex-row justify-center items-center">
      <div class="shape"></div>
      <div class="shape"></div>
    </div>
    <div class="flex flex-row justify-center items-center">
      <div class="shape"></div>
      <div class="shape"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style scoped lang="stylus">
@keyframes rotation {
  0% {
    transform rotate(0deg)
  } 100% {
    transform rotate(360deg)
  }
}

@keyframes gravity {
  50% {
    margin 3px
  } 100% {
    margin 1px
  }
}

.container
  width 20px
  height 20px

.shape
  margin 1px
  animation gravity 1s infinite
  width 5px
  height 5px
  background-color white
  border-radius 50%

.spin
  animation rotation 1s infinite
</style>
