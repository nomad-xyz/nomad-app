import { TokenIdentifier } from '@nomad-xyz/sdk/nomad'

export type MainnetNetwork = 'ethereum' | 'moonbeam' | 'milkomedac1'
export type TestnetNetwork =
  | 'kovan'
  | 'moonbasealpha'
  | 'rinkeby'
  | 'milkomedatestnet'
  | 'evmostestnet'

export type TokenMetadata = {
  nativeNetwork: MainnetNetwork | TestnetNetwork
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
  name: MainnetNetwork | TestnetNetwork
  displayName: string
  chainID: number // for metamask
  domainID: number // nomad domain ID
  rpcUrl: string
  nativeToken: TokenMetadata
  blockExplorer: string
  icon: string
  confirmationTimeInMinutes: number
}
