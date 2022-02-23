import { TokenIdentifier } from '@nomad-xyz/sdk/nomad'

// IMPORTANT make name same as tokens[token].symbol value

const WETH: TokenIdentifier = {
  domain: 'rinkeby',
  id: '0xc778417e063141139fce010982780140aa0cd5ab',
}

const kWETH: TokenIdentifier = {
  domain: 'kovan',
  id: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
}

const WBTC: TokenIdentifier = {
  domain: 'kovan',
  id: '0xe0f131fb595000d7e54049efe5c40dca9572469c',
}

const USDC: TokenIdentifier = {
  domain: 'rinkeby',
  id: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
}

const USDT: TokenIdentifier = {
  domain: 'kovan',
  id: '0x13512979ade267ab5100878e2e0f485b568328a4',
}

const DAI: TokenIdentifier = {
  domain: 'kovan',
  id: '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD',
}

const DEV: TokenIdentifier = {
  domain: 'moonbasealpha',
  id: '0x0000000000000000000000000000000000000802',
}

const TEST: TokenIdentifier = {
  domain: 'kovan',
  id: '0xe71678794fff8846bff855f716b0ce9d9a78e844',
}

const wADA: TokenIdentifier = {
  domain: 'milkomedatestnet',
  id: '0x65a51E52eCD17B641f8F0D1d56a6c9738951FDC9',
}

const wmilkADA: TokenIdentifier = {
  domain: 'milkomedatestnet',
  id: '0x6942F4eD908bF1F294e25497624ad228d178D54C',
}

const wtEVMOS: TokenIdentifier = {
  domain: 'evmostestnet',
  id: '0xEE8003bdB024a4195D433c555d55AA663B8C022C'
}

export default {
  WETH,
  kWETH,
  WBTC,
  USDC,
  USDT,
  DAI,
  DEV,
  TEST,
  wADA,
  wtEVMOS,
  wmilkADA,
}
