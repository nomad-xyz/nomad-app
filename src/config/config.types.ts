import { TokenIdentifier } from '@nomad-xyz/sdk/nomad'

export type MainnetNetwork = 'ethereum' | 'moonbeam' | 'milkomedaC1'
export type TestnetNetwork =
  | 'kovan'
  | 'moonbasealpha'
  | 'rinkeby'
  | 'milkomedatestnet'
  | 'evmostestnet'
export type NetworkName = MainnetNetwork | TestnetNetwork

export type TokenMetadata = {
  nativeNetwork: NetworkName
  symbol: string
  name: string
  icon: string
  iconColors?: string[]
  decimals: number
  coinGeckoId: string
  tokenIdentifier: TokenIdentifier | null
  nativeOnly: boolean
  minAmt: number
}

export type NetworkMetadata = {
  name: NetworkName
  displayName: string
  connections: NetworkName[]
  chainID: number // for metamask
  domainID: number // nomad domain ID
  rpcUrl: string
  nativeToken: TokenMetadata
  blockExplorer: string
  icon: string
  confirmationTimeInMinutes: number
}
