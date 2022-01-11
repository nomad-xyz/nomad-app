import wETHIcon from "@/assets/token-logos/WETH.png";
import USDTIcon from "@/assets/token-logos/USDT.png";
import USDCIcon from "@/assets/token-logos/USDC.png";
import DAIIcon from "@/assets/token-logos/DAI.png";
import DEVIcon from "@/assets/token-logos/DEV.png";

import { SdkBaseChainConfigParams } from "@connext/nxtp-sdk";

import mainnetTokens from "./tokens.main";
import { TokenMetadata, NetworkMetadata } from "./config.types";

export const tokens: { [key: string]: TokenMetadata } = {
  WETH: {
    nativeNetwork: "ethereum",
    symbol: "WETH",
    name: "WETH",
    icon: wETHIcon,
    iconColors: ["#C0CEF7", "#7594EE"],
    decimals: 18,
    coinGeckoId: "weth",
    tokenIdentifier: mainnetTokens.WETH,
    nativeOnly: false,
    minAmt: 0.0028,
  },
  ETH: {
    nativeNetwork: "ethereum",
    symbol: "ETH",
    name: "ETH",
    icon: wETHIcon,
    iconColors: ["#C0CEF7", "#7594EE"],
    decimals: 18,
    coinGeckoId: "ethereum",
    tokenIdentifier: mainnetTokens.WETH,
    nativeOnly: true,
    minAmt: 0.0028,
  },
  USDT: {
    nativeNetwork: "ethereum",
    symbol: "USDT",
    name: "USDT",
    icon: USDTIcon,
    iconColors: ["#fff", "#26A17B"],
    decimals: 6,
    coinGeckoId: "tether",
    tokenIdentifier: mainnetTokens.USDT,
    nativeOnly: false,
    minAmt: 10,
  },
  USDC: {
    nativeNetwork: "ethereum",
    symbol: "USDC",
    name: "USDC",
    icon: USDCIcon,
    iconColors: ["#fff", "#2976C9"],
    decimals: 6,
    coinGeckoId: "usd-coin",
    tokenIdentifier: mainnetTokens.USDC,
    nativeOnly: false,
    minAmt: 10,
  },
  DAI: {
    nativeNetwork: "ethereum",
    symbol: "DAI",
    name: "DAI",
    icon: DAIIcon,
    iconColors: ["#f0bf54", "#F4B731"],
    decimals: 18,
    coinGeckoId: "dai",
    tokenIdentifier: mainnetTokens.DAI,
    nativeOnly: false,
    minAmt: 10,
  },
  GLMR: {
    nativeNetwork: "moonbeam",
    symbol: "GLMR",
    name: "GLMR",
    icon: DEVIcon,
    iconColors: ["#53CBC8", "#e84195"],
    decimals: 18,
    coinGeckoId: "moonbeam",
    tokenIdentifier: mainnetTokens.WGLMR,
    nativeOnly: true,
    minAmt: 10,
  },
};

// default confirmation time for prod, set on each network below
const PROD_DEFAULT_CONFIRMATION_TIME_IN_MINUTES = 30;

export const networks: { [key: string]: NetworkMetadata } = {
  ethereum: {
    name: "ethereum",
    chainID: 1,
    domainID: 6648936,
    rpcUrl:
      "https://eth-mainnet.alchemyapi.io/v2/giUxguFsfUQIJMYN86WVn5OQn1rIPQoY",
    nativeToken: tokens.ETH,
    blockExplorer: "https://etherscan.io/",
    icon: wETHIcon,
    confirmationTimeInMinutes: PROD_DEFAULT_CONFIRMATION_TIME_IN_MINUTES,
  },
  moonbeam: {
    name: "moonbeam",
    chainID: 1284,
    domainID: 1650811245,
    rpcUrl:
      "https://moonbeam-api.us-east-1.bwarelabs.com/5dc337ad-29bc-4ccc-be11-c505107d2838",
    nativeToken: tokens.GLMR,
    blockExplorer: "https://blockscout.moonbeam.network/",
    icon: DEVIcon,
    confirmationTimeInMinutes: PROD_DEFAULT_CONFIRMATION_TIME_IN_MINUTES,
  },
};

export const connextPools: { [key: string]: string[] } = {
  moonbeam: ["WETH", "USDC", "USDT", "DAI"],
  ethereum: ["WETH", "USDC", "USDT", "DAI"],
};

export const connextConfig: SdkBaseChainConfigParams = {
  1: {
    // ethereum mainnet
    providers: [
      "https://eth-mainnet.alchemyapi.io/v2/rud551ngiIel2fRYbWmsnhwAE1FGgCLG",
    ],
  },
  1284: {
    // moonbeam mainnet
    providers: [
      "https://moonbeam.api.onfinality.io/rpc?apikey=499ab348-13c8-4f4e-bebd-ce2af1141d74",
      "https://moonbeam.api.onfinality.io/public",
      "https://rpc.api.moonbeam.network",
    ],
  },
};