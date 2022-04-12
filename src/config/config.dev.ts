import rWETHIcon from '@/assets/token-logos/rWETH.png'
import kWETHIcon from '@/assets/token-logos/kWETH.png'
// import gWETHIcon from '@/assets/token-logos/gWETH.png'
import DEVIcon from '@/assets/token-logos/DEV.png'
import wADAIcon from '@/assets/token-logos/wADA.png'
import wEvmosIcon from '@/assets/token-logos/wEVMOS.png'
import USDTIcon from '@/assets/token-logos/USDT.png'
import USDCIcon from '@/assets/token-logos/USDC.png'
import DAIIcon from '@/assets/token-logos/DAI.png'
import ConnextIcon from '@/assets/icons/connext.svg'

import { SdkBaseChainConfigParams } from '@connext/nxtp-sdk'

import testnetTokens from './tokens.dev'
import { TokenMetadata, NetworkMetadata, NetworkName } from './config.types'
import { AppConfig } from 'vue'

const configuration = await import('@nomad-xyz/configuration')
const config = configuration.getBuiltin('development')
console.log(`Environment: ${config.environment}`)
console.log('config', config)

const {
  VUE_APP_ETHEREUM_RPC,
  VUE_APP_RINKEBY_RPC,
  VUE_APP_KOVAN_RPC,
  VUE_APP_MOONBASEALPHA_RPC,
  VUE_APP_EVMOS_TESTNET_RPC,
  VUE_APP_MILKOMEDA_TESTNET_RPC,
  // VUE_APP_GOERLI_RPC
} = process.env

export const tokens: { [key: string]: TokenMetadata } = {
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
  WETH: {
    nativeNetwork: 'rinkeby',
    symbol: 'WETH',
    name: 'Rinkeby WETH',
    icon: rWETHIcon,
    iconColors: ['#eda532', '#eda532'],
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
    icon: rWETHIcon,
    iconColors: ['#eda532', '#eda532'],
    decimals: 18,
    coinGeckoId: 'ethereum',
    tokenIdentifier: null,
    nativeOnly: true,
    minAmt: 0.0028,
    wrappedAsset: 'WETH',
  },
  kWETH: {
    nativeNetwork: 'kovan',
    symbol: 'kWETH',
    name: 'Kovan WETH',
    icon: kWETHIcon,
    iconColors: ['#9B59B6', '#9B59B6'],
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
    icon: kWETHIcon,
    iconColors: ['#9B59B6', '#9B59B6'],
    decimals: 18,
    coinGeckoId: 'ethereum',
    tokenIdentifier: null,
    nativeOnly: true,
    minAmt: 0.0028,
    wrappedAsset: 'kWETH',
  },
  // gWETH: {
  //   nativeNetwork: 'goerli',
  //   symbol: 'gWETH',
  //   name: 'Goerli WETH',
  //   icon: gWETHIcon,
  //   iconColors: ['#2980B9', '#2980B9'],
  //   decimals: 18,
  //   coinGeckoId: 'weth',
  //   tokenIdentifier: testnetTokens.gWETH,
  //   nativeOnly: false,
  //   minAmt: 0.0028,
  // },
  // gETH: {
  //   nativeNetwork: 'goerli',
  //   symbol: 'gETH',
  //   name: 'Goerli ETH',
  //   icon: gWETHIcon,
  //   iconColors: ['#2980B9', '#2980B9'],
  //   decimals: 18,
  //   coinGeckoId: 'ethereum',
  //   tokenIdentifier: null,
  //   nativeOnly: true,
  //   minAmt: 0.0028,
  //   wrappedAsset: 'gWETH',
  // },
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
    coinGeckoId: 'moonbeam',
    tokenIdentifier: null,
    nativeOnly: true,
    minAmt: 10,
  },
  milkADA: {
    nativeNetwork: 'milkomedaC1testnet',
    symbol: 'mADA',
    name: 'milkADA',
    icon: wADAIcon,
    iconColors: ['#6684CD', '#0033AC'],
    decimals: 18,
    coinGeckoId: 'cardano',
    tokenIdentifier: null,
    nativeOnly: true,
    minAmt: 10,
    wrappedAsset: 'wADA',
  },
  wADA: {
    nativeNetwork: 'milkomedaC1testnet',
    symbol: 'wADA',
    name: 'wADA',
    icon: wADAIcon,
    iconColors: ['#6684CD', '#0033AC'],
    decimals: 18,
    coinGeckoId: 'cardano',
    tokenIdentifier: testnetTokens.wADA,
    nativeOnly: false,
    minAmt: 10,
  },
  tEVMOS: {
    nativeNetwork: 'evmostestnet',
    symbol: 'tEVMOS',
    name: 'tEVMOS',
    icon: wEvmosIcon,
    iconColors: ['#454545', '#000'],
    decimals: 18,
    coinGeckoId: 'evmos',
    tokenIdentifier: null,
    nativeOnly: true,
    minAmt: 10,
    wrappedAsset: 'wtEVMOS',
  },
  wtEVMOS: {
    nativeNetwork: 'evmostestnet',
    symbol: 'wtEVMOS',
    name: 'wtEVMOS',
    icon: wEvmosIcon,
    iconColors: ['#454545', '#000'],
    decimals: 18,
    coinGeckoId: 'evmos',
    tokenIdentifier: testnetTokens.wtEVMOS,
    nativeOnly: false,
    minAmt: 10,
  },
}

// default confirmation time for dev, set on each network below
const DEV_DEFAULT_CONFIRMATION_TIME_IN_MINUTES = 2

type Networks = { [key: string]: NetworkMetadata }

// TODO: fix types
const networks: Networks = {}
Object.keys(config.bridgeGui).forEach(networkName => {
  // TODO: update config with the bridge gui details and re-publish
  const { displayName = '', nativeTokenSymbol: nativeToken }: any = config.bridgeGui[networkName] || {}
  const { connections, name, domain } = config.protocol.networks[networkName]
  const { chainId, blockExplorer } = config.protocol.networks[networkName].specs
  const rpcUrl = config.rpcs[networkName][0]
  const { optimisticSeconds } = config.protocol.networks[networkName].configuration
  const confirmationTimeInMinutes = optimisticSeconds as number / 60


  networks[networkName] = {
    domainID: domain,
    chainID: chainId,
    name,
    displayName,
    nativeToken,
    connections,
    blockExplorer,
    rpcUrl,
    confirmationTimeInMinutes,
    icon: '',
  } as NetworkMetadata
})


console.log('networks', networks)

export { networks }

// export const networks: { [key: string]: NetworkMetadata } = {
//   rinkeby: {
//     name: 'rinkeby',
//     displayName: 'Rinkeby',
//     connections: ['kovan', 'moonbasealpha', 'milkomedaC1testnet', 'evmostestnet'],
//     chainID: 4,
//     domainID: 2000,
//     nativeToken: tokens.ETH,
//     rpcUrl: VUE_APP_RINKEBY_RPC!,
//     blockExplorer: 'https://rinkeby.etherscan.io',
//     icon: rWETHIcon,
//     confirmationTimeInMinutes: DEV_DEFAULT_CONFIRMATION_TIME_IN_MINUTES,
//   },
//   kovan: {
//     name: 'kovan',
//     displayName: 'Kovan',
//     connections: ['rinkeby'],
//     chainID: 42,
//     domainID: 3000,
//     nativeToken: tokens.kETH,
//     rpcUrl: VUE_APP_KOVAN_RPC!,
//     blockExplorer: 'https://kovan.etherscan.io',
//     icon: kWETHIcon,
//     confirmationTimeInMinutes: DEV_DEFAULT_CONFIRMATION_TIME_IN_MINUTES,
//   },
//   // goerli: {
//   //   name: 'goerli',
//   //   displayName: 'Goerli',
//   //   connections: ['kovan', 'rinkeby'],
//   //   chainID: 5,
//   //   domainID: 9000,
//   //   nativeToken: tokens.gETH,
//   //   rpcUrl: VUE_APP_GOERLI_RPC!,
//   //   blockExplorer: 'https://goerli.etherscan.io',
//   //   icon: gWETHIcon,
//   //   confirmationTimeInMinutes: DEV_DEFAULT_CONFIRMATION_TIME_IN_MINUTES,
//   // }
//   moonbasealpha: {
//     name: 'moonbasealpha',
//     displayName: 'Moonbase Alpha',
//     connections: ['rinkeby'],
//     chainID: 1287,
//     domainID: 5000,
//     nativeToken: tokens.DEV,
//     rpcUrl: VUE_APP_MOONBASEALPHA_RPC!,
//     blockExplorer: 'https://moonbase-blockscout.testnet.moonbeam.network',
//     icon: DEVIcon,
//     confirmationTimeInMinutes: DEV_DEFAULT_CONFIRMATION_TIME_IN_MINUTES,
//   },
//   milkomedaC1testnet: {
//     name: 'milkomedaC1testnet',
//     displayName: 'Milkomeda Testnet',
//     connections: ['rinkeby'],
//     chainID: 200101,
//     domainID: 8000,
//     nativeToken: tokens.milkADA,
//     rpcUrl: VUE_APP_MILKOMEDA_TESTNET_RPC!,
//     blockExplorer: 'https://explorer-devnet-cardano-evm.c1.milkomeda.com',
//     icon: wADAIcon,
//     confirmationTimeInMinutes: DEV_DEFAULT_CONFIRMATION_TIME_IN_MINUTES,
//   },
//   evmostestnet: {
//     name: 'evmostestnet',
//     displayName: 'Evmos Testnet',
//     connections: ['rinkeby'],
//     chainID: 9000,
//     domainID: 9000,
//     nativeToken: tokens.tEVMOS,
//     rpcUrl: VUE_APP_EVMOS_TESTNET_RPC!,
//     blockExplorer: 'https://evm.evmos.org',
//     icon: wEvmosIcon,
//     confirmationTimeInMinutes: DEV_DEFAULT_CONFIRMATION_TIME_IN_MINUTES,
//   },
// }

export const hubNetwork = networks.rinkeby

export const connextConfig: SdkBaseChainConfigParams = {
  // must have Ethereum for some reason
  1: {
    // ethereum mainnet
    providers: [VUE_APP_ETHEREUM_RPC!],
  },
  42: {
    // kovan
    providers: [VUE_APP_KOVAN_RPC!],
  },
  4: {
    // rinkeby
    providers: [VUE_APP_RINKEBY_RPC!],
  },
  // 1287: {
  //   // moonbasealpha
  //   providers: [VUE_APP_MOONBASEALPHA_RPC!],
  // },
  // 9000: {
  //   // evmos testnet
  //   providers: [VUE_APP_EVMOS_TESTNET_RPC!]
  // },
}
