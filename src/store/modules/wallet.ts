/**
 * Wallet Module contains most information that comes from a user's wallet
 * This is also a good module to look at for how to write a Vuex module
 */
import { MutationTree, ActionTree } from 'vuex'
import { BigNumber } from 'ethers'
import { TokenIdentifier } from '@nomad-xyz/sdk/nomad'

import { RootState } from '@/store'
import * as types from '@/store/mutation-types'
import { fromBytes32, getNetworkByChainID, nullToken } from '@/utils'
import { networks, tokens } from '@/config'
import { MainnetNetwork, TestnetNetwork } from '@/config/config.types'
import { getWalletProvider, WalletType, resetWallet } from '@/utils/wallet'

export interface WalletState {
  connected: boolean
  address: string
  type: WalletType | undefined
  showConnectWalletModal: boolean
}

type TokenPayload = {
  network: MainnetNetwork | TestnetNetwork
  tokenId: TokenIdentifier
}

const state = (): WalletState => ({
  connected: false,
  address: localStorage.getItem('wallet_address') || '',
  type:
    (localStorage.getItem('wallet_type') as unknown as WalletType) || undefined,
  showConnectWalletModal: false,
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

  [types.SET_WALLET_TYPE](state: WalletState, type: WalletType) {
    console.log('{dispatch} set wallet type: ', type)
    state.type = type
    localStorage.setItem('wallet_type', `${type}`)
  },

  [types.SET_SHOW_CONNECT_WALLET_MODAL](
    state: WalletState,
    showConnectWalletModal: boolean
  ) {
    console.log(
      '{dispatch} set show connect wallet modal: ',
      showConnectWalletModal
    )
    state.showConnectWalletModal = showConnectWalletModal
  },
}

const actions = <ActionTree<WalletState, RootState>>{
  async connectWallet(
    { dispatch, commit, state, rootState },
    walletType?: WalletType
  ) {
    // check if already connected
    if (state.connected) {
      console.log('already connected to wallet')
      return
    }

    // don't know which type of wallet to connect to in this scenario
    if (!walletType && !state.type) return

    const provider = await getWalletProvider(walletType || state.type)

    // enable session
    try {
      await provider.enable()
    } catch (e) {
      resetWallet()
      localStorage.removeItem('wallet_type')
      console.error(e)
    }

    provider.listen('chainChanged', async (chainId: number) => {
      console.log('network change')
      // get name of network and set in store
      const id = BigNumber.from(chainId).toNumber()
      const network = getNetworkByChainID(id)
      if (network) {
        // network supported, setting wallet network
        await dispatch('setWalletNetwork', network.name)
        await dispatch('setDestinationNetwork', '')
      } else {
        // network not supported, clearing network
        await dispatch('setWalletNetwork', '')
      }
      // TODO: update token? balance, etc
    })

    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    dispatch('setWalletAddress', address)
    dispatch('setDestinationAddress', address, { root: true }) // initialize destination address

    // set network, if supported
    const { chainId } = await provider.ready
    const network =
      rootState.userInput.originNetwork || getNetworkByChainID(chainId)?.name
    if (network) {
      dispatch('setWalletNetwork', network)
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

  openConnectWalletModal({ commit }) {
    commit(types.SET_SHOW_CONNECT_WALLET_MODAL, true)
  },

  closeConnectWalletModal({ commit }) {
    commit(types.SET_SHOW_CONNECT_WALLET_MODAL, false)
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
    let provider

    const network = networks[networkName]
    const hexChainId = '0x' + network.chainID.toString(16)

    if (!state.connected) {
      dispatch('openConnectWalletModal')

      // set wallet network before returning so we
      // can set this network later in connectWallet
      dispatch('setWalletNetwork', network.name)
      return
    } else {
      provider = await getWalletProvider(state.type)
    }

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
    let provider

    if (!state.connected) {
      provider = await dispatch('connectWallet')
    } else {
      provider = await getWalletProvider(state.type)
    }
    await dispatch('switchNetwork', payload.network)

    const { address } = await rootGetters.resolveRepresentation(
      payload.network,
      payload.tokenId
    )

    let token
    const tokenId = fromBytes32(payload.tokenId.id as string)
    for (const t in tokens) {
      if (tokens[t].tokenIdentifier.id === tokenId) {
        token = tokens[t]
      }
    }

    if (!token) return false

    const wasAdded = provider.request({
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
  },
}

export default {
  state,
  mutations,
  actions,
}
