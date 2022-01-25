/**
 * Wallet Module contains most information that comes from a user's wallet
 * This is also a good module to look at for how to write a Vuex module
 */
import { MutationTree, ActionTree } from 'vuex'
import { RootState } from '@/store'
import * as types from '@/store/mutation-types'
import { networks } from '@/config/index'
import { fromBytes32, getNetworkByChainID, nullToken } from '@/utils'
import { TokenIdentifier } from '@nomad-xyz/sdk/nomad'
import { tokens } from '@/config'
import { MainnetNetwork, TestnetNetwork } from '@/config/config.types'
import { getWalletConnectProvider } from '@/utils/walletConnect'
import { getWalletProvider } from '@/utils/wallet'

export interface WalletState {
  connected: boolean
  address: string
  type: string
}

type TokenPayload = {
  network: MainnetNetwork | TestnetNetwork,
  tokenId: TokenIdentifier
}

const state = (): WalletState => ({
  connected: false,
  address: localStorage.getItem('wallet_address') || '',
  type: ''
})

const mutations = <MutationTree<WalletState>>{
  [types.SET_WALLET_CONNECTION](state: WalletState, connected: boolean) {
    console.log('{dispatch} set wallet connection: ', connected)
    state.connected = connected
  },

  [types.SET_WALLET_ADDRESS](state: WalletState, address: string) {
    console.log('{dispatch} set wallet address: ', address)
    state.address = address
    localStorage.setItem('wallet_address', address)
  },

  [types.SET_WALLET_TYPE](state: WalletState, type: string) {
    console.log('{dispatch} set wallet type: ', type)
    state.type = type
  }
}

const actions = <ActionTree<WalletState, RootState>>{
  async connectWallet({ dispatch, commit, state}, walletType?: string) {
    // check if already connected
    if (state.connected) {
      console.log('already connected to wallet')
      return
    }

    const provider = await getWalletProvider(walletType || state.type)

    console.log(provider, provider.enable)

    // enable session
    await provider.enable()

    const signer = await provider.getSigner()

    const address = await signer.getAddress()
    dispatch('setWalletAddress', address)
    dispatch('setDestinationAddress', address, { root: true }) // initialize destination address

    // set network, if supported
    const { chainId } = await provider.ready
    const network = getNetworkByChainID(chainId)
    if (network) {
      dispatch('setWalletNetwork', network.name)
    } else {
      console.log('network not supported')
    }

    // set wallet type if passed in, otherwise should already be set
    if (walletType) {
      commit(types.SET_WALLET_TYPE, walletType)
    }

    // wallet connected
    commit(types.SET_WALLET_CONNECTION, true)
  },

  // async connectWalletConnectWallet({ dispatch, commit, state }) {
  //   // check if already connected
  //   if (state.connected) {
  //     console.log('already connected to wallet')
  //     return
  //   }

  //   const provider = await getWalletConnectProvider()

  //   //  Enable session (triggers QR Code modal)
  //   await provider.enable();

  //   // wrap in ethers web 3 provider to use below
  //   const web3provider = new providers.Web3Provider(provider)

  //   const signer = await web3provider.getSigner()

  //   // get and set address
  //   const address = await signer.getAddress()
  //   dispatch('setWalletAddress', address)
  //   dispatch('setDestinationAddress', address, { root: true }) // initialize destination address

  //   // set network, if supported
  //   const { chainId } = await web3provider.ready
  //   const network = getNetworkByChainID(chainId)
  //   if (network) {
  //     dispatch('setWalletNetwork', network.name)
  //   } else {
  //     console.log('network not supported')
  //   }

  //   // wallet connected
  //   commit(types.SET_WALLET_CONNECTION, true)
  // },
  // async connectMetamaskWallet({ dispatch, commit, state }) {
  //   // check if already connected
  //   if (state.connected) {
  //     console.log('already connected to wallet')
  //     return
  //   }

  //   // if window.ethereum does not exist, do not connect
  //   const { ethereum } = window
  //   if (!ethereum) return

  //   // connect Metamask
  //   ethereum.enable()

  //   // commented out in favor of enable() to keep api consistent
  //   // with wallet connect usage to make consolidating easier
  //   // await window.ethereum.request({ method: 'eth_requestAccounts' })

  //   // get provider/signer
  //   const provider = await mmUtils.getMetamaskProvider()
  //   const signer = await provider.getSigner()

  //   // get and set address
  //   const address = await signer.getAddress()
  //   dispatch('setWalletAddress', address)
  //   dispatch('setDestinationAddress', address, { root: true }) // initialize destination address

  //   // set network, if supported
  //   const { chainId } = await provider.ready
  //   const network = getNetworkByChainID(chainId)
  //   if (network) {
  //     dispatch('setWalletNetwork', network.name)
  //   } else {
  //     console.log('network not supported')
  //   }

  //   // wallet connected
  //   commit(types.SET_WALLET_CONNECTION, true)
  // },

  setWalletAddress({ commit }, address: string) {
    commit(types.SET_WALLET_ADDRESS, address)
  },

  // when user changes network in Metamask
  setWalletNetwork({ commit, dispatch, rootState }, networkName: string) {
    dispatch('setOriginNetwork', networkName)

    const { token } = rootState.userInput

    // if token has not been selected, no further action required
    if (!token.symbol) return

    // if token is not available on network, clear token and balance
    if (token.nativeOnly && token.nativeNetwork !== networkName) {
      commit(types.SET_TOKEN, nullToken)
      commit(types.SET_BALANCE, null)
      return
    }

    // if token is selected and available on new network, get balance
    dispatch('getBalanceFromWallet')
  },

  async switchNetwork({ dispatch, state }, networkName: string) {
    console.log('set wallet network')
    if (!state.connected) {
      await dispatch('connectWallet')
    }

    const provider = await getWalletConnectProvider() as any
    // const web3provider = new providers.Web3Provider(provider)


    // if window.ethereum does not exist, do not instantiate nomad
    // const { ethereum } = window
    // if (!ethereum) return

    const network = networks[networkName]
    const hexChainId = '0x' + network.chainID.toString(16)
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      })
      // await ethereum.request({
      //   method: 'wallet_switchEthereumChain',
      //   params: [{ chainId: hexChainId }],
      // })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: hexChainId,
                rpcUrls: [network.rpcUrl],
                chainName: network.name,
                nativeCurrency: {
                  name: network.nativeToken.name,
                  symbol: network.nativeToken.symbol,
                  decimals: network.nativeToken.decimals,
                },
              },
            ],
          })
        } catch (addError: unknown) {
          // TODO: handle "add" error, alert?
          console.error(addError)
          throw addError
        }
      }
      console.error(switchError)
      throw switchError
      // TODO: handle other "switch" errors, alert?
    }

    dispatch('setWalletNetwork', network.name)
  },

  async addToken({ dispatch, state, rootGetters }, payload: TokenPayload) {
    if (!state.connected) {
      await dispatch('connectWallet')
    }
    await dispatch('switchNetwork', payload.network)

    const { address } = await rootGetters.resolveRepresentation(
      payload.network,
      payload.tokenId,
    )

    let token
    const tokenId = fromBytes32(payload.tokenId.id as string)
    for (const t in tokens) {
      if (tokens[t].tokenIdentifier.id === tokenId) {
        token = tokens[t]
      }
    }

    if (!token) return false

    const wasAdded = await (window as any).ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address,
          symbol: token.symbol,
          decimals: token.decimals,
          image: token.icon,
        },
      },
    })
  
    return !!wasAdded
  }
}

export default {
  state,
  mutations,
  actions,
}
