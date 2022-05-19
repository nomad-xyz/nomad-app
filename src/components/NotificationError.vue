<template>
  <div class="flex flex-col">
    <span>{{ text }}</span>
    <div class="flex items-center py-2 cursor-pointer opacity-70" @click="expand = !expand">
      <n-icon size="16">
        <ChevronDown
          class="transition-all"
          :class="{ 'rotate-180': expand }"
        />
      </n-icon>
    </div>
    <n-collapse-transition :show="expand">
      {{ error.message }}
    </n-collapse-transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NCollapseTransition, NIcon } from 'naive-ui'
import { ChevronDown } from '@vicons/ionicons5'

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
    error: {
      type: Error,
      required: true,
    },
  },
  components: {
    NCollapseTransition,
    NIcon,
    ChevronDown,
  },
  data: () => ({
    expand: false
  })
})
</script>
