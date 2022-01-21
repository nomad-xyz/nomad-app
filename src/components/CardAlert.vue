<template>
  <n-collapse-transition :show="show">
    <div class="flex flex-row rounded-xl bg-[#5185d0] p-4 mb-4">
      <n-icon size="25" class="mr-2">
        <alert-circle-outline />
      </n-icon>
      <div>
        <div class="uppercase mb-1">{{ title }}</div>
        <slot />
      </div>
      <n-icon class="cursor-pointer" size="20" @click="dismissDisclaimer">
        <close-outline />
      </n-icon>
    </div>
  </n-collapse-transition>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { NCollapseTransition, NIcon } from 'naive-ui'
import { CloseOutline, AlertCircleOutline } from '@vicons/ionicons5'

import { useStore } from '@/store'

export default defineComponent({
  props: {
    title: String,
  },
  components: {
    NCollapseTransition,
    CloseOutline,
    AlertCircleOutline,
    NIcon,
  },
  setup() {
    const store = useStore()
    return {
      show: computed(() => !store.state.userInput.dismissDisclaimer),
      store,
    }
  },
  methods: {
    dismissDisclaimer() {
      this.store.dispatch('dismissDisclaimer')
    },
  },
})
</script>
