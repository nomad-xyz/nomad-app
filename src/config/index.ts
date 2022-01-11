import * as dev from './config.dev'
import * as main from './config.main'
import { TokenMetadata, NetworkMetadata } from './config.types'
import { SdkBaseChainConfigParams } from '@connext/nxtp-sdk'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const environment = process.env.VUE_APP_NOMAD_ENVIRONMENT
const currentEnv = chooseConfig(environment)

export const tokens = currentEnv.tokens
export const networks = currentEnv.networks
export const connextConfig = currentEnv.connextConfig
export const connextPools = currentEnv.connextPools
export const s3URL = environment === 'development'
  ? 'https://nomadxyz-development-proofs.s3.us-west-2.amazonaws.com/'
  : 'https://nomadxyz-production-proofs.s3.us-west-2.amazonaws.com/'
export const connextScanURL = environment === 'development'
  ? 'https://testnet.connextscan.io/'
  : 'https://connextscan.io/'

function chooseConfig(environment: string | undefined): {
  tokens: { [key: string]: TokenMetadata }
  networks: { [key: string]: NetworkMetadata }
  connextConfig: SdkBaseChainConfigParams
  connextPools: { [key: string]: string[] }
} {
  console.log('Env: ', environment)
  switch (environment) {
    case 'development':
      return dev

    case 'production':
      return main

    default:
      return dev
  }
}
