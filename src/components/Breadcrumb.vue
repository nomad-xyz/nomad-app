<template>
  <router-link
    :to="href"
    class="inline-flex items-center opacity-60 hover:underline p-1"
  >
    <n-icon size="15">
      <chevron-back />
    </n-icon>
    <n-text class="uppercase font-medium">{{ label }}</n-text>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NText, NIcon } from 'naive-ui'
import { ChevronBack } from '@vicons/ionicons5'
import { RouterLink } from 'vue-router'

export default defineComponent({
  components: {
    NText,
    NIcon,
    ChevronBack,
    RouterLink,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    href: {
      type: String,
      default: '/',
    },
  },
})
</script>
