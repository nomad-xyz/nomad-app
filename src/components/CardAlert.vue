<template>
  <n-collapse-transition :show="show">
    <div class="flex flex-row rounded-xl bg-[#5185d0] p-4 mb-4 max-w-xl m-auto">
      <n-icon size="25" class="mr-2">
        <alert-circle-outline />
      </n-icon>
      <div>
        <div class="uppercase mb-1">{{ title }}</div>
        <div class="opacity-80 text-sm">
          <slot />
        </div>
      </div>
      <n-icon
        v-if="closeable"
        class="cursor-pointer"
        size="20"
        @click="$emit('close')"
      >
        <close-outline />
      </n-icon>
    </div>
  </n-collapse-transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NCollapseTransition, NIcon } from 'naive-ui'
import { CloseOutline, AlertCircleOutline } from '@vicons/ionicons5'
export default defineComponent({
  emits: ['close'],
  props: {
    title: String,
    show: {
      type: Boolean,
      default: true,
    },
    closeable: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    NCollapseTransition,
    CloseOutline,
    AlertCircleOutline,
    NIcon,
  },
})
</script>