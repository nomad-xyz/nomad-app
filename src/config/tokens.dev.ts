import { TokenIdentifier } from '@nomad-xyz/sdk/nomad'

// IMPORTANT make name same as tokens[token].symbol value

const WETH: TokenIdentifier = {
  domain: 'kovan',
  id: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
}

const WBTC: TokenIdentifier = {
  domain: 'kovan',
  id: '0xe0f131fb595000d7e54049efe5c40dca9572469c',
}

const USDC: TokenIdentifier = {
  domain: 'kovan',
  id: '0xb7a4f3e9097c08da09517b5ab877f7a917224ede',
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

export default {
  WETH,
  WBTC,
  USDC,
  USDT,
  DAI,
  DEV,
  TEST,
}
