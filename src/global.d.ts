declare global {
  interface Window {
    analytics: any
  }
}

window.analytics = window.analytics || {}

// Needed for TS to classify this file as an external module.
// Without this, window.analytics will throw a type error.
export {}
