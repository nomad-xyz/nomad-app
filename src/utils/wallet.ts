import { getMetamaskProvider } from '@/utils/metamask'
import { getWalletConnectProvider } from '@/utils/walletConnect'
import { Signer } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'

const ethereumEnable = async () => {
  const { ethereum } = window
  if (!ethereum) return
  await ethereum.request({ method: 'eth_requestAccounts' })
}

export const WALLET = {
  METAMASK: 'METAMASK',
  WALLETCONNECT: 'WALLETCONNECT',
}

// Not sure the best way to type this is yet
// we use the shared methods between metamask (window.ethereum)
// and ethersjs web3provider wrapped walletConnect
type Wallet = Partial<Record<string, unknown>> & {
  enable: () => Promise<void | string[]>
  request: (args: any) => Promise<any>
  getSigner: () => Promise<Signer>
  ready: Promise<Record<string, unknown> & { chainId: number}>
}

let wallet: Wallet

export async function getWalletProvider(walletType?: string): Promise<Wallet> {
  if (wallet) return wallet

  let provider

  if (walletType === WALLET.METAMASK) {
    provider = await getMetamaskProvider()

    wallet = provider as any
    wallet.enable = ethereumEnable
    wallet.request = window.ethereum.request
  } else if (walletType === WALLET.WALLETCONNECT) {
    provider = await getWalletConnectProvider()

    // wallet connect provider does not have the web3 provider functions
    const web3Provider = new Web3Provider(provider)

    wallet = web3Provider as any
    wallet.enable = provider.enable
    wallet.request = provider.request
  }

  console.log('getWalletProvider', wallet)

  return wallet
}
