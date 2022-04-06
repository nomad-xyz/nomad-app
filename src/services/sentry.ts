import * as Sentry from '@sentry/vue'
import { App } from 'vue'

const eventsToSilence = new Set(['Metamask not installed'])

/* eslint-disable-next-line  @typescript-eslint/explicit-module-boundary-types */
const initSentry = (app: App) => {
  Sentry.init({
    app,
    dsn: process.env.VUE_APP_SENTRY_DSN || '',

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0, // capture everything for now, we can dial back if too much noise
    beforeSend: (event) => {
      const eventValue = event?.exception?.values?.[0]?.value || ''

      // ignore these events (aka don't send to sentry)
      if (eventsToSilence.has(eventValue)) {
        console.log('ignoring error and not sending to sentry: ', eventValue)
        return null
      }

      return event
    },
  })
}

export default initSentry
