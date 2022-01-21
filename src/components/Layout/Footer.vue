<template>
  <footer
    class="flex items-center justify-between flex-wrap max-w-screen-xl mx-auto p-6 pb-18"
  >
    <div class="pb-5 md:pb-0">
      <div class="flex items-center opacity-70 mb-2">
        <a
          v-for="s in socials"
          :key="s.href"
          :href="s.href"
          target="_blank"
          class="mr-4"
        >
          <n-icon size="18" color="rgba(255, 255, 255imti/footer-links, 0.6)">
            <component :is="s.icon"></component>
          </n-icon>
        </a>
      </div>

      <!-- Nomad + Connext -->
      <div class="flex flex-row items-center">
        <n-text class="opacity-70 ml mr-1 text-xs">Powered by</n-text>
        <img src="@/assets/wordmark.svg" class="logo" />
        <n-text class="px-1">+</n-text>
        <img src="@/assets/connext-logo.png" class="logo" />
      </div>
    </div>
    <div class="flex justify-between w-full sm:w-1/3">
      <ul>
        <li
          v-for="p in products"
          :key="p.href"
          class="pb-2 last:pb-0 opacity-60"
        >
          <a :href="p.href" class="hover:underline" target="_blank">
            {{ p.label }}
          </a>
        </li>
      </ul>
      <ul>
        <li v-for="l in legals" :key="l.href" class="pb-2 last:pb-0 opacity-60">
          <router-link :to="l.href" class="hover:underline" target="_blank">
            {{ l.label }}
          </router-link>
        </li>
        <li>
          <n-text class="opacity-40 text-xs">
            © {{ currentYear }} Nomad
          </n-text>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, shallowRef } from 'vue'
import { NText, NIcon } from 'naive-ui'
import { LogoTwitter, LogoMedium, LogoDiscord } from '@vicons/ionicons5'

export default defineComponent({
  components: {
    NText,
    NIcon,
  },
  // NOTE: if we use the links + labels elsewhere,
  // consider pulling it out to a separate file
  data: () => ({
    currentYear: new Date().getFullYear(),
    socials: [
      {
        icon: shallowRef(LogoTwitter),
        href: 'https://www.twitter.com/nomadxyz_',
        alt: 'twitter',
      },
      {
        icon: shallowRef(LogoDiscord),
        href: 'https://discord.gg/RurtmJApqm',
        alt: 'discord',
      },
      {
        icon: shallowRef(LogoMedium),
        href: 'https://blog.nomad.xyz/',
        alt: 'medium',
      },
    ],
    products: [
      {
        href: 'https://docs.nomad.xyz',
        label: 'Docs',
      },
      {
        href: 'https://github.com/nomad-xyz/nomad-monorepo',
        label: 'GitHub',
      },
    ],
    legals: [
      {
        href: '/terms',
        label: 'Terms & Conditions',
      },
      {
        href: '/privacy-policy',
        label: 'Privacy Policy',
      },
    ],
  }),
})
</script>

<style lang="stylus">
.logo
  height 20px
</style>
