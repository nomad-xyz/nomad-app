/**
 * UserInput Module contains the user-inputed information gathered for
 * submission. Rather than dealing with emits and props between many components
 * handling them in the store makes it easier to deal with data changes
 */
import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { RootState } from '@/store'
import * as types from '@/store/mutation-types'
import { BigNumber } from 'ethers'
import { networks } from '@/config'
import { TokenMetadata, NetworkName } from '@/config/types'
import { nullToken } from '@/utils'

type TransferStep = 1 | 2

export interface UserInputState {
  step: TransferStep
  destinationAddress: string
  sendAmount: number
  originNetwork: NetworkName | ''
  destinationNetwork: NetworkName | ''
  token: TokenMetadata
  gasEst: BigNumber | null
}

const state: UserInputState = {
  step: 1,
  destinationAddress: '',
  sendAmount: 0,
  originNetwork: '',
  destinationNetwork: '',
  token: nullToken,
  gasEst: null,
}

const mutations = <MutationTree<UserInputState>>{
  [types.SET_TRANSFER_STEP](state: UserInputState, step: TransferStep) {
    console.log('{dispatch} set transfer step: ', step)
    state.step = step
  },

  [types.SET_DESTINATION_ADDRESS](state: UserInputState, address: string) {
    console.log('{dispatch} set destination address: ', address)
    state.destinationAddress = address
  },

  // Amount comes in as a number. We should store it as a number
  [types.SET_SEND_AMOUNT](state: UserInputState, amount: number) {
    console.log('{dispatch} set send amount: ', amount)
    state.sendAmount = amount
  },

  [types.SET_ORIGIN_NETWORK](state: UserInputState, network: NetworkName | '') {
    console.log('{dispatch} set origin network: ', network)
    state.originNetwork = network
  },

  [types.SET_DESTINATION_NETWORK](
    state: UserInputState,
    network: NetworkName | ''
  ) {
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
  setTransferStep({ commit }, step: TransferStep) {
    commit(types.SET_TRANSFER_STEP, step)
  },

  async setDestinationAddress({ commit }, address: string) {
    commit(types.SET_DESTINATION_ADDRESS, address)
  },

  setSendAmount({ commit }, amount: string) {
    commit(types.SET_SEND_AMOUNT, Number.parseFloat(amount))
  },

  async setOriginNetwork({ commit, state, rootGetters }, network: NetworkName) {
    commit(types.SET_ORIGIN_NETWORK, network)

    // clear destination network if there is not a connection
    const hasConnection = network
      ? networks[network]?.connections?.includes(
          state.destinationNetwork as NetworkName
        )
      : false
    if (!hasConnection) commit(types.SET_DESTINATION_NETWORK, '')

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
    commit(types.SET_DESTINATION_NETWORK, '')
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
