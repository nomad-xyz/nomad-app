import { testnetTokens, mainnetTokens } from './tokens'
import {
  getNetworksFromConfig,
  getConnextConfigFromConfig,
} from '@/utils/config'

const environment = process.env.VUE_APP_NOMAD_ENVIRONMENT!

const configuration = await import('@nomad-xyz/configuration')
const config = configuration.getBuiltin(environment)

export const isProduction = environment === 'production'
export const tokens = isProduction ? mainnetTokens : testnetTokens
export const networks = getNetworksFromConfig(config, tokens)
export const connextConfig = getConnextConfigFromConfig(config, [
  process.env.VUE_APP_ETHEREUM_RPC!,
])

export const s3URL = isProduction
  ? 'https://nomadxyz-production-proofs.s3.us-west-2.amazonaws.com/'
  : 'https://nomadxyz-development-proofs.s3.us-west-2.amazonaws.com/'
export const connextScanURL = isProduction
  ? 'https://connextscan.io/'
  : 'https://testnet.connextscan.io/'
export const nomadAPI = isProduction
  ? 'https://bridge-indexer.prod.madlads.tools/tx/'
  : 'https://bridge-indexer.dev.madlads.tools/tx/'
export const BUFFER_CONFIRMATION_TIME_IN_MINUTES = isProduction ? 25 : 5
export const PROCESS_TIME_IN_MINUTES = isProduction ? 10 : 2
