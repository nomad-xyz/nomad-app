import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { RootState } from '@/store'
import * as types from '@/store/mutation-types'

export type TXData = {
  network: number
  hash: string
}

export interface TransactionsState {
  transactions: Array<TXData>
  newTransaction: boolean
}

const transactionsModule = {
  state: () => ({
    transactions: JSON.parse(localStorage.getItem('transactions')!) || [],
    newTransaction: false,
  }),

  mutations: <MutationTree<TransactionsState>>{
    [types.SET_TRANSACTION](state: TransactionsState, transaction: TXData) {
      console.log('{dispatch} adding transaction: ', transaction)
      state.transactions.unshift(transaction)
      localStorage.setItem('transactions', JSON.stringify(state.transactions))
    },
    [types.SET_NEW_TRANSACTION](state: TransactionsState, newTx: boolean) {
      console.log('{dispatch} new transaction: ', newTx)
      state.newTransaction = newTx
    },
    [types.REMOVE_TRANSACTION](
      state: TransactionsState,
      transactions: TXData[]
    ) {
      console.log('{dispatch} removing transaction')
      state.transactions = transactions
      localStorage.setItem('transactions', JSON.stringify(state.transactions))
    },
  },

  actions: <ActionTree<TransactionsState, RootState>>{
    addTransaction({ commit }, transaction: TXData) {
      commit(types.SET_TRANSACTION, transaction)
      commit(types.SET_NEW_TRANSACTION, true)
    },
    newTransaction({ commit }, newTx: boolean) {
      commit(types.SET_NEW_TRANSACTION, newTx)
    },
    removeTransaction({ state, commit }, txHash: string) {
      const copy = state.transactions.slice()
      const index = copy.findIndex((t) => t.hash === txHash)
      if (index > -1) {
        copy.splice(index, 1)
      }
      commit(types.REMOVE_TRANSACTION, copy)
    },
    addSearchTransaction({ state, commit }, transaction: TXData) {
      const found = state.transactions.find((t) => t.hash === transaction.hash)
      if (!found) {
        commit(types.SET_TRANSACTION, transaction)
      } else {
        console.log('Transaction already saved')
      }
    },
  },

  getters: <GetterTree<TransactionsState, RootState>>{
    getTx: (state: TransactionsState) => async (transaction: TXData) => {
      return state.transactions.find((t) => t.hash === transaction.hash)
    },
  },
}

export default transactionsModule
