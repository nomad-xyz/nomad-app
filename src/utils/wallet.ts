import { getMetamaskProvider } from '@/utils/metamask'
import { getWalletConnectProvider } from '@/utils/walletConnect'
import { Web3Provider } from '@ethersproject/providers'

const ethereumEnable = async () => {
  const { ethereum } = window
  if (!ethereum) return
  await ethereum.request({ method: 'eth_requestAccounts' })
}

export const WALLET = {
  METAMASK: 'METAMASK',
  WALLETCONNECT: 'WALLETCONNECT'
}

let wallet: any = null

export async function getWalletProvider(walletType?: string): Promise<any> {
  if (wallet) return wallet
  if (!wallet && !walletType) return

  let provider

  console.log('walletType', walletType)

  if (walletType === WALLET.METAMASK) {
    provider = await getMetamaskProvider()
    wallet = provider
    wallet.enable = ethereumEnable
    wallet.request = window.ethereum.request
  } else if (walletType === WALLET.WALLETCONNECT) {
    provider = await getWalletConnectProvider()

    // wallet connect provider does not have the web3 provider functions
    const web3Provider = new Web3Provider(provider)

    wallet = web3Provider
    wallet.enable = provider.enable
    wallet.request = provider.request
  }

  console.log('wallet', wallet)

  return wallet
}
