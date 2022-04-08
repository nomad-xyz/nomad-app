import { createApp } from 'vue'
import AppWrapper from './AppWrapper.vue'
import router from './router'
import initSentry from './services/sentry'
import { store, key } from './store'
import '@/store/modules/sdk'

await import('@nomad-xyz/sdk-bridge')

import './index.css'

const app = createApp(AppWrapper)

initSentry(app)

app.use(store, key).use(router).mount('#app')
