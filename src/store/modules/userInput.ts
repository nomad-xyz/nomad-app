/**
 * UserInput Module contains the user-inputed information gathered for
 * submission. Rather than dealing with emits and props between many components
 * handling them in the store makes it easier to deal with data changes
 */
import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { RootState } from '@/store'
import * as types from '@/store/mutation-types'
import { BigNumber } from 'ethers'
import { TokenMetadata } from '@/config/config.types'
import { nullToken } from '@/utils'

export interface UserInputState {
  destinationAddress: string
  sendAmount: number
  originNetwork: string
  destinationNetwork: string
  token: TokenMetadata
  gasEst: BigNumber | null
}

const state: UserInputState = {
  destinationAddress: '',
  sendAmount: 0,
  originNetwork: '',
  destinationNetwork: '',
  token: nullToken,
  gasEst: null,
}

const mutations = <MutationTree<UserInputState>>{
  [types.SET_DESTINATION_ADDRESS](state: UserInputState, address: string) {
    console.log('{dispatch} set destination address: ', address)
    state.destinationAddress = address
  },

  // Amount comes in as a number. We should store it as a number
  [types.SET_SEND_AMOUNT](state: UserInputState, amount: number) {
    console.log('{dispatch} set send amount: ', amount)
    state.sendAmount = amount
  },

  [types.SET_ORIGIN_NETWORK](state: UserInputState, network: string) {
    console.log('{dispatch} set origin network: ', network)
    state.originNetwork = network
  },

  [types.SET_DESTINATION_NETWORK](state: UserInputState, network: string) {
    console.log('{dispatch} set destination network: ', network)
    state.destinationNetwork = network
  },

  [types.SET_TOKEN](state: UserInputState, token: TokenMetadata) {
    console.log('{dispatch} set token: ', token)
    state.token = token
  },
  [types.SET_GAS_EST](state: UserInputState, priceEst: BigNumber) {
    console.log('{dispatch} estimating gas price: ', priceEst?.toString())
    state.gasEst = priceEst
  },
}

const actions = <ActionTree<UserInputState, RootState>>{
  async setDestinationAddress({ commit }, address: string) {
    commit(types.SET_DESTINATION_ADDRESS, address)
  },

  setSendAmount({ commit }, amount: number) {
    commit(types.SET_SEND_AMOUNT, amount)
  },

  async setOriginNetwork({ commit, rootGetters }, network: string) {
    commit(types.SET_ORIGIN_NETWORK, network)
    try {
      const gasPrice = await rootGetters.getGasPrice(network)
      commit(types.SET_GAS_EST, gasPrice)
    } catch (e) {
      commit(types.SET_GAS_EST, null)
    }
  },

  setDestinationNetwork({ commit }, network: string) {
    commit(types.SET_DESTINATION_NETWORK, network)
  },

  clearDestinationNetwork({ commit }) {
    commit(types.SET_DESTINATION_NETWORK, null)
  },

  async setToken({ commit, state, dispatch }, token: TokenMetadata) {
    // switch network if token is not available on current network
    if (token.nativeOnly && token.nativeNetwork !== state.originNetwork) {
      await dispatch('switchNetwork', token.nativeNetwork)
    }

    commit(types.SET_TOKEN, token)
    dispatch('getBalanceFromWallet')
  },

  clearInputs({ commit, rootState }) {
    console.log('resetting user input')
    commit(types.SET_DESTINATION_NETWORK, '')
    commit(types.SET_DESTINATION_ADDRESS, rootState.wallet.address)
    commit(types.SET_SEND_AMOUNT, 0)
    commit(types.SET_TOKEN, nullToken)
  },
}

const getters = <GetterTree<UserInputState, RootState>>{
  // Transforms amount into BigNumber for comparison to balance
  getSendAmountAsBN(state: UserInputState) {
    return BigNumber.from(state.sendAmount)
  },
}

export default {
  state,
  mutations,
  actions,
  getters,
}
