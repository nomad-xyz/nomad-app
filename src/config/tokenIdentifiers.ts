import { TokenIdentifierMap } from './types'

// --- TESTNET TOKEN IDENTIFIERS ---
// IMPORTANT make name same as tokens[token].symbol value
export const testnetTokenIdentifiers: TokenIdentifierMap = {
  rWETH: {
    domain: 'rinkeby',
    id: '0xc778417e063141139fce010982780140aa0cd5ab',
  },
  gWETH: {
    domain: 'goerli',
    id: '0x0B1ba0af832d7C05fD64161E0Db78E85978E8082',
  },
  WBTC: {
    domain: 'goerli',
    id: '0xaDcf53aD759054Dee4139d7aD206cC11788A466D',
  },
  USDC: {
    domain: 'goerli',
    id: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  },
  rUSDC: {
    domain: 'rinkeby',
    id: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
  },
  TEST: {
    domain: 'goerli',
    id: '0x8a1Cad3703E0beAe0e0237369B4fcD04228d1682',
  },
  WXDAI: {
    domain: 'xdai',
    id: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
  },
  wtEVMOS: {
    domain: 'evmostestnet',
    id: '0xEE8003bdB024a4195D433c555d55AA663B8C022C',
  },
  wtNEON: {
    domain: 'neontestnet',
    id: '0xf8ad328e98f85fccbf09e43b16dcbbda7e84beab',
  },
  //   DEV: {
  //     domain: 'moonbasealpha',
  //     id: '0x0000000000000000000000000000000000000802',
  //   },
  //   wADA: {
  //   domain: 'milkomedaC1testnet',
  //   id: '0x65a51E52eCD17B641f8F0D1d56a6c9738951FDC9',
  //   },
}

// --- MAINNET TOKEN IDENTIFIERS ---
// IMPORTANT make name same as tokens[token].symbol value
export const mainnetTokenIdentifiers: TokenIdentifierMap = {
  WETH: {
    domain: 'ethereum',
    id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  wEVMOS: {
    domain: 'evmos',
    id: '0xD4949664cD82660AaE99bEdc034a0deA8A0bd517',
  },
  WADA: {
    domain: 'milkomedaC1',
    id: '0xAE83571000aF4499798d1e3b0fA0070EB3A3E3F9',
  },
  WGLMR: {
    domain: 'moonbeam',
    id: '0xAcc15dC74880C9944775448304B263D191c6077F',
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
  SDL: {
    domain: 'ethereum',
    id: '0xf1Dc500FdE233A4055e25e5BbF516372BC4F6871',
  },
  MIM: {
    domain: 'ethereum',
    id: '0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3',
  },

  // others
  WSTR: {
    domain: 'ethereum',
    id: '0xf0dc76c22139ab22618ddfb498be1283254612b1',
  },
  CQT: {
    domain: 'ethereum',
    id: '0xD417144312DbF50465b1C641d016962017Ef6240',
  },
  renBTC: {
    domain: 'ethereum',
    id: '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
  },
  sBTC: {
    domain: 'ethereum',
    id: '0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6',
  },
  tBTC: {
    domain: 'ethereum',
    id: '0x18084fbA666a33d37592fA2633fD49a74DD93a88',
  },
  HBTC: {
    domain: 'ethereum',
    id: '0x0316EB71485b0Ab14103307bf65a021042c6d380',
  },
  CRO: {
    domain: 'ethereum',
    id: '0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b',
  },
  UNI: {
    domain: 'ethereum',
    id: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  },
  SHIB: {
    domain: 'ethereum',
    id: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
  },
  LINK: {
    domain: 'ethereum',
    id: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  },
  APE: {
    domain: 'ethereum',
    id: '0x40e0a6ef9dbadfc83c5e0d15262feb4638588d77',
  },
  MKR: {
    domain: 'ethereum',
    id: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
  },
  COMP: {
    domain: 'ethereum',
    id: '0xc00e94cb662c3520282e6f5717214004a7f26888',
  },
  AAVE: {
    domain: 'ethereum',
    id: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
  },
  TIC: {
    domain: 'avalanche',
    id: '0x75739a693459f33b1fbcc02099eea3ebcf150cbe',
  },
  HBOT: {
    domain: 'ethereum',
    id: '0xE5097D9baeAFB89f9bcB78C9290d545dB5f9e9CB',
  },
  wAVAX: {
    domain: 'avalanche',
    id: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
  },
  PBX: {
    domain: 'ethereum',
    id: '0xd528cf2e081f72908e086f8800977df826b5a483',
  },
  GEL: {
    domain: 'ethereum',
    id: '0x15b7c0c907e4c6b9adaaaabc300c08991d6cea05',
  },
}
