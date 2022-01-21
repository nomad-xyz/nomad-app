import { providers } from 'ethers'
import { NxtpSdk } from '@connext/nxtp-sdk'
import { Logger } from '@connext/nxtp-utils'

import { connextConfig, isProduction } from '@/config'
import {
  MainnetNetwork,
  TestnetNetwork,
  TokenMetadata,
} from '@/config/config.types'

export type SwapData = {
  origin: MainnetNetwork | TestnetNetwork
  destination: MainnetNetwork | TestnetNetwork
  destinationAddress: string
  token: TokenMetadata
  amount: number
}

export default async function instantiateConnextSDK(): Promise<NxtpSdk> {
  // Get signer from metamask
  const { ethereum } = window

  if (!ethereum) {
    throw new Error('Metamask not installed')
  }

  await ethereum.request({ method: 'eth_requestAccounts' })

  const provider = new providers.Web3Provider(ethereum)
  const _signer = provider.getSigner()

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
    signer: _signer,
    logger,
  })

  return sdk
}
