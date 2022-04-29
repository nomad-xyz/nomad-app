/**
 * Wallet Module contains most information that comes from a user's wallet
 * This is also a good module to look at for how to write a Vuex module
 */
import { MutationTree, ActionTree } from 'vuex'
import { providers, BigNumber } from 'ethers'
import { RootState } from '@/store'
import * as types from '@/store/mutation-types'
import { networks } from '@/config'
import { getNetworkByChainID, nullToken } from '@/utils'
import { TokenIdentifier } from '@nomad-xyz/sdk-bridge'
import { NetworkName } from '@/config/types'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

// defined from docs here: https://docs.metamask.io/guide/ethereum-provider.html#errors
interface ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

export interface WalletState {
  connected: boolean
  address: string
}

type TokenPayload = {
  network: NetworkName
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
    console.log('connecting wallet')

    // check if already connected
    if (state.connected) {
      console.log('already connected to wallet')
      return
    }

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: process.env.VUE_APP_INFURA_KEY, // required
        },
      },
    }

    const web3Modal = new Web3Modal({
      providerOptions, // required
      cacheProvider: false,
      theme: 'dark',
    })

    const instance = await web3Modal.connect()
    const provider = new providers.Web3Provider(instance)
    const signer = provider.getSigner()

    provider.on('chainChanged', async (chainId: number) => {
      console.log('network change')
      // get name of network and set in store
      const id = BigNumber.from(chainId).toNumber()
      const network = getNetworkByChainID(id)
      if (network) {
        // network supported, setting wallet network
        await dispatch('setWalletNetwork', network.name)
      } else {
        // network not supported, clearing network
        await dispatch('setWalletNetwork', '')
      }
      // TODO: update token? balance, etc
    })

    provider.on('accountsChanged', () => {
      // everything changes, easiest to reload
      location.reload()
    })

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
    dispatch('instantiateConnext', signer)
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
    } catch (switchError: unknown) {
      // This error code indicates that the chain has not been added to MetaMask.
      if ((switchError as ProviderRpcError).code === 4902) {
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
      } else {
        throw switchError
      }
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

    const wasAdded = await window.ethereum.request({
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
