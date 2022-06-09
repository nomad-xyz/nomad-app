import { SdkBaseChainConfigParams } from '@connext/nxtp-sdk'
import { NetworkMetadata, NetworkMap, TokenMetadataMap } from '@/config/types'
import AVAXIcon from '@/assets/token-logos/AVAX.png'

export const config = await import('@nomad-xyz/sdk-bridge').then(
  async ({ BridgeContext }) => {
    const { conf } = await BridgeContext.fetch(
      process.env.VUE_APP_NOMAD_ENVIRONMENT,
      false
    )
    return conf
  }
)

const {
  VUE_APP_ETHEREUM_RPC,
  VUE_APP_MOONBEAM_RPC,
  VUE_APP_MILKOMEDA_RPC,
  VUE_APP_EVMOS_RPC,
  VUE_APP_RINKEBY_RPC,
  VUE_APP_KOVAN_RPC,
  VUE_APP_GOERLI_RPC,
  VUE_APP_EVMOS_TESTNET_RPC,
  VUE_APP_MOONBASEALPHA_RPC,
  VUE_APP_MILKOMEDA_TESTNET_RPC,
  VUE_APP_XDAI_RPC,
  VUE_APP_AVALANCHE_RPC,
} = process.env

const rpcs: { [key: string]: string[] } = {
  ethereum: [VUE_APP_ETHEREUM_RPC],
  moonbeam: [
    VUE_APP_MOONBEAM_RPC,
    'https://moonbeam.api.onfinality.io/public',
    'https://rpc.api.moonbeam.network',
  ],
  milkomedaC1: [VUE_APP_MILKOMEDA_RPC],
  rinkeby: [VUE_APP_RINKEBY_RPC],
  kovan: [VUE_APP_KOVAN_RPC],
  goerli: [VUE_APP_GOERLI_RPC],
  evmos: [VUE_APP_EVMOS_RPC],
  moonbasealpha: [VUE_APP_MOONBASEALPHA_RPC],
  milkomedatestnet: [VUE_APP_MILKOMEDA_TESTNET_RPC],
  xdai: [VUE_APP_XDAI_RPC],
  evmostestnet: [VUE_APP_EVMOS_TESTNET_RPC],
  avalanche: [VUE_APP_AVALANCHE_RPC],
}

export const getConnextConfig = (
  ethereumRPCs: string[]
): SdkBaseChainConfigParams => {
  const connextConfig: SdkBaseChainConfigParams = {}

  Object.keys(config.bridgeGui).forEach((networkName) => {
    if (config.bridgeGui[networkName].connextEnabled) {
      const { chainId } = config.protocol.networks[networkName].specs

      connextConfig[chainId] = {
        providers: rpcs[networkName] || config.rpcs[networkName],
      }
    }
  })

  if (!connextConfig[1]) {
    // must have Ethereum for some reason
    connextConfig[1] = {
      providers: ethereumRPCs,
    }
  }

  return connextConfig
}

export const getNetworksConfig = (tokens: TokenMetadataMap): NetworkMap => {
  const networks: NetworkMap = {}

  Object.keys(config.bridgeGui).forEach((networkName) => {
    const { displayName, nativeTokenSymbol, connections, manualProcessing } =
      config.bridgeGui[networkName]
    const nativeToken = tokens[nativeTokenSymbol]
    const { name, domain: domainID } = config.protocol.networks[networkName]
    const { chainId: chainID, blockExplorer } =
      config.protocol.networks[networkName].specs
    // use env values if available, else use rpcs provided by config
    const networkRPCs = rpcs[networkName] || config.rpcs[networkName]
    const rpcUrl = networkRPCs[0] // only 1 supported at the moment in the sdk
    const { optimisticSeconds } =
      config.protocol.networks[networkName].configuration
    const icon = nativeToken ? nativeToken.icon : ''

    networks[networkName] = {
      name,
      icon,
      rpcUrl,
      chainID,
      domainID,
      displayName,
      nativeToken,
      connections,
      blockExplorer,
      manualProcessing,
      optimisticSeconds,
    } as NetworkMetadata
  })

  // Add avalanche icon because it doesn't have native asset listed
  if (networks.avalanche) {
    networks.avalanche.icon = AVAXIcon
  }

  return networks
}
