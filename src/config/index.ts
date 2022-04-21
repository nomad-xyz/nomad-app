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

const proofURLs: { [key: string]: string} = {
  production: 'https://nomadxyz-production-proofs.s3.us-west-2.amazonaws.com/',
  development: 'https://nomadxyz-development-proofs.s3.us-west-2.amazonaws.com/',
  staging: 'https://nomadxyz-staging-proofs.s3.us-west-2.amazonaws.com/',
}
export const s3URL = proofURLs[environment]

const APIURLs: { [key: string]: string} = {
  production: 'https://bridge-indexer.prod.madlads.tools/tx/',
  development: 'https://bridge-indexer.dev.madlads.tools/tx/',
  staging: 'https://bridge-indexer.staging.madlads.tools/tx/',
}
export const connextScanURL = isProduction
  ? 'https://connextscan.io/'
  : 'https://testnet.connextscan.io/'
export const nomadAPI = APIURLs[environment]
export const BUFFER_CONFIRMATION_TIME_IN_MINUTES = isProduction ? 25 : 5
export const PROCESS_TIME_IN_MINUTES = isProduction ? 10 : 2
