import { providers } from 'ethers'
import { NxtpSdk } from '@connext/nxtp-sdk'
import { Logger } from '@connext/nxtp-utils'

import { connextConfig, isProduction } from '@/config'
import { NetworkName, TokenMetadata } from '@/config/types'

export type SwapData = {
  origin: NetworkName
  destination: NetworkName
  destinationAddress: string
  token: TokenMetadata
  amount: number
}

export default async function instantiateConnextSDK(signer: any): Promise<NxtpSdk> {
  // Get signer from metamask
  if (!signer) throw new Error('Cannot instantiate Connext, no signer')

  // Level can be one of:
  // 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent'
  // silenced in production
  const logger = new Logger({
    name: 'shuturface',
    level: isProduction ? 'silent' : 'warn',
  })

  // Instantiate SDK
  const sdk = await NxtpSdk.create({
    chainConfig: connextConfig,
    signer,
    logger,
  })

  return sdk
}
