import { BigNumber, utils } from 'ethers'

import { networks, tokens, hubNetwork } from '@/config'
import { NetworkMetadata, TokenMetadata } from '@/config/config.types'
import { connextPools } from '@/config/index'

const coinGeckoIds = Object.values(tokens).map((t) => t.coinGeckoId)

// turn array of coin gecko ids into a union type of all strings in array
// ex: value ['foo', 'bar', 'baz'] -> a type 'foo'|'bar'|'baz'
export type CoinGeckoIds = typeof coinGeckoIds[number]

// UI DISPLAY

export type NaiveOption = {
  label: string
  value: string
  key: string
}

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
  const decimal = utils.formatUnits(amnt, tokenDecimals)
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
export function filterNetworks(
  options: NetworkMetadata[],
  originOrDestinationNetworkName: string
): NetworkMetadata[] {
  const networkIsHub = isEthereumNetwork(originOrDestinationNetworkName)

  return networkIsHub
    ? Object.values(options).filter(
        (option: NetworkMetadata) =>
          option.name !== originOrDestinationNetworkName
      )
    : // otherwise, other network is spoke so only show hub as an option
      [hubNetwork]
}

export function formatNetworksForSelection(
  activeNetworks: NetworkMetadata[],
  isSelectingDestination: boolean,
  originNetwork: string,
  destinationNetwork: string
): (NetworkMetadata & { isActive: boolean })[] {
  // helper mapping functions to set all networks to active or inactive
  const allNetworksAsActive = (n: NetworkMetadata) => ({ ...n, isActive: true })
  const allNetworksAsInactive = (n: NetworkMetadata) => ({
    ...n,
    isActive: false,
  })

  // if selecting a network, but the other hasn't been selected yet then show all networks as active
  if (
    (isSelectingDestination && !originNetwork) ||
    (!isSelectingDestination && !destinationNetwork)
  ) {
    return activeNetworks.map(allNetworksAsActive)
  }

  const filteredActiveNetworks = filterNetworks(
    activeNetworks,
    isSelectingDestination ? originNetwork : destinationNetwork
  ).map(allNetworksAsActive)

  // unique set of active network names
  const activeNetworkNames = new Set(
    filteredActiveNetworks.map((n: NetworkMetadata) => n.name)
  )

  // list of inactive networks (notice mapping all networks as inactive)
  const inactiveNetworks = activeNetworks
    .filter((n: NetworkMetadata) => !activeNetworkNames.has(n.name))
    .map(allNetworksAsInactive)

  // return all networks, active then inactive to show in the network modal
  return filteredActiveNetworks.concat(inactiveNetworks)
}

// NETWORK

/**
 * Loops over list of networks to create select options
 */
export function generateNetworkOptions(): NaiveOption[] {
  return Object.keys(networks).map((n) => {
    return {
      label: n,
      value: n,
      key: n,
    }
  })
}

/**
 * Retrieves network config given a chain ID
 */
export function getNetworkByChainID(
  chainID: number
): NetworkMetadata | undefined {
  for (const network in networks) {
    if (networks[network].chainID === chainID) {
      return networks[network]
    }
  }
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
  throw new Error(`network with domain ${domainID} not found`)
}

/**
 * Given a network name, return the domainID
 */
export function getNetworkDomainIDByName(networkName: string): number {
  const network = networks[networkName]
  return network.domainID
}

/**
 * Given a network name, return a boolean if that network is the hub network's name
 */
export function isEthereumNetwork(networkName: string): boolean {
  return networkName === hubNetwork.name
}

// TOKEN

export const nullToken: TokenMetadata = {
  nativeNetwork: 'ethereum',
  symbol: '',
  name: '',
  icon: '',
  decimals: 0,
  coinGeckoId: '',
  tokenIdentifier: null,
  nativeOnly: false,
  minAmt: 0,
}

export function getTokenBySymbol(symbol: string): TokenMetadata | undefined {
  for (const t in tokens) {
    const token = tokens[t]
    if (token.symbol === symbol) {
      return token
    }
  }
  console.error('token asset not found')
}

// determines if the token is native to the selected origin network
export function isNativeToken(network: string, token: TokenMetadata): boolean {
  const nativeToken = networks[network].nativeToken
  return nativeToken.symbol === token.symbol
}

// VALIDATION

/**
 * Verifies address is valid (in any supported format)
 */
export function isValidAddress(address: string): boolean {
  try {
    const isValid = utils.isAddress(address)
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
export function checkConnext(network: string, token: string): boolean {
  if (!network || !token) return false
  const availableTokens = connextPools[network]
  if (availableTokens.length) {
    const found = availableTokens.find((e) => e === token)
    return !!found
  }
  return false
}
