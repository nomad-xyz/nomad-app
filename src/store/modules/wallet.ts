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
    localStorage.setItem('wallet_type', type)
  },
}

const actions = <ActionTree<WalletState, RootState>>{
  async connectWallet({ dispatch, commit, state}, walletType?: string) {
    // check if already connected
    if (state.connected) {
      console.log('already connected to wallet')
      return
    }

    // don't know which type of wallet to connect to in this scenario
    if (!walletType && !state.type) return

    const provider = await getWalletProvider(walletType || state.type)

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

    return provider
  },

  setWalletAddress({ commit }, address: string) {
    commit(types.SET_WALLET_ADDRESS, address)
  },

  // when user changes network
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
    console.log('set wallet network:')
    let provider; 

    if (!state.connected) {
      provider = await dispatch('connectWallet')
    } else {
      provider = await getWalletProvider(state.type)
    }

    const network = networks[networkName]
    const hexChainId = '0x' + network.chainID.toString(16)
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      })
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
