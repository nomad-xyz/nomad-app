import wETHIcon from '@/assets/token-logos/WETH.png'
import USDTIcon from '@/assets/token-logos/USDT.png'
import USDCIcon from '@/assets/token-logos/USDC.png'
import DAIIcon from '@/assets/token-logos/DAI.png'
import DEVIcon from '@/assets/token-logos/DEV.png'
import WBTCIcon from '@/assets/token-logos/WBTC.png'
import FRAXIcon from '@/assets/token-logos/FRAX.png'
import FXSIcon from '@/assets/token-logos/FXS.png'
import wADAIcon from '@/assets/token-logos/wADA.png'
import WSTRIcon from '@/assets/token-logos/WSTR.png'
import CQTIcon from '@/assets/token-logos/CQT.png'

import { SdkBaseChainConfigParams } from '@connext/nxtp-sdk'

import mainnetTokens from './tokens.main'
import { TokenMetadata, NetworkMetadata } from './config.types'

const { VUE_APP_ETHEREUM_RPC, VUE_APP_MOONBEAM_RPC, VUE_APP_MILKOMEDA_RPC } =
  process.env

export const tokens: { [key: string]: TokenMetadata } = {
  WBTC: {
    nativeNetwork: 'ethereum',
    symbol: 'WBTC',
    name: 'WBTC',
    icon: WBTCIcon,
    iconColors: ['#fff', '#f5a13b'],
    decimals: 8,
    coinGeckoId: 'wrapped-bitcoin',
    tokenIdentifier: mainnetTokens.WBTC,
    nativeOnly: false,
    minAmt: 10,
  },
  WETH: {
    nativeNetwork: 'ethereum',
    symbol: 'WETH',
    name: 'WETH',
    icon: wETHIcon,
    iconColors: ['#C0CEF7', '#7594EE'],
    decimals: 18,
    coinGeckoId: 'weth',
    tokenIdentifier: mainnetTokens.WETH,
    nativeOnly: false,
    minAmt: 0.0028,
  },
  ETH: {
    nativeNetwork: 'ethereum',
    symbol: 'ETH',
    name: 'ETH',
    icon: wETHIcon,
    iconColors: ['#C0CEF7', '#7594EE'],
    decimals: 18,
    coinGeckoId: 'ethereum',
    tokenIdentifier: null,
    nativeOnly: true,
    minAmt: 0.0028,
  },
  USDT: {
    nativeNetwork: 'ethereum',
    symbol: 'USDT',
    name: 'USDT',
    icon: USDTIcon,
    iconColors: ['#fff', '#26A17B'],
    decimals: 6,
    coinGeckoId: 'tether',
    tokenIdentifier: mainnetTokens.USDT,
    nativeOnly: false,
    minAmt: 10,
  },
  USDC: {
    nativeNetwork: 'ethereum',
    symbol: 'USDC',
    name: 'USDC',
    icon: USDCIcon,
    iconColors: ['#fff', '#2976C9'],
    decimals: 6,
    coinGeckoId: 'usd-coin',
    tokenIdentifier: mainnetTokens.USDC,
    nativeOnly: false,
    minAmt: 10,
  },
  DAI: {
    nativeNetwork: 'ethereum',
    symbol: 'DAI',
    name: 'DAI',
    icon: DAIIcon,
    iconColors: ['#f0bf54', '#F4B731'],
    decimals: 18,
    coinGeckoId: 'dai',
    tokenIdentifier: mainnetTokens.DAI,
    nativeOnly: false,
    minAmt: 10,
  },
  FRAX: {
    nativeNetwork: 'ethereum',
    symbol: 'FRAX',
    name: 'FRAX',
    icon: FRAXIcon,
    iconColors: ['#454545', '#000'],
    decimals: 18,
    coinGeckoId: 'frax',
    tokenIdentifier: mainnetTokens.FRAX,
    nativeOnly: false,
    minAmt: 10,
  },
  FXS: {
    nativeNetwork: 'ethereum',
    symbol: 'FXS',
    name: 'FXS',
    icon: FXSIcon,
    iconColors: ['#454545', '#000'],
    decimals: 18,
    coinGeckoId: 'frax-share',
    tokenIdentifier: mainnetTokens.FXS,
    nativeOnly: false,
    minAmt: 10,
  },
  GLMR: {
    nativeNetwork: 'moonbeam',
    symbol: 'GLMR',
    name: 'GLMR',
    icon: DEVIcon,
    iconColors: ['#53CBC8', '#e84195'],
    decimals: 18,
    coinGeckoId: 'moonbeam',
    tokenIdentifier: null,
    nativeOnly: true,
    minAmt: 10,
  },
  WGLMR: {
    nativeNetwork: 'moonbeam',
    symbol: 'WGLMR',
    name: 'WGLMR',
    icon: DEVIcon,
    iconColors: ['#53CBC8', '#e84195'],
    decimals: 18,
    coinGeckoId: 'moonbeam',
    tokenIdentifier: mainnetTokens.WGLMR,
    nativeOnly: false,
    minAmt: 10,
  },
  milkADA: {
    nativeNetwork: 'milkomedaC1',
    symbol: 'mADA',
    name: 'milkADA',
    icon: wADAIcon,
    iconColors: ['#6684CD', '#0033AC'],
    decimals: 18,
    coinGeckoId: 'cardano',
    tokenIdentifier: null,
    nativeOnly: true,
    minAmt: 10,
  },
  wADA: {
    nativeNetwork: 'milkomedaC1',
    symbol: 'wADA',
    name: 'wADA',
    icon: wADAIcon,
    iconColors: ['#6684CD', '#0033AC'],
    decimals: 18,
    coinGeckoId: 'cardano',
    tokenIdentifier: mainnetTokens.WADA,
    nativeOnly: false,
    minAmt: 10,
  },
  WSTR: {
    nativeNetwork: 'ethereum',
    symbol: 'wSTR',
    name: 'wSTR',
    icon: WSTRIcon,
    iconColors: ['#454545', '#000'],
    decimals: 18,
    coinGeckoId: 'wrapped-star',
    tokenIdentifier: mainnetTokens.WSTR,
    nativeOnly: false,
    minAmt: 10,
  },
  CQT: {
    nativeNetwork: 'ethereum',
    symbol: 'CQT',
    name: 'CQT',
    icon: CQTIcon,
    iconColors: ['#00D8D5', '#FF4C8B'],
    decimals: 18,
    coinGeckoId: 'covalent',
    tokenIdentifier: mainnetTokens.CQT,
    nativeOnly: false,
    minAmt: 10,
  },
}

// default confirmation time for prod, set on each network below
const PROD_DEFAULT_CONFIRMATION_TIME_IN_MINUTES = 30

export const networks: { [key: string]: NetworkMetadata } = {
  ethereum: {
    name: 'ethereum',
    displayName: 'Ethereum',
    connections: ['moonbeam', 'milkomedaC1'],
    chainID: 1,
    domainID: 6648936,
    rpcUrl: VUE_APP_ETHEREUM_RPC!,
    nativeToken: tokens.ETH,
    blockExplorer: 'https://etherscan.io',
    icon: wETHIcon,
    confirmationTimeInMinutes: PROD_DEFAULT_CONFIRMATION_TIME_IN_MINUTES,
  },
  moonbeam: {
    name: 'moonbeam',
    displayName: 'Moonbeam',
    connections: ['ethereum'],
    chainID: 1284,
    domainID: 1650811245,
    rpcUrl: VUE_APP_MOONBEAM_RPC!,
    nativeToken: tokens.GLMR,
    blockExplorer: 'https://blockscout.moonbeam.network',
    icon: DEVIcon,
    confirmationTimeInMinutes: PROD_DEFAULT_CONFIRMATION_TIME_IN_MINUTES,
  },
  milkomedaC1: {
    name: 'milkomedaC1',
    displayName: 'Milkomeda C1',
    connections: ['ethereum'],
    chainID: 2001,
    domainID: 25393,
    nativeToken: tokens.milkADA,
    rpcUrl: VUE_APP_MILKOMEDA_RPC!,
    blockExplorer: 'https://explorer-mainnet-cardano-evm.c1.milkomeda.com',
    icon: wADAIcon,
    confirmationTimeInMinutes: PROD_DEFAULT_CONFIRMATION_TIME_IN_MINUTES,
  },
}

export const hubNetwork = networks.ethereum

export const connextPools: { [key: string]: string[] } = {
  moonbeam: ['WETH', 'USDC', 'USDT', 'DAI'],
  ethereum: ['ETH', 'USDC', 'USDT', 'DAI'],
}

export const connextConfig: SdkBaseChainConfigParams = {
  1: {
    // ethereum mainnet
    providers: [VUE_APP_ETHEREUM_RPC!],
  },
  1284: {
    // moonbeam mainnet
    providers: [
      VUE_APP_MOONBEAM_RPC!,
      'https://moonbeam.api.onfinality.io/public',
      'https://rpc.api.moonbeam.network',
    ],
  },
}
