import { ethers, utils, providers } from 'ethers'
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

// The test tokens are collateralized by routers on the test network, so swap requests
// should always be successful when using these assets.
//
// Instructions:
// 1. Go to network
// 2. `await mintTestERC20(yourWalletAddress)`
export async function mintTestERC20(address: string, signer?: ethers.Signer) {
  let _signer
  if (signer) {
    _signer = signer
  } else {
    // Get signer from metamask
    const { ethereum } = window

    await ethereum.request({ method: 'eth_requestAccounts' })

    const provider = new providers.Web3Provider(ethereum)
    _signer = provider.getSigner()
  }

  let response

  try {
    // get TestERC20 contracts
    response = await fetch(
      'https://raw.githubusercontent.com/connext/nxtp/main/packages/contracts/deployments.json'
    )
  } catch (e) {
    throw new Error("Couldn't fetch ERC20 contracts")
  }

  let deployments
  try {
    deployments = await response.json()
  } catch (e) {
    throw new Error("Couldn't parse ERC20 contracts")
  }

  const { address: rAddress, abi: rAbi } =
    deployments['4'].rinkeby.contracts.TestERC20
  const { address: kAddress, abi: kAbi } =
    deployments['42'].kovan.contracts.TestERC20
  const rinkebyTestERC20 = new ethers.Contract(rAddress, rAbi, _signer)
  const kovanTestERC20 = new ethers.Contract(kAddress, kAbi, _signer)

  // get 10 test token
  const amt = utils.parseEther('100')
  await rinkebyTestERC20.mint(address, amt)
  await kovanTestERC20.mint(address, amt)
  console.log('complete')
}
