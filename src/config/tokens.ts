import { TokenMetadataMap } from './types'
import {
  testnetTokenIdentifiers,
  mainnetTokenIdentifiers,
} from './tokenIdentifiers'

import ConnextIcon from '@/assets/icons/connext.svg'
// TESTNET TOKEN ICONS
import rWETHIcon from '@/assets/token-logos/rWETH.png'
import kWETHIcon from '@/assets/token-logos/kWETH.png'
import gWETHIcon from '@/assets/token-logos/gWETH.png'
import XDAIIcon from '@/assets/token-logos/XDAI.png'
import CARDSIcon from '@/assets/token-logos/CARDS.png'
import C3Icon from '@/assets/token-logos/C3.png'
import GEROIcon from '@/assets/token-logos/GERO.png'
import renBTCIcon from '@/assets/token-logos/renBTC.png'
import sBTCIcon from '@/assets/token-logos/sBTC.png'
import tBTCIcon from '@/assets/token-logos/tBTC.png'
// import DEVIcon from '@/assets/token-logos/DEV.png'
// import wADAIcon from '@/assets/token-logos/wADA.png'

// MAINNET TOKEN ICONS
import wETHIcon from '@/assets/token-logos/WETH.png'
import DEVIcon from '@/assets/token-logos/DEV.png'
import WBTCIcon from '@/assets/token-logos/WBTC.png'
import FRAXIcon from '@/assets/token-logos/FRAX.png'
import FXSIcon from '@/assets/token-logos/FXS.png'
import wADAIcon from '@/assets/token-logos/wADA.png'
import WSTRIcon from '@/assets/token-logos/WSTR.png'
import CQTIcon from '@/assets/token-logos/CQT.png'
import HBTCIcon from '@/assets/token-logos/HBTC.png'
import HBOTIcon from '@/assets/token-logos/HBOT.png'
import PBXIcon from '@/assets/token-logos/PBXIcon.png'

// SHARED TOKEN ICONS (both testnet + mainnet)
import USDTIcon from '@/assets/token-logos/USDT.png'
import USDCIcon from '@/assets/token-logos/USDC.png'
import DAIIcon from '@/assets/token-logos/DAI.png'
import EvmosIcon from '@/assets/token-logos/EVMOS.png'
// import AVAXIcon from '@/assets/token-logos/AVAX.png'

export const testnetTokens: TokenMetadataMap = {
  // Only for use with connext in dev environment
  kTEST: {
    nativeNetwork: 'kovan',
    symbol: 'kTEST',
    name: 'Kovan TEST',
    icon: ConnextIcon,
    iconColors: ['#62BBEF', '#8470E2'],
    decimals: 18,
    coinGeckoId: 'dai',
    tokenIdentifier: testnetTokenIdentifiers.TEST,
    nativeOnly: false,
    minAmt: 10,
  },
  rWETH: {
    nativeNetwork: 'rinkeby',
    symbol: 'rWETH',
    name: 'Rinkeby WETH',
    icon: rWETHIcon,
    iconColors: ['#eda532', '#eda532'],
    decimals: 18,
    coinGeckoId: 'weth',
    tokenIdentifier: testnetTokenIdentifiers.WETH,
    nativeOnly: false,
    minAmt: 0.0028,
  },
  rETH: {
    nativeNetwork: 'rinkeby',
    symbol: 'rETH',
    name: 'Rinkeby ETH',
    icon: rWETHIcon,
    iconColors: ['#eda532', '#eda532'],
    decimals: 18,
    coinGeckoId: 'ethereum',
    tokenIdentifier: null,
    nativeOnly: true,
    minAmt: 0.0028,
    wrappedAsset: 'rWETH',
  },
  kWETH: {
    nativeNetwork: 'kovan',
    symbol: 'kWETH',
    name: 'Kovan WETH',
    icon: kWETHIcon,
    iconColors: ['#9B59B6', '#9B59B6'],
    decimals: 18,
    coinGeckoId: 'weth',
    tokenIdentifier: testnetTokenIdentifiers.kWETH,
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
  gWETH: {
    nativeNetwork: 'goerli',
    symbol: 'gWETH',
    name: 'Goerli WETH',
    icon: gWETHIcon,
    iconColors: ['#2980B9', '#2980B9'],
    decimals: 18,
    coinGeckoId: 'weth',
    tokenIdentifier: testnetTokenIdentifiers.gWETH,
    nativeOnly: false,
    minAmt: 0.0028,
  },
  gETH: {
    nativeNetwork: 'goerli',
    symbol: 'gETH',
    name: 'Goerli ETH',
    icon: gWETHIcon,
    iconColors: ['#2980B9', '#2980B9'],
    decimals: 18,
    coinGeckoId: 'ethereum',
    tokenIdentifier: null,
    nativeOnly: true,
    minAmt: 0.0028,
    wrappedAsset: 'gWETH',
  },
  USDT: {
    nativeNetwork: 'kovan',
    symbol: 'USDT',
    name: 'USDT',
    icon: USDTIcon,
    iconColors: ['#fff', '#26A17B'],
    decimals: 6,
    coinGeckoId: 'tether',
    tokenIdentifier: testnetTokenIdentifiers.USDT,
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
    tokenIdentifier: testnetTokenIdentifiers.USDC,
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
    tokenIdentifier: testnetTokenIdentifiers.DAI,
    nativeOnly: false,
    minAmt: 10,
  },
  xDai: {
    nativeNetwork: 'xdai',
    symbol: 'xDai',
    name: 'xDai',
    icon: XDAIIcon,
    iconColors: ['#03795B', '#03795B'],
    decimals: 18,
    coinGeckoId: 'xdai',
    tokenIdentifier: null,
    nativeOnly: true,
    minAmt: 10,
  },
  wxDai: {
    nativeNetwork: 'xdai',
    symbol: 'WXDAI',
    name: 'WXDAI',
    icon: XDAIIcon,
    iconColors: ['#03795B', '#03795B'],
    decimals: 18,
    coinGeckoId: 'wrapped-xdai',
    tokenIdentifier: testnetTokenIdentifiers.WXDAI,
    nativeOnly: false,
    minAmt: 10,
  },
  // DEV: {
  //   nativeNetwork: 'moonbasealpha',
  //   symbol: 'DEV',
  //   name: 'Moonbase DEV',
  //   icon: DEVIcon,
  //   iconColors: ['#53CBC8', '#e84195'],
  //   decimals: 18,
  //   coinGeckoId: 'moonbeam',
  //   tokenIdentifier: null,
  //   nativeOnly: true,
  //   minAmt: 10,
  // },
  // milkADA: {
  //   nativeNetwork: 'milkomedaC1testnet',
  //   symbol: 'mADA',
  //   name: 'milkADA',
  //   icon: wADAIcon,
  //   iconColors: ['#6684CD', '#0033AC'],
  //   decimals: 18,
  //   coinGeckoId: 'cardano',
  //   tokenIdentifier: null,
  //   nativeOnly: true,
  //   minAmt: 10,
  //   wrappedAsset: 'wADA',
  // },
  // wADA: {
  //   nativeNetwork: 'milkomedaC1testnet',
  //   symbol: 'wADA',
  //   name: 'wADA',
  //   icon: wADAIcon,
  //   iconColors: ['#6684CD', '#0033AC'],
  //   decimals: 18,
  //   coinGeckoId: 'cardano',
  //   tokenIdentifier: testnetTokenIdentifiers.wADA,
  //   nativeOnly: false,
  //   minAmt: 10,
  // },
  tEVMOS: {
    nativeNetwork: 'evmostestnet',
    symbol: 'tEVMOS',
    name: 'tEVMOS',
    icon: EvmosIcon,
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
    icon: EvmosIcon,
    iconColors: ['#454545', '#000'],
    decimals: 18,
    coinGeckoId: 'evmos',
    tokenIdentifier: testnetTokenIdentifiers.wtEVMOS,
    nativeOnly: false,
    minAmt: 10,
  },
}

export const mainnetTokens: TokenMetadataMap = {
  WBTC: {
    nativeNetwork: 'ethereum',
    symbol: 'WBTC',
    name: 'WBTC',
    icon: WBTCIcon,
    iconColors: ['#fff', '#f5a13b'],
    decimals: 8,
    coinGeckoId: 'wrapped-bitcoin',
    tokenIdentifier: mainnetTokenIdentifiers.WBTC,
    nativeOnly: false,
    minAmt: 0.0003,
  },
  WETH: {
    nativeNetwork: 'ethereum',
    symbol: 'WETH',
    name: 'WETH',
    icon: wETHIcon,
    iconColors: ['#C0CEF7', '#7594EE'],
    decimals: 18,
    coinGeckoId: 'weth',
    tokenIdentifier: mainnetTokenIdentifiers.WETH,
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
    wrappedAsset: 'WETH',
  },
  USDT: {
    nativeNetwork: 'ethereum',
    symbol: 'USDT',
    name: 'USDT',
    icon: USDTIcon,
    iconColors: ['#fff', '#26A17B'],
    decimals: 6,
    coinGeckoId: 'tether',
    tokenIdentifier: mainnetTokenIdentifiers.USDT,
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
    tokenIdentifier: mainnetTokenIdentifiers.USDC,
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
    tokenIdentifier: mainnetTokenIdentifiers.DAI,
    nativeOnly: false,
    minAmt: 10,
  },
  EVMOS: {
    nativeNetwork: 'evmos',
    symbol: 'EVMOS',
    name: 'EVMOS',
    icon: EvmosIcon,
    iconColors: ['#454545', '#000'],
    decimals: 18,
    coinGeckoId: 'evmos',
    tokenIdentifier: null,
    nativeOnly: true,
    minAmt: 10,
    wrappedAsset: 'wEVMOS',
  },
  wEVMOS: {
    nativeNetwork: 'evmos',
    symbol: 'wEVMOS',
    name: 'wEVMOS',
    icon: EvmosIcon,
    iconColors: ['#454545', '#000'],
    decimals: 18,
    coinGeckoId: 'evmos',
    tokenIdentifier: mainnetTokenIdentifiers.wEVMOS,
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
    wrappedAsset: 'WGLMR',
  },
  WGLMR: {
    nativeNetwork: 'moonbeam',
    symbol: 'WGLMR',
    name: 'WGLMR',
    icon: DEVIcon,
    iconColors: ['#53CBC8', '#e84195'],
    decimals: 18,
    coinGeckoId: 'moonbeam',
    tokenIdentifier: mainnetTokenIdentifiers.WGLMR,
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
    wrappedAsset: 'wADA',
  },
  wADA: {
    nativeNetwork: 'milkomedaC1',
    symbol: 'wADA',
    name: 'wADA',
    icon: wADAIcon,
    iconColors: ['#6684CD', '#0033AC'],
    decimals: 18,
    coinGeckoId: 'cardano',
    tokenIdentifier: mainnetTokenIdentifiers.WADA,
    nativeOnly: false,
    minAmt: 10,
  },
  // AVAX: {
  //   nativeNetwork: 'avalanche',
  //   symbol: 'AVAX',
  //   name: 'Avalanche',
  //   icon: AVAXIcon,
  //   iconColors: ['#fff', '#e84142'],
  //   decimals: 18,
  //   coinGeckoId: 'avalanche',
  //   tokenIdentifier: null,
  //   nativeOnly: true,
  //   minAmt: 10,
  //   wrappedAsset: 'wAVAX',
  // },
  // wAVAX: {
  //   nativeNetwork: 'avalanche',
  //   symbol: 'wAVAX',
  //   name: 'Wrapped AVAX',
  //   icon: AVAXIcon,
  //   iconColors: ['#fff', '#e84142'],
  //   decimals: 18,
  //   coinGeckoId: 'wrapped-avax',
  //   tokenIdentifier: mainnetTokenIdentifiers.wAVAX,
  //   nativeOnly: false,
  //   minAmt: 10,
  // },
  FRAX: {
    nativeNetwork: 'ethereum',
    symbol: 'FRAX',
    name: 'FRAX',
    icon: FRAXIcon,
    iconColors: ['#454545', '#000'],
    decimals: 18,
    coinGeckoId: 'frax',
    tokenIdentifier: mainnetTokenIdentifiers.FRAX,
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
    tokenIdentifier: mainnetTokenIdentifiers.FXS,
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
    tokenIdentifier: mainnetTokenIdentifiers.WSTR,
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
    tokenIdentifier: mainnetTokenIdentifiers.CQT,
    nativeOnly: false,
    minAmt: 10,
  },
  renBTC: {
    nativeNetwork: 'ethereum',
    symbol: 'renBTC',
    name: 'renBTC',
    icon: renBTCIcon,
    iconColors: ['#fff', '#f5a13b'],
    decimals: 8,
    coinGeckoId: 'renbtc',
    tokenIdentifier: mainnetTokenIdentifiers.renBTC,
    nativeOnly: false,
    minAmt: 0.0003,
  },
  sBTC: {
    nativeNetwork: 'ethereum',
    symbol: 'sBTC',
    name: 'Synth sBTC',
    icon: sBTCIcon,
    iconColors: ['#fff', '#f5a13b'],
    decimals: 18,
    coinGeckoId: 'sbtc',
    tokenIdentifier: mainnetTokenIdentifiers.sBTC,
    nativeOnly: false,
    minAmt: 0.0003,
  },
  tBTC: {
    nativeNetwork: 'ethereum',
    symbol: 'tBTC',
    name: 'tBTC v2',
    icon: tBTCIcon,
    iconColors: ['#fff', '#f5a13b'],
    decimals: 18,
    coinGeckoId: 'tbtc',
    tokenIdentifier: mainnetTokenIdentifiers.tBTC,
    nativeOnly: false,
    minAmt: 0.0003,
  },
  CARDS: {
    nativeNetwork: 'ethereum',
    symbol: 'CARDS',
    name: 'Card Starter',
    icon: CARDSIcon,
    iconColors: ['#0344de', '#0344de'],
    decimals: 18,
    coinGeckoId: 'cardstarter',
    tokenIdentifier: mainnetTokenIdentifiers.CARDS,
    nativeOnly: false,
    minAmt: 10,
  },
  C3: {
    nativeNetwork: 'ethereum',
    symbol: 'C3',
    name: 'CHARLI3',
    icon: C3Icon,
    iconColors: ['#E82222', '#c31414'],
    decimals: 18,
    coinGeckoId: 'charli3',
    tokenIdentifier: mainnetTokenIdentifiers.C3,
    nativeOnly: false,
    minAmt: 10,
  },
  GERO: {
    nativeNetwork: 'ethereum',
    symbol: 'GERO',
    name: 'GeroWallet',
    icon: GEROIcon,
    iconColors: ['#54E09D', '#28266C'],
    decimals: 18,
    coinGeckoId: 'gerowallet',
    tokenIdentifier: mainnetTokenIdentifiers.GERO,
    nativeOnly: false,
    minAmt: 10,
  },
  HBTC: {
    nativeNetwork: 'ethereum',
    symbol: 'HBTC',
    name: 'Huobi BTC',
    icon: HBTCIcon,
    iconColors: ['#54E09D', '#28266C'],
    decimals: 18,
    coinGeckoId: 'huobi-btc',
    tokenIdentifier: mainnetTokenIdentifiers.HBTC,
    nativeOnly: false,
    minAmt: 0.0003,
  },
  HBOT: {
    nativeNetwork: 'ethereum',
    symbol: 'HBOT',
    name: 'Hummingbot',
    icon: HBOTIcon,
    iconColors: ['#E3E3E3', '#858585'],
    decimals: 18,
    coinGeckoId: 'hummingbot',
    tokenIdentifier: mainnetTokenIdentifiers.HBOT,
    nativeOnly: false,
    minAmt: 10,
  },
  PBX: {
    nativeNetwork: 'ethereum',
    symbol: 'PBX',
    name: 'Paribus',
    icon: PBXIcon,
    iconColors: ['#03b1ea', '#8660fd'],
    decimals: 18,
    coinGeckoId: 'paribus',
    tokenIdentifier: mainnetTokenIdentifiers.PBX,
    nativeOnly: false,
    minAmt: 10,
  },
}
