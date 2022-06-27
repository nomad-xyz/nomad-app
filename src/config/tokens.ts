import { TokenMetadataMap } from './types'
import {
  testnetTokenIdentifiers,
  mainnetTokenIdentifiers,
} from './tokenIdentifiers'

import ConnextIcon from '@/assets/icons/connext.svg'
// TESTNET TOKEN ICONS
import rWETHIcon from '@/assets/token-logos/rWETH.png'
import gWETHIcon from '@/assets/token-logos/gWETH.png'
import CARDSIcon from '@/assets/token-logos/CARDS.png'
import C3Icon from '@/assets/token-logos/C3.png'
import GEROIcon from '@/assets/token-logos/GERO.png'
import renBTCIcon from '@/assets/token-logos/renBTC.png'
import sBTCIcon from '@/assets/token-logos/sBTC.png'
import tBTCIcon from '@/assets/token-logos/tBTC.png'
import NEONIcon from '@/assets/token-logos/NEON.svg'
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
import HBOTIcon from '@/assets/token-logos/HBOT.svg'
import MIMIcon from '@/assets/token-logos/MIM.png'
import CROIcon from '@/assets/token-logos/CRO.png'
import UNIIcon from '@/assets/token-logos/UNI.png'
import SHIBIcon from '@/assets/token-logos/SHIB.png'
import LINKIcon from '@/assets/token-logos/LINK.png'
import MKRIcon from '@/assets/token-logos/MKR.png'
import COMPIcon from '@/assets/token-logos/COMP.png'
import AAVEIcon from '@/assets/token-logos/AAVE.svg'
import PBXIcon from '@/assets/token-logos/PBXIcon.png'
import GELIcon from '@/assets/token-logos/GEL.png'
import APEIcon from '@/assets/token-logos/APE.png'
import TICIcon from '@/assets/token-logos/TIC.png'

// SHARED TOKEN ICONS (both testnet + mainnet)
import USDTIcon from '@/assets/token-logos/USDT.png'
import USDCIcon from '@/assets/token-logos/USDC.png'
import DAIIcon from '@/assets/token-logos/DAI.png'
import EvmosIcon from '@/assets/token-logos/EVMOS.png'
// import AVAXIcon from '@/assets/token-logos/AVAX.png'

export const testnetTokens: TokenMetadataMap = {
  // Only for use with connext in dev environment
  TEST: {
    key: 'TEST',
    nativeNetwork: 'goerli',
    symbol: 'TEST',
    name: 'Goerli TEST',
    icon: ConnextIcon,
    iconColors: ['#62BBEF', '#8470E2'],
    decimals: 18,
    coinGeckoId: 'dai',
    tokenIdentifier: testnetTokenIdentifiers.TEST,
    nativeOnly: false,
    show: false,
  },
  rETH: {
    key: 'rETH',
    nativeNetwork: 'rinkeby',
    symbol: 'rETH',
    name: 'Rinkeby ETH',
    icon: rWETHIcon,
    iconColors: ['#eda532', '#eda532'],
    decimals: 18,
    coinGeckoId: 'ethereum',
    tokenIdentifier: null,
    nativeOnly: true,
    wrappedAsset: 'rWETH',
    default: true,
    show: true,
  },
  rWETH: {
    key: 'rWETH',
    nativeNetwork: 'rinkeby',
    symbol: 'rWETH',
    name: 'Rinkeby WETH',
    icon: rWETHIcon,
    iconColors: ['#eda532', '#eda532'],
    decimals: 18,
    coinGeckoId: 'weth',
    tokenIdentifier: testnetTokenIdentifiers.rWETH,
    nativeOnly: false,
    default: true,
    show: true,
  },
  gETH: {
    key: 'gETH',
    nativeNetwork: 'goerli',
    symbol: 'gETH',
    name: 'Goerli ETH',
    icon: gWETHIcon,
    iconColors: ['#2980B9', '#2980B9'],
    decimals: 18,
    coinGeckoId: 'ethereum',
    tokenIdentifier: null,
    nativeOnly: true,
    wrappedAsset: 'gWETH',
    default: true,
    show: true,
  },
  gWETH: {
    key: 'gWETH',
    nativeNetwork: 'goerli',
    symbol: 'gWETH',
    name: 'Goerli WETH',
    icon: gWETHIcon,
    iconColors: ['#2980B9', '#2980B9'],
    decimals: 18,
    coinGeckoId: 'weth',
    tokenIdentifier: testnetTokenIdentifiers.gWETH,
    nativeOnly: false,
    default: true,
    show: true,
  },
  tEVMOS: {
    key: 'tEVMOS',
    nativeNetwork: 'evmostestnet',
    symbol: 'tEVMOS',
    name: 'tEVMOS',
    icon: EvmosIcon,
    iconColors: ['#F3836F', '#EE4E32'],
    decimals: 18,
    coinGeckoId: 'evmos',
    tokenIdentifier: null,
    nativeOnly: true,
    wrappedAsset: 'wtEVMOS',
    default: true,
    show: true,
  },
  wtEVMOS: {
    key: 'wtEVMOS',
    nativeNetwork: 'evmostestnet',
    symbol: 'wtEVMOS',
    name: 'wtEVMOS',
    icon: EvmosIcon,
    iconColors: ['#F3836F', '#EE4E32'],
    decimals: 18,
    coinGeckoId: 'evmos',
    tokenIdentifier: testnetTokenIdentifiers.wtEVMOS,
    nativeOnly: false,
    default: true,
    show: true,
  },
  NEON: {
    key: 'NEON',
    nativeNetwork: 'neontestnet',
    symbol: 'NEON',
    name: 'NEON',
    icon: NEONIcon,
    iconColors: ['#FF59FF', '#BC00DE'],
    decimals: 18,
    coinGeckoId: 'neon',
    tokenIdentifier: null,
    nativeOnly: true,
    default: true,
    show: true,
  },
  wNEON: {
    key: 'wNEON',
    nativeNetwork: 'neontestnet',
    symbol: 'wNEON',
    name: 'Wrapped NEON',
    icon: NEONIcon,
    iconColors: ['#FF86FF', '#BC00DE'],
    decimals: 18,
    coinGeckoId: 'neon',
    tokenIdentifier: mainnetTokenIdentifiers.wNEON,
    nativeOnly: false,
    default: true,
    show: true,
  },
  USDC: {
    key: 'USDC',
    nativeNetwork: 'goerli',
    symbol: 'USDC',
    name: 'USDC',
    icon: USDCIcon,
    iconColors: ['#bed5ee', '#2976C9'],
    decimals: 6,
    coinGeckoId: 'usd-coin',
    tokenIdentifier: testnetTokenIdentifiers.USDC,
    nativeOnly: false,
    default: true,
    show: true,
  },
  rUSDC: {
    key: 'rUSDC',
    nativeNetwork: 'rinkeby',
    symbol: 'rUSDC',
    name: 'Rinkeby USDC',
    icon: USDCIcon,
    iconColors: ['#bed5ee', '#2976C9'],
    decimals: 6,
    coinGeckoId: 'usd-coin',
    tokenIdentifier: testnetTokenIdentifiers.rUSDC,
    nativeOnly: false,
    default: true,
    show: true,
  },
  // xDai: {
  //   key: 'xDai',
  //   nativeNetwork: 'xdai',
  //   symbol: 'xDai',
  //   name: 'xDai',
  //   icon: XDAIIcon,
  //   iconColors: ['#03795B', '#03795B'],
  //   decimals: 18,
  //   coinGeckoId: 'xdai',
  //   tokenIdentifier: null,
  //   nativeOnly: true,
  //   default: true,
  //   show: true,
  // },
  // wxDai: {
  //   key: 'wxDai',
  //   nativeNetwork: 'xdai',
  //   symbol: 'WXDAI',
  //   name: 'WXDAI',
  //   icon: XDAIIcon,
  //   iconColors: ['#03795B', '#03795B'],
  //   decimals: 18,
  //   coinGeckoId: 'wrapped-xdai',
  //   tokenIdentifier: testnetTokenIdentifiers.WXDAI,
  //   nativeOnly: false,
  //   default: true,
  //   show: true,
  // },
  // DEV: {
  //   key: '',
  //   nativeNetwork: 'moonbasealpha',
  //   symbol: 'DEV',
  //   name: 'Moonbase DEV',
  //   icon: DEVIcon,
  //   iconColors: ['#53CBC8', '#e84195'],
  //   decimals: 18,
  //   coinGeckoId: 'moonbeam',
  //   tokenIdentifier: null,
  //   nativeOnly: true,
  //
  // },
  // milkADA: {
  //   key: '',
  //   nativeNetwork: 'milkomedaC1testnet',
  //   symbol: 'mADA',
  //   name: 'milkADA',
  //   icon: wADAIcon,
  //   iconColors: ['#6684CD', '#0033AC'],
  //   decimals: 18,
  //   coinGeckoId: 'cardano',
  //   tokenIdentifier: null,
  //   nativeOnly: true,
  //
  //   wrappedAsset: 'wADA',
  // },
  // wADA: {
  //   key: '',
  //   nativeNetwork: 'milkomedaC1testnet',
  //   symbol: 'wADA',
  //   name: 'wADA',
  //   icon: wADAIcon,
  //   iconColors: ['#6684CD', '#0033AC'],
  //   decimals: 18,
  //   coinGeckoId: 'cardano',
  //   tokenIdentifier: testnetTokenIdentifiers.wADA,
  //   nativeOnly: false,
  // },
}

export const mainnetTokens: TokenMetadataMap = {
  ETH: {
    key: 'ETH',
    nativeNetwork: 'ethereum',
    symbol: 'ETH',
    name: 'ETH',
    icon: wETHIcon,
    iconColors: ['#C0CEF7', '#7594EE'],
    decimals: 18,
    coinGeckoId: 'ethereum',
    tokenIdentifier: null,
    nativeOnly: true,
    wrappedAsset: 'WETH',
    default: true,
    show: true,
  },
  WETH: {
    key: 'WETH',
    nativeNetwork: 'ethereum',
    symbol: 'WETH',
    name: 'Wrapped ETH',
    icon: wETHIcon,
    iconColors: ['#C0CEF7', '#7594EE'],
    decimals: 18,
    coinGeckoId: 'weth',
    tokenIdentifier: mainnetTokenIdentifiers.WETH,
    nativeOnly: false,
    default: true,
    show: true,
  },
  EVMOS: {
    key: 'EVMOS',
    nativeNetwork: 'evmos',
    symbol: 'EVMOS',
    name: 'EVMOS',
    icon: EvmosIcon,
    iconColors: ['#F3836F', '#EE4E32'],
    decimals: 18,
    coinGeckoId: 'evmos',
    tokenIdentifier: null,
    nativeOnly: true,
    wrappedAsset: 'wEVMOS',
    default: true,
    show: true,
  },
  wEVMOS: {
    key: 'wEVMOS',
    nativeNetwork: 'evmos',
    symbol: 'wEVMOS',
    name: 'Wrapped EVMOS',
    icon: EvmosIcon,
    iconColors: ['#F3836F', '#EE4E32'],
    decimals: 18,
    coinGeckoId: 'evmos',
    tokenIdentifier: mainnetTokenIdentifiers.wEVMOS,
    nativeOnly: false,
    default: true,
    show: true,
  },
  GLMR: {
    key: 'GLMR',
    nativeNetwork: 'moonbeam',
    symbol: 'GLMR',
    name: 'GLMR',
    icon: DEVIcon,
    iconColors: ['#53CBC8', '#e84195'],
    decimals: 18,
    coinGeckoId: 'moonbeam',
    tokenIdentifier: null,
    nativeOnly: true,
    wrappedAsset: 'WGLMR',
    default: true,
    show: true,
  },
  WGLMR: {
    key: 'WGLMR',
    nativeNetwork: 'moonbeam',
    symbol: 'WGLMR',
    name: 'Wrapped GLMR',
    icon: DEVIcon,
    iconColors: ['#53CBC8', '#e84195'],
    decimals: 18,
    coinGeckoId: 'moonbeam',
    tokenIdentifier: mainnetTokenIdentifiers.WGLMR,
    nativeOnly: false,
    default: true,
    show: true,
  },
  milkADA: {
    key: 'milkADA',
    nativeNetwork: 'milkomedaC1',
    symbol: 'mADA',
    name: 'milkADA',
    icon: wADAIcon,
    iconColors: ['#99addd', '#1947b4'],
    decimals: 18,
    coinGeckoId: 'cardano',
    tokenIdentifier: null,
    nativeOnly: true,
    wrappedAsset: 'wADA',
    default: true,
    show: true,
  },
  wADA: {
    key: 'wADA',
    nativeNetwork: 'milkomedaC1',
    symbol: 'wADA',
    name: 'Wrapped milkADA',
    icon: wADAIcon,
    iconColors: ['#99addd', '#1947b4'],
    decimals: 18,
    coinGeckoId: 'cardano',
    tokenIdentifier: mainnetTokenIdentifiers.WADA,
    nativeOnly: false,
    default: true,
    show: true,
  },
  WBTC: {
    key: 'WBTC',
    nativeNetwork: 'ethereum',
    symbol: 'WBTC',
    name: 'Wrapped BTC',
    icon: WBTCIcon,
    iconColors: ['#FBD9B0', '#f5a13b'],
    decimals: 8,
    coinGeckoId: 'wrapped-bitcoin',
    tokenIdentifier: mainnetTokenIdentifiers.WBTC,
    nativeOnly: false,
    default: true,
    show: true,
  },
  USDC: {
    key: 'USDC',
    nativeNetwork: 'ethereum',
    symbol: 'USDC',
    name: 'USDC',
    icon: USDCIcon,
    iconColors: ['#bed5ee', '#2976C9'],
    decimals: 6,
    coinGeckoId: 'usd-coin',
    tokenIdentifier: mainnetTokenIdentifiers.USDC,
    nativeOnly: false,
    default: true,
    show: true,
  },
  USDT: {
    key: 'USDT',
    nativeNetwork: 'ethereum',
    symbol: 'USDT',
    name: 'USDT',
    icon: USDTIcon,
    iconColors: ['#bde2d7', '#26A17B'],
    decimals: 6,
    coinGeckoId: 'tether',
    tokenIdentifier: mainnetTokenIdentifiers.USDT,
    nativeOnly: false,
    default: true,
    show: true,
  },
  DAI: {
    key: 'DAI',
    nativeNetwork: 'ethereum',
    symbol: 'DAI',
    name: 'DAI',
    icon: DAIIcon,
    iconColors: ['#fbe9c1', '#F4B731'],
    decimals: 18,
    coinGeckoId: 'dai',
    tokenIdentifier: mainnetTokenIdentifiers.DAI,
    nativeOnly: false,
    default: true,
    show: true,
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
    key: 'FRAX',
    nativeNetwork: 'ethereum',
    symbol: 'FRAX',
    name: 'FRAX',
    icon: FRAXIcon,
    iconColors: ['#454545', '#000'],
    decimals: 18,
    coinGeckoId: 'frax',
    tokenIdentifier: mainnetTokenIdentifiers.FRAX,
    nativeOnly: false,
    default: true,
    show: true,
  },
  FXS: {
    key: 'FXS',
    nativeNetwork: 'ethereum',
    symbol: 'FXS',
    name: 'FXS',
    icon: FXSIcon,
    iconColors: ['#454545', '#000'],
    decimals: 18,
    coinGeckoId: 'frax-share',
    tokenIdentifier: mainnetTokenIdentifiers.FXS,
    nativeOnly: false,
    default: true,
    show: true,
  },
  HBOT: {
    key: 'HBOT',
    nativeNetwork: 'ethereum',
    symbol: 'HBOT',
    name: 'Hummingbot',
    icon: HBOTIcon,
    iconColors: ['#00C2CE', '#02858A'],
    decimals: 18,
    coinGeckoId: 'hummingbot',
    tokenIdentifier: mainnetTokenIdentifiers.HBOT,
    nativeOnly: false,
    default: true,
    show: true,
  },
  MIM: {
    key: 'MIM',
    nativeNetwork: 'ethereum',
    symbol: 'MIM',
    name: 'Magic Internet Money',
    icon: MIMIcon,
    iconColors: ['#eae9fd', '#9795F9'],
    decimals: 18,
    coinGeckoId: 'magic-internet-money',
    tokenIdentifier: mainnetTokenIdentifiers.MIM,
    nativeOnly: false,
    show: false,
  },
  WSTR: {
    key: 'WSTR',
    nativeNetwork: 'ethereum',
    symbol: 'wSTR',
    name: 'Wrapped STR',
    icon: WSTRIcon,
    iconColors: ['#454545', '#000'],
    decimals: 18,
    coinGeckoId: 'wrapped-star',
    tokenIdentifier: mainnetTokenIdentifiers.WSTR,
    nativeOnly: false,
    show: false,
  },
  CQT: {
    key: 'CQT',
    nativeNetwork: 'ethereum',
    symbol: 'CQT',
    name: 'CQT',
    icon: CQTIcon,
    iconColors: ['#00D8D5', '#FF4C8B'],
    decimals: 18,
    coinGeckoId: 'covalent',
    tokenIdentifier: mainnetTokenIdentifiers.CQT,
    nativeOnly: false,
  },
  CARDS: {
    key: 'CARDS',
    nativeNetwork: 'ethereum',
    symbol: 'CARDS',
    name: 'Card Starter',
    icon: CARDSIcon,
    iconColors: ['#9AB4F1', '#0344de'],
    decimals: 18,
    coinGeckoId: 'cardstarter',
    tokenIdentifier: mainnetTokenIdentifiers.CARDS,
    nativeOnly: false,
  },
  C3: {
    key: 'C3',
    nativeNetwork: 'ethereum',
    symbol: 'C3',
    name: 'CHARLI3',
    icon: C3Icon,
    iconColors: ['#F4ACAB', '#E5302E'],
    decimals: 18,
    coinGeckoId: 'charli3',
    tokenIdentifier: mainnetTokenIdentifiers.C3,
    nativeOnly: false,
  },
  GERO: {
    key: 'GERO',
    nativeNetwork: 'ethereum',
    symbol: 'GERO',
    name: 'GeroWallet',
    icon: GEROIcon,
    iconColors: ['#54E09D', '#00A4AB'],
    decimals: 18,
    coinGeckoId: 'gerowallet',
    tokenIdentifier: mainnetTokenIdentifiers.GERO,
    nativeOnly: false,
  },
  renBTC: {
    key: 'renBTC',
    nativeNetwork: 'ethereum',
    symbol: 'renBTC',
    name: 'renBTC',
    icon: renBTCIcon,
    iconColors: ['#FBD9B0', '#f5a13b'],
    decimals: 8,
    coinGeckoId: 'renbtc',
    tokenIdentifier: mainnetTokenIdentifiers.renBTC,
    nativeOnly: false,
  },
  sBTC: {
    key: 'sBTC',
    nativeNetwork: 'ethereum',
    symbol: 'sBTC',
    name: 'Synth sBTC',
    icon: sBTCIcon,
    iconColors: ['#FBD9B0', '#f5a13b'],
    decimals: 18,
    coinGeckoId: 'sbtc',
    tokenIdentifier: mainnetTokenIdentifiers.sBTC,
    nativeOnly: false,
  },
  tBTC: {
    key: 'tBTC',
    nativeNetwork: 'ethereum',
    symbol: 'tBTC',
    name: 'tBTC v2',
    icon: tBTCIcon,
    iconColors: ['#FBD9B0', '#f5a13b'],
    decimals: 18,
    coinGeckoId: 'tbtc',
    tokenIdentifier: mainnetTokenIdentifiers.tBTC,
    nativeOnly: false,
  },
  HBTC: {
    key: 'HBTC',
    nativeNetwork: 'ethereum',
    symbol: 'HBTC',
    name: 'Huobi BTC',
    icon: HBTCIcon,
    iconColors: ['#54E09D', '#28266C'],
    decimals: 18,
    coinGeckoId: 'huobi-btc',
    tokenIdentifier: mainnetTokenIdentifiers.HBTC,
    nativeOnly: false,
  },
  CRO: {
    key: 'CRO',
    nativeNetwork: 'ethereum',
    symbol: 'CRO',
    name: 'Cronos Coin',
    icon: CROIcon,
    iconColors: ['#6879B7', '#1F3277'],
    decimals: 8,
    coinGeckoId: 'cronos',
    tokenIdentifier: mainnetTokenIdentifiers.CRO,
    nativeOnly: false,
    show: false,
  },
  UNI: {
    key: 'UNI',
    nativeNetwork: 'ethereum',
    symbol: 'UNI',
    name: 'Uniswap',
    icon: UNIIcon,
    iconColors: ['#FECFDD', '#FF007A'],
    decimals: 18,
    coinGeckoId: 'uniswap',
    tokenIdentifier: mainnetTokenIdentifiers.UNI,
    nativeOnly: false,
    show: false,
  },
  SHIB: {
    key: 'SHIB',
    nativeNetwork: 'ethereum',
    symbol: 'SHIB',
    name: 'Shiba Inu',
    icon: SHIBIcon,
    iconColors: ['#FFAD33', '#FF7A00'],
    decimals: 18,
    coinGeckoId: 'shiba-inu',
    tokenIdentifier: mainnetTokenIdentifiers.SHIB,
    nativeOnly: false,
    show: false,
  },
  LINK: {
    key: 'LINK',
    nativeNetwork: 'ethereum',
    symbol: 'LINK',
    name: 'Chainlink',
    icon: LINKIcon,
    iconColors: ['#A8BDF1', '#275ADD'],
    decimals: 18,
    coinGeckoId: 'chainlink',
    tokenIdentifier: mainnetTokenIdentifiers.LINK,
    nativeOnly: false,
    show: false,
  },
  MKR: {
    key: 'MKR',
    nativeNetwork: 'ethereum',
    symbol: 'MKR',
    name: 'Maker',
    icon: MKRIcon,
    iconColors: ['#D1EEEB', '#1BAB9B'],
    decimals: 18,
    coinGeckoId: 'maker',
    tokenIdentifier: mainnetTokenIdentifiers.MKR,
    nativeOnly: false,
    show: false,
  },
  COMP: {
    key: 'COMP',
    nativeNetwork: 'ethereum',
    symbol: 'COMP',
    name: 'Compound',
    icon: COMPIcon,
    iconColors: ['#CCF6E9', '#00D395'],
    decimals: 18,
    coinGeckoId: 'compound',
    tokenIdentifier: mainnetTokenIdentifiers.COMP,
    nativeOnly: false,
    show: false,
  },
  AAVE: {
    key: 'AAVE',
    nativeNetwork: 'ethereum',
    symbol: 'AAVE',
    name: 'Aave',
    icon: AAVEIcon,
    iconColors: ['#2EBAC6', '#B6509E'],
    decimals: 18,
    coinGeckoId: 'aave',
    tokenIdentifier: mainnetTokenIdentifiers.AAVE,
    nativeOnly: false,
    show: false,
  },
  TIC: {
    key: 'TIC',
    nativeNetwork: 'avalanche',
    symbol: 'TIC',
    name: 'Elastic Swap',
    icon: TICIcon,
    iconColors: ['#D29DFD', '#5560D4'],
    decimals: 18,
    coinGeckoId: 'elasticswap',
    tokenIdentifier: mainnetTokenIdentifiers.TIC,
    nativeOnly: false,
    show: false,
  },
  GEL: {
    key: 'GEL',
    nativeNetwork: 'ethereum',
    symbol: 'GEL',
    name: 'Gelato',
    icon: GELIcon,
    iconColors: ['#FFCCA4', '#FF7886'],
    decimals: 18,
    coinGeckoId: 'gelato',
    tokenIdentifier: mainnetTokenIdentifiers.GEL,
    nativeOnly: false,
    show: false,
  },
  APE: {
    key: 'APE',
    nativeNetwork: 'ethereum',
    symbol: 'APE',
    name: 'ApeCoin',
    icon: APEIcon,
    iconColors: ['#99B9F7', '#0251ED'],
    decimals: 9,
    coinGeckoId: 'apecoin',
    tokenIdentifier: mainnetTokenIdentifiers.APE,
    nativeOnly: false,
    show: false,
  },
  PBX: {
    key: 'PBX',
    nativeNetwork: 'ethereum',
    symbol: 'PBX',
    name: 'Paribus',
    icon: PBXIcon,
    iconColors: ['#03b1ea', '#8660fd'],
    decimals: 18,
    coinGeckoId: 'paribus',
    tokenIdentifier: mainnetTokenIdentifiers.PBX,
    nativeOnly: false,
    show: false,
  },
}
