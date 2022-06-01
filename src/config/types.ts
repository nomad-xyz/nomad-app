import { TokenIdentifier } from '@nomad-xyz/sdk-bridge'

export type NetworkName = string

export type TokenIdentifierMap = { [key: string]: TokenIdentifier }
export type TokenMetadataMap = { [key: string]: TokenMetadata }
export type NetworkMap = { [key: string]: NetworkMetadata }

export type TokenMetadata = {
  nativeNetwork: NetworkName
  symbol: string
  name: string
  icon: string
  iconColors?: [string, string]
  decimals: number
  coinGeckoId: string
  tokenIdentifier: TokenIdentifier | null
  nativeOnly: boolean
  minAmt: number
  wrappedAsset?: string
}

export type NetworkMetadata = {
  name: NetworkName
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

export type IndexerTx = {
  origin: number
  destination: number
  leafIndex: string
  sender: string
  state: number
  dispatchedAt: number
  updatedAt: number
  relayedAt: number
  processedAt: number
  receivedAt: number
  tx: string
  amount: string
  tokenDomain: number
  tokenId: string
  confirmAt: number
}
