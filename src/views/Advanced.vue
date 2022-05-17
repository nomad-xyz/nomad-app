<template>
  <div>
    <n-alert
      title="This page is for advanced users who know what they're doing"
      type="warning"
    >
    </n-alert>
    <div class="py-6">
      <!-- Token select -->
      <n-text>Token</n-text>
      <n-popselect
        v-model:value="token"
        :options="tokenOptions"
        placement="bottom-start"
        trigger="click"
        width="trigger"
        class="capitalize"
      >
        <div
          class="border border-white border-opacity-50 rounded-md flex flex-row px-2 py-1 mb-4"
        >
          <input
            v-model="token"
            placeholder="Select token"
            readonly
            class="w-full border-0 outline-none bg-transparent capitalize"
          />
          <img src="@/assets/icons/select.svg" />
        </div>
      </n-popselect>

      <!-- Origin network select -->
      <n-text>Origin Network</n-text>
      <n-popselect
        v-model:value="originNetwork"
        :options="networkOptions"
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
            placeholder="Select Origin Network"
            readonly
            class="w-full border-0 outline-none bg-transparent capitalize"
          />
          <img src="@/assets/icons/select.svg" />
        </div>
      </n-popselect>

      <!-- Destination network select -->
      <n-text>Destination Network</n-text>
      <n-popselect
        v-model:value="destinationNetwork"
        :options="networkOptions"
        placement="bottom-start"
        trigger="click"
        width="trigger"
        class="capitalize"
      >
        <div
          class="border border-white border-opacity-50 rounded-md flex flex-row px-2 py-1 mb-4"
        >
          <input
            v-model="destinationNetwork"
            placeholder="Select Destination Network"
            readonly
            class="w-full border-0 outline-none bg-transparent capitalize"
          />
          <img src="@/assets/icons/select.svg" />
        </div>
      </n-popselect>

      <!-- Address -->
      <n-text>Address</n-text>
      <n-input ref="address" placeholder="0x123...789" v-model="address" />
    </div>
    <div>
      <nomad-button
        class="w-full uppercase bg-white text-black h-11 flex justify-center"
        @click="next"
      >
        <span>Copy encoded transaction</span>
      </nomad-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import NomadButton from '@/components/Button.vue'
import { NPopselect, NInput, NAlert, NText } from 'naive-ui'
import { generateNetworkOptions } from '@/utils'
import { tokens } from '@/config'

export default defineComponent({
  components: {
    NText,
    NAlert,
    NInput,
    NPopselect,
    NomadButton,
  },
  data() {
    return {
      token: '',
      originNetwork: '',
      destinationNetwork: '',
      address: '',
      enableFast: ref(false),
      networkOptions: generateNetworkOptions(),
      tokenOptions: Object.keys(tokens).map((t) => ({
        label: t,
        value: t,
        key: t,
      })),
    }
  },
  methods: {
    async next() {
      const { token, originNetwork, destinationNetwork, address } = this
      console.log('token', token)
      console.log('originNetwork', originNetwork)
      console.log('destinationNetwork', destinationNetwork)
      console.log('address', address)
      // TODO: add basic validation
      const valid = true
      if (valid) {
        console.log('TODO')
      }
    },
  },
})
</script>
