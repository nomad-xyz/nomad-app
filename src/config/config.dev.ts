import wETHIcon from '@/assets/token-logos/WETH.png'
import USDTIcon from '@/assets/token-logos/USDT.png'
import USDCIcon from '@/assets/token-logos/USDC.png'
import DAIIcon from '@/assets/token-logos/DAI.png'
import DEVIcon from '@/assets/token-logos/DEV.png'
import wADAIcon from '@/assets/token-logos/wADA.png'
import ConnextIcon from '@/assets/icons/connext.svg'

import { SdkBaseChainConfigParams } from '@connext/nxtp-sdk'

import testnetTokens from './tokens.dev'
import { TokenMetadata, NetworkMetadata } from './config.types'

export const tokens: { [key: string]: TokenMetadata } = {
  WETH: {
    nativeNetwork: 'rinkeby',
    symbol: 'WETH',
    name: 'Rinkeby WETH',
    icon: wETHIcon,
    iconColors: ['#C0CEF7', '#7594EE'],
    decimals: 18,
    coinGeckoId: 'weth',
    tokenIdentifier: testnetTokens.WETH,
    nativeOnly: false,
    minAmt: 0.0028,
  },
  ETH: {
    nativeNetwork: 'rinkeby',
    symbol: 'ETH',
    name: 'Rinkeby ETH',
    icon: wETHIcon,
    iconColors: ['#C0CEF7', '#7594EE'],
    decimals: 18,
    coinGeckoId: 'ethereum',
    tokenIdentifier: testnetTokens.WETH,
    nativeOnly: true,
    minAmt: 0.0028,
  },
  kWETH: {
    nativeNetwork: 'kovan',
    symbol: 'kWETH',
    name: 'Kovan WETH',
    icon: wETHIcon,
    iconColors: ['#C0CEF7', '#7594EE'],
    decimals: 18,
    coinGeckoId: 'weth',
    tokenIdentifier: testnetTokens.kWETH,
    nativeOnly: false,
    minAmt: 0.0028,
  },
  kETH: {
    nativeNetwork: 'kovan',
    symbol: 'kETH',
    name: 'Kovan ETH',
    icon: wETHIcon,
    iconColors: ['#C0CEF7', '#7594EE'],
    decimals: 18,
    coinGeckoId: 'ethereum',
    tokenIdentifier: testnetTokens.kWETH,
    nativeOnly: true,
    minAmt: 0.0028,
  },
  USDT: {
    nativeNetwork: 'kovan',
    symbol: 'USDT',
    name: 'USDT',
    icon: USDTIcon,
    iconColors: ['#fff', '#26A17B'],
    decimals: 6,
    coinGeckoId: 'tether',
    tokenIdentifier: testnetTokens.USDT,
    nativeOnly: false,
    minAmt: 10,
  },
  USDC: {
    nativeNetwork: 'kovan',
    symbol: 'USDC',
    name: 'USDC',
    icon: USDCIcon,
    iconColors: ['#fff', '#2976C9'],
    decimals: 6,
    coinGeckoId: 'usd-coin',
    tokenIdentifier: testnetTokens.USDC,
    nativeOnly: false,
    minAmt: 10,
  },
  DAI: {
    nativeNetwork: 'kovan',
    symbol: 'DAI',
    name: 'DAI',
    icon: DAIIcon,
    iconColors: ['#f0bf54', '#F4B731'],
    decimals: 18,
    coinGeckoId: 'dai',
    tokenIdentifier: testnetTokens.DAI,
    nativeOnly: false,
    minAmt: 10,
  },
  DEV: {
    nativeNetwork: 'moonbasealpha',
    symbol: 'DEV',
    name: 'Moonbase DEV',
    icon: DEVIcon,
    iconColors: ['#53CBC8', '#e84195'],
    decimals: 18,
    coinGeckoId: 'dai', // TODO:
    tokenIdentifier: testnetTokens.DEV,
    nativeOnly: true,
    minAmt: 10,
  },
  // Only for use with connext in dev environment
  kTEST: {
    nativeNetwork: 'kovan',
    symbol: 'kTEST',
    name: 'Kovan TEST',
    icon: ConnextIcon,
    iconColors: ['#62BBEF', '#8470E2'],
    decimals: 18,
    coinGeckoId: 'dai',
    tokenIdentifier: testnetTokens.TEST,
    nativeOnly: false,
    minAmt: 10,
  },
  mADA: {
    nativeNetwork: 'milkomedatestnet',
    symbol: 'mADA',
    name: 'wADA',
    icon: wADAIcon,
    iconColors: ['#6684CD', '#0033AC'],
    decimals: 18,
    coinGeckoId: 'cardano',
    tokenIdentifier: testnetTokens.wADA,
    nativeOnly: true,
    minAmt: 10,
  },
  wADA: {
    nativeNetwork: 'milkomedatestnet',
    symbol: 'wADA',
    name: 'wADA',
    icon: wADAIcon,
    iconColors: ['#6684CD', '#0033AC'],
    decimals: 18,
    coinGeckoId: 'cardano',
    tokenIdentifier: testnetTokens.wADA,
    nativeOnly: false,
    minAmt: 10,
  }
}

// default confirmation time for dev, set on each network below
const DEV_DEFAULT_CONFIRMATION_TIME_IN_MINUTES = 2

export const networks: { [key: string]: NetworkMetadata } = {
  rinkeby: {
    name: 'rinkeby',
    chainID: 4,
    domainID: 2000,
    nativeToken: tokens.ETH,
    rpcUrl:
      'https://eth-rinkeby.alchemyapi.io/v2/-uKtZgu7bWLDEuW3EaOZ0f6eKpqiH-Tj',
    blockExplorer: 'https://rinkeby.etherscan.io',
    icon: wETHIcon,
    confirmationTimeInMinutes: DEV_DEFAULT_CONFIRMATION_TIME_IN_MINUTES,
  },
  kovan: {
    name: 'kovan',
    chainID: 42,
    domainID: 3000,
    nativeToken: tokens.kETH,
    rpcUrl:
      'https://eth-kovan.alchemyapi.io/v2/QKnfLTfe7CkGA80yAVsCdh8ZatQCsfHI',
    blockExplorer: 'https://kovan.etherscan.io',
    icon: wETHIcon,
    confirmationTimeInMinutes: DEV_DEFAULT_CONFIRMATION_TIME_IN_MINUTES,
  },
  moonbasealpha: {
    name: 'moonbasealpha',
    chainID: 1287,
    domainID: 5000,
    nativeToken: tokens.DEV,
    rpcUrl:
      'https://moonbase-alpha-api.us-east-1.bwarelabs.com/5a2f9f29-1ff5-4708-a044-7c7e9378f822',
    blockExplorer: 'https://moonbase-blockscout.testnet.moonbeam.network',
    icon: DEVIcon,
    confirmationTimeInMinutes: DEV_DEFAULT_CONFIRMATION_TIME_IN_MINUTES,
  },
  milkomedatestnet: {
    name: 'milkomedatestnet',
    chainID: 200101,
    domainID: 8000,
    nativeToken: tokens.wADA,
    rpcUrl:
      'https://use-util.cloud.milkomeda.com:8555',
    blockExplorer: 'http://use-util.cloud.milkomeda.com:4000',
    icon: wADAIcon,
    confirmationTimeInMinutes: DEV_DEFAULT_CONFIRMATION_TIME_IN_MINUTES,
  },
  // TODO: re-add once evmos testnet has been added here (https://github.com/nomad-xyz/nomad-monorepo/blob/main/typescript/nomad-provider/src/nomad/domains/dev.ts)
  // Currently will error otherwise.
  // evmos: {
  //   name: 'Evmos Testnet',
  //   chainID: 9000,
  //   domainID: 2000,
  //   nativeToken: tokens.PHOTON,
  //   rpcUrl: 'https://ethereum.rpc.evmos.dev',
  //   blockExplorer: 'https://evm.evmos.org',
  //   icon: wETHIcon, // TODO: update with correct icon
  //   confirmationTimeInMinutes: 15,
  // },
}

export const hubNetwork = networks.rinkeby

export const connextPools: { [key: string]: string[] } = {
  moonbasealpha: ['kTEST', 'mbTEST'],
  kovan: ['kTEST', 'mbTEST'],
  rinkeby: [],
}

export const connextConfig: SdkBaseChainConfigParams = {
  // must have Ethereum for some reason
  1: {
    // ethereum mainnet
    providers: [
      'https://eth-mainnet.alchemyapi.io/v2/rud551ngiIel2fRYbWmsnhwAE1FGgCLG',
    ],
  },
  42: {
    // kovan
    providers: [
      'https://eth-kovan.alchemyapi.io/v2/QKnfLTfe7CkGA80yAVsCdh8ZatQCsfHI',
    ],
  },
  1287: {
    // moonbasealpha
    providers: [
      'https://moonbase-alpha-api.us-east-1.bwarelabs.com/5a2f9f29-1ff5-4708-a044-7c7e9378f822',
    ],
  },
}

export const walletConnectRPCConfig: Record<number, string>  = {
  42: 'https://eth-kovan.alchemyapi.io/v2/QKnfLTfe7CkGA80yAVsCdh8ZatQCsfHI',
  1287: 'https://moonbeam-alpha.api.onfinality.io/rpc?apikey=44e80fe3-d9ce-40f2-8336-6089e751b625',
}
