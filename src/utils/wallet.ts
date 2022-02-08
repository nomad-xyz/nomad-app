import { getMetamaskProvider } from '@/utils/metamask'
import { getWalletConnectProvider } from '@/utils/walletConnect'
import { Signer } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'

const ethereumEnable = async () => {
  const { ethereum } = window
  if (!ethereum) return
  await ethereum.request({ method: 'eth_requestAccounts' })
}

export enum WalletType {
  Metamask = 1,
  WalletConnect = 2,
}

// Not sure the best way to type this is yet
// we use the shared methods between metamask (window.ethereum)
// and ethersjs web3provider wrapped walletConnect
type Wallet = Partial<Record<string, unknown>> & {
  enable: () => Promise<void | string[]>
  request: (args: any) => Promise<any>
  getSigner: () => Promise<Signer>
  ready: Promise<Record<string, unknown> & { chainId: number }>
  customOn: (eventName: string, listener: any) => void
}

let wallet: Wallet | undefined

export async function getWalletProvider(walletType?: WalletType): Promise<Wallet> {
  if (wallet) return wallet

  let provider: any

  if (walletType === WalletType.Metamask) {
    provider = await getMetamaskProvider()

    wallet = provider as any
    wallet!.enable = ethereumEnable
    wallet!.request = window.ethereum.request

    // NOTE: Need to wrap this in a function for some reason
    // just doing wallet.on = window.ethereum.on does not work.
    // Also, the web3Provider.on method should not be overridden
    wallet!.customOn = (evt: string, listener: () => void) => {
      window.ethereum.on(evt, listener)
    }
  } else if (walletType === WalletType.WalletConnect) {
    provider = await getWalletConnectProvider()

    // wallet connect provider does not have the web3 provider functions
    const web3Provider = new Web3Provider(provider)

    wallet = web3Provider as any
    wallet!.enable = provider.enable
    wallet!.request = provider.request

    wallet!.customOn = provider.on
  }

  return wallet!
}

export async function resetWallet() {
  wallet = undefined
}
