import { BigNumber, ethers } from 'ethers'

import { networks, tokens } from '@/config'
import { NetworkMetadata, TokenMetadata } from '@/config/config.types'
import { connextPools } from '@/config/index'

const coinGeckoIds = Object.values(tokens).map((t) => t.coinGeckoId)

// turn array of coin gecko ids into a union type of all strings in array
// ex: value ['foo', 'bar', 'baz'] -> a type 'foo'|'bar'|'baz'
export type CoinGeckoIds = typeof coinGeckoIds[number]

// UI DISPLAY

/**
 * Shortens address for UI display
 * 0x0000...0000
 */
export function truncateAddr(addr: string): string {
  if (!addr) return ''
  const first = addr.slice(0, 6)
  const len = addr.length
  const last = addr.slice(len - 4, len)
  return `${first}...${last}`
}

export function fromBytes32(addr: string): string {
  // trim 12 bytes from beginning plus '0x'
  const short = addr.slice(26)
  return `0x${short}`
}

/**
 * Makes a BigNumber have # of decimals
 */
export function toDecimals(
  amnt: BigNumber,
  tokenDecimals: number,
  numDecimals?: number
): string {
  const decimal = ethers.utils.formatUnits(amnt, tokenDecimals)
  if (decimal === '0.0') {
    return '0'
  }

  const index = decimal.indexOf('.')
  if (index === -1) {
    return decimal
  }

  const end = index + (numDecimals || 18) + 1
  return decimal.slice(0, end)
}

// loops over list of networks to create select options (excluding fromNetwork)
export function filterDestinationNetworks(
  options: { [key: string]: NetworkMetadata },
  originNetworkName: string
): NetworkMetadata[] {
  const optionValues = Object.values(options)

  return optionValues.length === 2
    ? optionValues
    : Object.values(options).filter(
      (option: NetworkMetadata) => option.name !== originNetworkName
    )
}

// to be used when there are only 2 networks and you want
// to get the *other* network name given the input network name
export function getOnlyOtherNetwork(network: string): string {
  const networkValues = Object.values(networks)

  if (networkValues.length !== 2) {
    // don't throw an error since the user can easily fix
    console.error('Should only be used when there are *exactly* 2 networks')
  }

  return networkValues.find(n => n.name !== network)!.name
}

// NETWORK

/**
 * Loops over list of networks to create select options
 */
export function generateNetworkOptions () {
  return Object.keys(networks).map(n => {
    return {
      label: n,
      value: n,
      key: n
    }
  })
}

/**
 * Retrieves network config given a chain ID
 */
export function getNetworkByChainID(chainID: number): NetworkMetadata | undefined {
  for (const network in networks) {
    if (networks[network].chainID === chainID) {
      return networks[network]
    }
  }
  // unsupported network
  console.error(`network not found: ${chainID}`)
}

/**
 * Retrieves network config given a domain ID
 */
export function getNetworkByDomainID(domainID: number): NetworkMetadata {
  for (const network in networks) {
    if (networks[network].domainID === domainID) {
      return networks[network]
    }
  }
  throw new Error(`network not found: ${domainID}`)
}

/**
 * Given a network name, return the domainID
 */
export function getNetworkDomainIDByName(networkName: string) {
  const network = networks[networkName]
  return network.domainID
}

// TOKEN

export const nullToken: TokenMetadata = {
  nativeNetwork: 'ethereum',
  symbol: '',
  name: '',
  icon: '',
  decimals: 0,
  coinGeckoId: '',
  tokenIdentifier: {
    domain: '',
    id: '',
  },
  nativeOnly: false,
  minAmt: 0,
}

export function getTokenByName(name: string): TokenMetadata | undefined {
  for (const t in tokens) {
    const token = tokens[t]
    if (token.name === name) {
      return token
    }
  }
  console.error('token asset not found')
}

// determines if the token is native to the selected origin network
export function isNativeToken(network: string, token: TokenMetadata): boolean {
  const nativeToken = networks[network].nativeToken
  return nativeToken.name === token.name
}

// VALIDATION

/**
 * Verifies address is valid (in any supported format)
 */
export function isValidAddress(address: string): boolean {
  try {
    const isValid = ethers.utils.isAddress(address)
    return isValid
  } catch (e) {
    return false
  }
}

export async function getMinAmount(coinId: string): Promise<number> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
  )
  type CoinGeckoData = Record<CoinGeckoIds, Record<'usd', number>>
  const data = (await res.json()) as CoinGeckoData
  if (data[coinId]) {
    const { usd } = data[coinId]
    return usd
  }
  return 0
}

export function getNetworkIcon(network: string): string {
  if (!network) return ''

  if (network in networks) {
    return networks[network].icon || ''
  }

  return ''
}

// connext
export function checkConnext(network: string, token: string) {
  if (!network) return
  // TODO: create dev/mainnet configs for these
  const availableTokens = connextPools[network]
  if (availableTokens.length) {
    const found = availableTokens.find((e) => e === token)
    return !!found
  }
  return false
}
