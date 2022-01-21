import * as Sentry from '@sentry/vue'
import { App } from 'vue'

/* eslint-disable-next-line  @typescript-eslint/explicit-module-boundary-types */
const initSentry = (app: App) => {
  Sentry.init({
    app,
    dsn: process.env.VUE_APP_SENTRY_DSN || '',

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0, // capture everything for now, we can dial back if too much noise
  })
}

export default initSentry
