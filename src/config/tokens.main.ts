import { TokenIdentifier } from '@nomad-xyz/sdk-bridge'

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

const FRAX: TokenIdentifier = {
  domain: 'ethereum',
  id: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
}

const FXS: TokenIdentifier = {
  domain: 'ethereum',
  id: '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
}

const WGLMR: TokenIdentifier = {
  domain: 'moonbeam',
  id: '0xAcc15dC74880C9944775448304B263D191c6077F',
}

const WADA: TokenIdentifier = {
  domain: 'milkomedaC1',
  id: '0xAE83571000aF4499798d1e3b0fA0070EB3A3E3F9',
}

const WSTR: TokenIdentifier = {
  domain: 'ethereum',
  id: '0xf0dc76c22139ab22618ddfb498be1283254612b1',
}

const CQT: TokenIdentifier = {
  domain: 'ethereum',
  id: '0xD417144312DbF50465b1C641d016962017Ef6240',
}

export default {
  WETH,
  WBTC,
  USDC,
  USDT,
  DAI,
  FRAX,
  FXS,
  WGLMR,
  WADA,
  WSTR,
  CQT,
}
