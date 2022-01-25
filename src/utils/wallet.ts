import { getMetamaskProvider } from '@/utils/metamask'
import { getWalletConnectProvider } from '@/utils/walletConnect'
import { Web3Provider } from '@ethersproject/providers'
import { providers } from 'ethers'

const ethereumEnable = () => {
  const { ethereum } = window
  if (!ethereum) return
  ethereum.enable()
}

export const WALLET = {
  METAMASK: 'METAMASK',
  WALLETCONNECT: 'WALLETCONNECT'
}

let wallet: any = null

const copyOf = (o: Record<string, unknown>) => {
  return { ...o }
}

export async function getWalletProvider(walletType: string): Promise<any> {
  if (wallet) return wallet

  let provider

  console.log('walletType', walletType)

  if (walletType === WALLET.METAMASK) {
    provider = await getMetamaskProvider()
    console.log('provider.getSigner', provider.getSigner)
    wallet = provider
    wallet.enable = ethereumEnable
  } else if (walletType === WALLET.WALLETCONNECT) {
    provider = await getWalletConnectProvider()

    // wallet connect provider does not have the web3 provider functions
    const web3Provider = new providers.Web3Provider(provider)

    wallet = web3Provider
    wallet.enable = provider.enable
  }

  console.log('wallet', wallet)

  return wallet
}
