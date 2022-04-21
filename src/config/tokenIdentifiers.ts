import { TokenIdentifierMap } from './types'

// --- TESTNET TOKEN IDENTIFIERS ---
// IMPORTANT make name same as tokens[token].symbol value
export const testnetTokenIdentifiers: TokenIdentifierMap = {
  WETH: {
    domain: 'rinkeby',
    id: '0xc778417e063141139fce010982780140aa0cd5ab',
  },
  kWETH: {
    domain: 'kovan',
    id: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
  },
  gWETH: {
    domain: 'goerli',
    id: '0x0B1ba0af832d7C05fD64161E0Db78E85978E8082',
  },
  WBTC: {
    domain: 'kovan',
    id: '0xe0f131fb595000d7e54049efe5c40dca9572469c',
  },
  USDC: {
    domain: 'rinkeby',
    id: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
  },
  USDT: {
    domain: 'kovan',
    id: '0x13512979ade267ab5100878e2e0f485b568328a4',
  },
  DAI: {
    domain: 'kovan',
    id: '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD',
  },
  TEST: {
    domain: 'kovan',
    id: '0xe71678794fff8846bff855f716b0ce9d9a78e844',
  },
  WXDAI: {
    domain: 'xdai',
    id: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
  },
  //   DEV: {
  //     domain: 'moonbasealpha',
  //     id: '0x0000000000000000000000000000000000000802',
  //   },
  //   wADA: {
  //   domain: 'milkomedaC1testnet',
  //   id: '0x65a51E52eCD17B641f8F0D1d56a6c9738951FDC9',
  //   },
  //   wtEVMOS: {
  //     domain: 'evmostestnet',
  //     id: '0xEE8003bdB024a4195D433c555d55AA663B8C022C',
  //   },
}

// --- MAINNET TOKEN IDENTIFIERS ---
// IMPORTANT make name same as tokens[token].symbol value
export const mainnetTokenIdentifiers: TokenIdentifierMap = {
  WETH: {
    domain: 'ethereum',
    id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  WBTC: {
    domain: 'ethereum',
    id: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  },
  USDC: {
    domain: 'ethereum',
    id: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
  USDT: {
    domain: 'ethereum',
    id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  DAI: {
    domain: 'ethereum',
    id: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
  FRAX: {
    domain: 'ethereum',
    id: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
  },
  FXS: {
    domain: 'ethereum',
    id: '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
  },
  WGLMR: {
    domain: 'moonbeam',
    id: '0xAcc15dC74880C9944775448304B263D191c6077F',
  },
  WADA: {
    domain: 'milkomedaC1',
    id: '0xAE83571000aF4499798d1e3b0fA0070EB3A3E3F9',
  },
  WSTR: {
    domain: 'ethereum',
    id: '0xf0dc76c22139ab22618ddfb498be1283254612b1',
  },
  CQT: {
    domain: 'ethereum',
    id: '0xD417144312DbF50465b1C641d016962017Ef6240',
  },
}
