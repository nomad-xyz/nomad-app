import { TokenIdentifier } from '@nomad-xyz/sdk/nomad'

export type MainnetNetwork = 'ethereum' | 'moonbeam'
export type TestnetNetwork = 'kovan' | 'moonbasealpha' | 'rinkeby' | 'milkomedatestnet'

export type TokenMetadata = {
  nativeNetwork: MainnetNetwork | TestnetNetwork
  symbol: string
  name: string
  icon: string
  iconColors?: string[]
  decimals: number
  coinGeckoId: string
  tokenIdentifier: TokenIdentifier
  nativeOnly: boolean
  minAmt: number
}

export type NetworkMetadata = {
  name: MainnetNetwork | TestnetNetwork
  chainID: number // for metamask
  domainID: number // nomad domain ID
  rpcUrl: string
  nativeToken: TokenMetadata
  blockExplorer: string
  icon: string
  confirmationTimeInMinutes: number
}
