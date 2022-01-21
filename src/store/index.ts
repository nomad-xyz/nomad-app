/**
 * This is the store root where we assemble modules and export
 * the store.
 * - Application-level state is centralized here
 * - Modules are sections of the store. Splitting logic into
 * modules helps maintain logical readability
 * - State is mutated by committing mutations, which are
 * syncronous transactions
 * - Asynchronous logic should be encapsulated in, and can be
 * composed with actions (chaining together mutations if
 * needed)
 */
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import walletModule, { WalletState } from './modules/wallet'
import sdkModule, { SDKState } from './modules/sdk'
import userInputModule, { UserInputState } from './modules/userInput'
import connextModule, { ConnextState } from './modules/connext'
// import transactionsModule, { TransactionsState } from './modules/transactions'

export interface RootState {
  wallet: WalletState
  sdk: SDKState
  connext: ConnextState
  userInput: UserInputState
  // transactions: TransactionsState
}

export const key: InjectionKey<Store<RootState>> = Symbol('baseStore')

export const store = createStore({
  modules: {
    wallet: walletModule,
    sdk: sdkModule,
    connext: connextModule,
    userInput: userInputModule,
    // transactions: transactionsModule,
  },
})

// define your own `useStore` composition function
export function useStore(): Store<RootState> {
  return baseUseStore(key)
}
