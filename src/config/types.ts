import { TokenIdentifier } from '@nomad-xyz/sdk-bridge'

export type NetworkName = string

export type TokenIdentifierMap = { [key: string]: TokenIdentifier }
export type TokenMetadataMap = { [key: string]: TokenMetadata }
export type NetworkMap = { [key: string]: NetworkMetadata }

export type TokenMetadata = {
  key: NetworkName // must match key
  nativeNetwork: NetworkName
  symbol: string
  name: string
  icon: string
  iconColors?: [string, string]
  decimals: number
  coinGeckoId: string
  tokenIdentifier: TokenIdentifier | null
  nativeOnly: boolean
  wrappedAsset?: string
}

export type NetworkMetadata = {
  name: NetworkName // must match key
  displayName: string
  connections: NetworkName[]
  chainID: number // for wallet
  domainID: number // nomad domain ID
  rpcUrl: string
  nativeToken: TokenMetadata
  blockExplorer: string
  icon: string
  optimisticSeconds: number
  manualProcessing: boolean
}
