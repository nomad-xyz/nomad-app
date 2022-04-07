<template>
  <div class="w-full max-w-xl relative">
    <!-- transfer card -->
    <transfer />

    <!-- active connext transfers table -->
    <connext-active />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Transfer from '@/views/Transfer/Transfer.main.vue'
import ConnextActive from '@/views/Transactions/Connext.main.vue'

export default defineComponent({
  components: {
    Transfer,
    ConnextActive,
  },
})
</script>
