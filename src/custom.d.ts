declare module '*.svg' {
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  const content: any
  export default content
}

declare module '*.png' {
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  const content: any
  export default content
}

declare module '*.jpeg' {
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  const content: any
  export default content
}

declare interface Window {
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  ethereum: any
}

declare namespace process {
  let env: {
    // this is optional, if you want to allow also
    // other values than the ones listed below, they will have type
    // string | undefined, which is the default
    // [key: string]: string
    VUE_APP_ETHEREUM_RPC: string
    VUE_APP_MOONBEAM_RPC: string
    VUE_APP_MILKOMEDA_RPC: string
    VUE_APP_RINKEBY_RPC: string
    VUE_APP_KOVAN_RPC: string
    VUE_APP_GOERLI_RPC: string
    VUE_APP_EVMOS_TESTNET_RPC: string
    VUE_APP_MOONBASEALPHA_RPC: string
    VUE_APP_MILKOMEDA_TESTNET_RPC: string
    VUE_APP_XDAI_RPC: string
    VUE_APP_NOMAD_ENVIRONMENT: string
    VUE_APP_SENTRY_DSN: string
    BASE_URL: string
  }
}
