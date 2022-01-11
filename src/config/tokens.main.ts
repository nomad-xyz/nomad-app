import { TokenIdentifier } from '@nomad-xyz/sdk/nomad'

// IMPORTANT make name same as tokens[token].symbol value
const WETH: TokenIdentifier = {
  domain: 'ethereum',
  id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
}

const WBTC: TokenIdentifier = {
  domain: 'ethereum',
  id: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
}

const USDC: TokenIdentifier = {
  domain: 'ethereum',
  id: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
}

const USDT: TokenIdentifier = {
  domain: 'ethereum',
  id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
}

const DAI: TokenIdentifier = {
  domain: 'ethereum',
  id: '0x6b175474e89094c44da98b954eedeac495271d0f',
}

const WGLMR: TokenIdentifier = {
  domain: 'moonbeam',
  id: '0xAcc15dC74880C9944775448304B263D191c6077F'
}

export default {
  WETH,
  WBTC,
  USDC,
  USDT,
  DAI,
  WGLMR,
}
