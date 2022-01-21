<template>
  <div class="max-w-xl relative">
    <!-- disclaimer -->
    <card-alert title="Nomad is currently in beta">
      <div class="opacity-80 text-sm">
        Nomad is a new cross-chain protocol that is currently in a beta release
        phase. Please only bridge funds that you feel comfortable deploying in
        an experimental system. Read more about
        <a
          href="https://docs.nomad.xyz"
          target="_blank"
          class="font-bold hover:underline"
          >Nomad</a
        >.
      </div>
    </card-alert>

    <!-- transfer card -->
    <transfer />

    <!-- active connext transfers table -->
    <connext-active />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import CardAlert from '@/components/CardAlert.vue'
import Transfer from '@/views/Transfer/Transfer.main.vue'
import ConnextActive from '@/views/Transactions/Connext.main.vue'

export default defineComponent({
  components: {
    CardAlert,
    Transfer,
    ConnextActive,
  },
})
</script>
