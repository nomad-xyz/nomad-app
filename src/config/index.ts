import { testnetTokens, mainnetTokens } from './tokens'
import {
  getNetworksConfig,
  getConnextConfig,
} from '@/utils/config'

const {
  VUE_APP_NOMAD_ENVIRONMENT,
  VUE_APP_ETHEREUM_RPC,
  VUE_APP_PROOFS_S3,
  VUE_APP_NOMAD_API,
  VUE_APP_CONNEXTSCAN_URL,
  VUE_APP_TERMS_AGREEMENTS,
} = process.env

const environment = VUE_APP_NOMAD_ENVIRONMENT

export const isProduction = environment === 'production'
export const tokens = isProduction ? mainnetTokens : testnetTokens
export const networks = getNetworksConfig(tokens)
export const connextConfig = getConnextConfig([VUE_APP_ETHEREUM_RPC])
export const proofsS3 = VUE_APP_PROOFS_S3
export const connextScanURL = VUE_APP_CONNEXTSCAN_URL
export const nomadAPI = VUE_APP_NOMAD_API
export const termsAPI = VUE_APP_TERMS_AGREEMENTS
export const BUFFER_CONFIRMATION_TIME_IN_MINUTES = isProduction ? 25 : 5
export const PROCESS_TIME_IN_MINUTES = isProduction ? 10 : 2
