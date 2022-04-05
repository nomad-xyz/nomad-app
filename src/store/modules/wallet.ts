/**
 * Wallet Module contains most information that comes from a user's wallet
 * This is also a good module to look at for how to write a Vuex module
 */
import { MutationTree, ActionTree } from 'vuex'
import { RootState } from '@/store'
import * as types from '@/store/mutation-types'
import { networks } from '@/config/index'
import * as mmUtils from '@/utils/metamask'
import { getNetworkByChainID, nullToken } from '@/utils'
import { TokenIdentifier } from '@nomad-xyz/sdk-bridge'
import { MainnetNetwork, TestnetNetwork } from '@/config/config.types'

export interface WalletState {
  connected: boolean
  address: string
}

type TokenPayload = {
  network: MainnetNetwork | TestnetNetwork
  tokenId: TokenIdentifier
}

const state = (): WalletState => ({
  connected: false,
  address: localStorage.getItem('wallet_address') || '',
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
}

const actions = <ActionTree<WalletState, RootState>>{
  async connectWallet({ dispatch, commit, state }) {
    // check if already connected
    if (state.connected) {
      console.log('already connected to wallet')
      return
    }

    // if window.ethereum does not exist, do not connect
    const { ethereum } = window
    if (!ethereum) return

    // connect Metamask
    await window.ethereum.request({ method: 'eth_requestAccounts' })

    // get provider/signer
    const provider = await mmUtils.getMetamaskProvider()
    const signer = await provider.getSigner()

    // get and set address
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

    // wallet connected
    commit(types.SET_WALLET_CONNECTION, true)
  },

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

    // if window.ethereum does not exist, do not instantiate nomad
    const { ethereum } = window
    if (!ethereum) return

    const network = networks[networkName]
    const hexChainId = '0x' + network.chainID.toString(16)
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
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

    const token = await rootGetters.resolveRepresentation(
      payload.network,
      payload.tokenId
    )
    const symbol = await token.symbol()
    const decimals = await token.decimals()

    const wasAdded = await (window as any).ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: token.address,
          symbol,
          decimals,
        },
      },
    })

    return !!wasAdded
  },
}

export default {
  state,
  mutations,
  actions,
}
