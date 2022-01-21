<template>
  <!-- search transaction -->
  <n-card
    style="width: 400px; backgroundcolor: #2f2f2f"
    title="Search Transaction"
    :bordered="false"
    size="huge"
    role="dialog"
    aria-modal="true"
  >
    <n-tabs
      v-model:value="name"
      type="card"
      tab-style="min-width: 80px;"
      justify-content="space-evenly"
    >
      <n-tab-pane :name="panels[0]">
        <!-- Tx Hash -->
        <div
          class="border border-white border-opacity-50 rounded-md flex flex-row px-2 py-1 mb-4"
        >
          <input
            v-model="txHash"
            placeholder="Transaction Hash"
            class="w-full border-0 outline-none bg-transparent"
          />
        </div>
        <nomad-button
          primary
          @click="goConnext"
          class="w-full flex justify-center"
          >GO TO TRANSACTION DETAILS</nomad-button
        >
      </n-tab-pane>
      <n-tab-pane :name="panels[1]">
        <!-- Origin network select -->
        <n-popselect
          v-model:value="originNetwork"
          :options="options"
          placement="bottom-start"
          trigger="click"
          width="trigger"
          class="capitalize"
        >
          <div
            class="border border-white border-opacity-50 rounded-md flex flex-row px-2 py-1 mb-4"
          >
            <input
              v-model="originNetwork"
              placeholder="Origin Network"
              readonly
              class="w-full border-0 outline-none bg-transparent capitalize"
            />
            <img src="@/assets/icons/select.svg" />
          </div>
        </n-popselect>
        <!-- Tx Hash -->
        <div
          class="border border-white border-opacity-50 rounded-md flex flex-row px-2 py-1 mb-4"
        >
          <input
            v-model="txHash"
            placeholder="Transaction Hash"
            class="w-full border-0 outline-none bg-transparent"
          />
        </div>
        <nomad-butto
          primary
          @click="goNomad"
          class="w-full flex justify-center"
        >
          GO TO TRANSACTION DETAILS
        </nomad-butto>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NCard, NPopselect, NTabs, NTabPane, useNotification } from 'naive-ui'
import NomadButton from '@/components/Button.vue'
import { connextScanURL } from '@/config'
import { generateNetworkOptions } from '@/utils'

export default defineComponent({
  components: {
    NCard,
    NPopselect,
    NTabs,
    NTabPane,
    NomadButton,
  },
  data() {
    return {
      panels: ['Connext', 'Nomad'],
      originNetwork: '',
      txHash: '',
      options: generateNetworkOptions(),
    }
  },
  setup() {
    const notification = useNotification()
    return {
      notification,
    }
  },
  methods: {
    goConnext() {
      if (this.txHash.length === 66) {
        // this.$router.push(`/tx/connext/${this.txHash}`)
        window.open(`${connextScanURL}tx/${this.txHash}`, '_blank')
      } else {
        this.notification.warning({
          title: 'Invalid Input',
          duration: 3000,
        })
      }
    },
    goNomad() {
      if (this.originNetwork && this.txHash.length === 66) {
        this.$router.push(`/tx/nomad/${this.originNetwork}/${this.txHash}`)
      } else {
        this.notification.warning({
          title: 'Invalid Input',
          duration: 3000,
        })
      }
    },
  },
})
</script>
