import { BigNumber, utils } from 'ethers'

import { networks, tokens } from '@/config'
import { NetworkMetadata, TokenMetadata, NetworkName } from '@/config/types'
import { TokenIdentifier } from '@nomad-xyz/sdk-bridge'

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

export function toNetworkName(name: string): NetworkName {
  switch (name.toLowerCase()) {
    case 'moonbeam':
      return 'moonbeam'
    case 'milkomedac1':
      return 'milkomedaC1'
    case 'ethereum':
      return 'ethereum'
    case 'kovan':
      return 'kovan'
    case 'rinkeby':
      return 'rinkeby'
    case 'goerli':
      return 'goerli'
    case 'evmos':
      return 'evmos'
    // case 'moonbasealpha':
    //   return 'moonbasealpha'
    // case 'evmostestnet':
    //   return 'evmostestnet'
    default:
      return name
  }
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
  if (addr.length === 42) return addr
  if (addr.length === 66) {
    // trim 12 bytes from beginning plus '0x'
    const short = addr.slice(26)
    return `0x${short}`
  }
  throw new Error('invalid address length, cannot convert to 20 bytes')
}

export function toBytes32(addr: string): string {
  if (addr.length === 66) return addr
  if (addr.length === 42) {
    // trim 12 bytes from beginning plus '0x'
    const short = addr.slice(2)
    return `0x000000000000000000000000${short}`
  }
  throw new Error('invalid address length, cannot convert to 20 bytes')
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
  return toFixedDecimals(decimal, numDecimals || 18)
}

export function toFixedDecimals(number: string, numDecimals: number) {
  if (number === '0.0') {
    return '0'
  }

  const index = number.indexOf('.')
  if (index === -1) {
    return number
  }

  const end = index + (numDecimals || 18) + 1
  return number.slice(0, end)
}

/**
 * @param timestamp Given a confirmAt timestamp, calculate how many minutes until
 * @returns number
 */
export function minutesTilConfirmation(timestamp: BigNumber): number {
  const now = BigNumber.from(Date.now()).div(1000)
  const diff = timestamp.sub(now)
  if (diff.lt(0)) return 0
  // to minutes
  const minutes = diff.div(60)
  return Math.ceil(minutes.toNumber())
}

function fallbackCopyTextToClipboard(text: string): boolean {
  const textArea = document.createElement("textarea")
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = "0"
  textArea.style.left = "0"
  textArea.style.position = "fixed"

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    const msg = successful ? 'successful' : 'unsuccessful'
    console.log('Fallback: Copying text command was ' + msg)
    document.body.removeChild(textArea)
    return true
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
    document.body.removeChild(textArea)
    return false
  }
}

export function copyTextToClipboard(text: string): boolean {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
      console.log('Async: Copying to clipboard was successful!')
      return true
    }, function(err) {
      console.error('Async: Could not copy text: ', err)
      return fallbackCopyTextToClipboard(text)
    })
  }
  return fallbackCopyTextToClipboard(text)
}

export async function pasteFromClipboard(): Promise<string> {
  if (navigator.clipboard && navigator.clipboard.readText) {
    console.log('hi')
    return await navigator.clipboard.readText()
  }
  throw new Error('paste action not supported')
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

export function getTokenBySymbol(symbol: string): TokenMetadata {
  for (const t in tokens) {
    const token = tokens[t]
    if (token.symbol === symbol) {
      return token
    }
  }
  throw new Error('token asset not found')
}

export function getTokenByTokenID(
  tokenID: TokenIdentifier
): TokenMetadata | undefined {
  for (const t in tokens) {
    const token = tokens[t]
    if (
      token.tokenIdentifier &&
      token.tokenIdentifier.id.toString().toLowerCase() ==
        tokenID.id.toString().toLowerCase()
    ) {
      return token
    }
  }
  throw new Error('token asset not found')
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
