import { isProduction } from '@/config'

const runOnlyInProd = (fn: () => void) => {
  if (isProduction) {
    fn()
  }
}

const page = (page: string) => {
  console.log(`analytics.page('${page}')`)
  runOnlyInProd(() => window.analytics.page(page))
}

const track = (event: string, payload: Record<string, string> = {}) => {
  console.log(`analytics.track('${event}', '${payload.toString()}')`)
  runOnlyInProd(() => window.analytics.track(event, payload))
}

export default {
  page,
  track,
}
