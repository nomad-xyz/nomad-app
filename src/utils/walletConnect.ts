import WalletConnectProvider from '@walletconnect/web3-provider'
import { walletConnectRPCConfig } from '@/config/config.main'

export async function getWalletConnectProvider() {
  // Create WalletConnect Provider
  const provider = new WalletConnectProvider({
    rpc: walletConnectRPCConfig,
  })
  await provider.ready
  return provider
}
