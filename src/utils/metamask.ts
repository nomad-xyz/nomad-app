import { Web3Provider } from '@ethersproject/providers'
import { getNetworkByChainID } from './index'
import { NetworkName } from '@/config/types'

export async function getMetamaskProvider(): Promise<Web3Provider> {
  // Connect to metamask
  const provider = new Web3Provider(window.ethereum)
  await provider.ready
  const signer = provider.getSigner()
  console.log({ provider, signer })
  return Promise.resolve(provider)
}

export async function getNetwork(provider: Web3Provider): Promise<NetworkName> {
  const { chainId, name } = await provider.ready
  const network = getNetworkByChainID(chainId) || { name }
  return network.name
}
