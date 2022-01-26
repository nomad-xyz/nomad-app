import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { ActiveTransaction, NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk'
import { BigNumber, utils } from 'ethers'
// import { Logger } from '@connext/nxtp-utils'

import { RootState } from '@/store'
import { networks, isProduction } from '@/config'
import * as types from '@/store/mutation-types'
import {
  MainnetNetwork,
  TestnetNetwork,
  TokenMetadata,
} from '@/config/config.types'
import instantiateConnextSDK from '@/utils/connext'
import { hubNetwork, tokens } from '@/config'

let connextSDK: NxtpSdk

export type SwapData = {
  origin: MainnetNetwork | TestnetNetwork
  destination: MainnetNetwork | TestnetNetwork
  destinationAddress: string
  token: TokenMetadata
  amount: number
}

export interface ConnextState {
  checkingLiquidity: boolean
  preparingSwap: boolean
  quote: any
  fee: BigNumber | undefined
  prepared: any
}

const state: ConnextState = {
  checkingLiquidity: false,
  preparingSwap: false,
  quote: undefined,
  fee: undefined,
  prepared: undefined,
}

const mutations = <MutationTree<ConnextState>>{
  [types.SET_CHECKING_LIQUIDITY](state: ConnextState, checking: boolean) {
    console.log('{dispatch} checking liquidity: ', checking)
    state.checkingLiquidity = checking
  },
  [types.SET_PREPARING_SWAP](state: ConnextState, preparing: boolean) {
    console.log('{dispatch} preparing swap: ', preparing)
    state.preparingSwap = preparing
  },
  [types.SET_QUOTE](state: ConnextState, quote: any) {
    console.log('{dispatch} set quote: ', quote)
    state.quote = quote
  },
  [types.SET_FEE](state: ConnextState, fee: BigNumber) {
    console.log('{dispatch} set fee estimate: ', fee)
    state.fee = fee
  },
  [types.SET_PREPARED](state: ConnextState, prepared: any) {
    console.log('{dispatch} set prepared: ', prepared)
    state.prepared = prepared
  },
}

const actions = <ActionTree<ConnextState, RootState>>{
  async instantiateConnext() {
    console.log('called on mount, production = ', isProduction)
    // connextSDK = await instantiateConnextSDK()
    console.log('connext after instantiating', connextSDK)
  },

  async formatDataForTransfer({ rootState, rootGetters }) {
    const {
      originNetwork,
      destinationNetwork,
      destinationAddress,
      token,
      sendAmount,
    } = rootState.userInput

    // get chain ids
    const sendingChainId = networks[originNetwork].chainID
    const receivingChainId = networks[destinationNetwork].chainID

    // get sending asset address
    let sendingAsset
    console.log(originNetwork, token.symbol)
    if (
      originNetwork === hubNetwork.name &&
      token.symbol === tokens.ETH.symbol
    ) {
      // if sending ETH from Ethereum, get ETH as send asset
      sendingAsset = '0x0000000000000000000000000000000000000000'
    } else {
      const contract = await rootGetters.resolveRepresentation(
        originNetwork,
        token.tokenIdentifier
      )
      sendingAsset = contract.address
    }
    if (!sendingAsset) {
      console.error(
        'No asset deployed for ',
        originNetwork,
        token.tokenIdentifier
      )
      return
    }

    // get receiving asset address
    let receivingAsset
    if (
      destinationNetwork === hubNetwork.name &&
      token.symbol === tokens.WETH.symbol
    ) {
      // if sending WETH to Ethereum, get ETH as receiving asset
      receivingAsset = '0x0000000000000000000000000000000000000000'
    } else {
      const contract = await rootGetters.resolveRepresentation(
        destinationNetwork,
        token.tokenIdentifier
      )
      receivingAsset = contract.address
    }
    if (!receivingAsset) {
      console.error(
        'No asset deployed for ',
        destinationNetwork,
        token.tokenIdentifier
      )
      return
    }
    // get amount in decimals
    const amountBN = utils.parseUnits(sendAmount?.toString(), token.decimals)
    return {
      sendingChainId: sendingChainId,
      sendingAssetId: sendingAsset,
      receivingChainId: receivingChainId,
      receivingAssetId: receivingAsset,
      receivingAddress: destinationAddress,
      amount: amountBN?.toString(),
      preferredRouters: isProduction
        ? []
        : ['0x087f402643731b20883fc5dba71b37f6f00e69b9'],
    }
  },

  resetTransferQuote({ commit }) {
    commit(types.SET_QUOTE, undefined)
    commit(types.SET_FEE, undefined)
  },

  async checkTransferLiquidity({ dispatch, commit }): Promise<boolean> {
    commit(types.SET_CHECKING_LIQUIDITY, true)
    const payload = await dispatch('formatDataForTransfer')
    payload.dryRun = true
    console.log('Checking liquidity: ', payload)
    try {
      await connextSDK.getTransferQuote(payload)
    } catch (e: unknown) {
      commit(types.SET_CHECKING_LIQUIDITY, false)
      // should return, don't show error when just checking availability
      return false
    }
    commit(types.SET_CHECKING_LIQUIDITY, false)
    return true
  },

  async getTransferQuote({ rootState, commit, dispatch }) {
    const payload = await dispatch('formatDataForTransfer')
    console.log('Preparing for transfer quote: ', payload)
    const quote = await connextSDK.getTransferQuote(payload)

    const { sendAmount, token } = rootState.userInput
    // estimate fee
    const amountBN = utils.parseUnits(sendAmount.toString(), token.decimals)
    const feeEstimate = amountBN.sub(quote.bid.amountReceived)

    // set in store
    commit(types.SET_QUOTE, quote)
    commit(types.SET_FEE, feeEstimate)
  },

  async prepareTransfer({ state, commit }) {
    if (!state.quote) {
      console.error('no quote')
      return
    }

    commit(types.SET_PREPARING_SWAP, true)

    // prepare transfer
    const transfer = await connextSDK.prepareTransfer(state.quote)
    console.log('transfer', transfer.transactionId)
    // TODO emit alert
    commit(types.SET_PREPARING_SWAP, false)

    // // wait for receiver prepared event
    // const prepared = await connextSDK.waitFor(
    //   NxtpSdkEvents.ReceiverTransactionPrepared,
    //   100_000,
    //   (data) => data.txData.transactionId === transfer.transactionId // filter function
    // )
    // console.log('prepared', prepared)
    // commit(types.SET_PREPARED, prepared)
    // commit(types.SET_PREPARING_SWAP, false)
    // return prepared
  },

  async fulfillTransfer({ state, commit, dispatch }) {
    if (!state.prepared) {
      console.error('not prepared')
      return
    }
    if (!connextSDK) {
      await dispatch('instantiateConnext')
    }

    await connextSDK.fulfillTransfer(state.prepared)
    console.log('DONE!!!')

    // clear state
    commit(types.SET_QUOTE, undefined)
    commit(types.SET_PREPARED, undefined)
    commit(types.SET_FEE, undefined)
  },

  async finishTransfer(
    { dispatch, rootState },
    activeTransaction: ActiveTransaction
  ) {
    const {
      crosschainTx,
      status,
      bidSignature,
      encodedBid,
      encryptedCallData,
    } = activeTransaction
    if (!activeTransaction || !crosschainTx) {
      console.error('Missing data, unable to fulfill Connext transfer')
      return
    }
    const { receiving, invariant } = crosschainTx
    const receivingTxData =
      typeof receiving === 'object'
        ? {
            ...invariant,
            ...receiving,
          }
        : undefined

    if (status === NxtpSdkEvents.ReceiverTransactionPrepared) {
      if (!connextSDK) {
        await dispatch('instantiateConnext')
      }
      if (!rootState.wallet.connected) {
        await dispatch('connectWallet')
      }

      const finish = await connextSDK.fulfillTransfer(
        {
          bidSignature,
          encodedBid,
          encryptedCallData,
          txData: receivingTxData!,
        },
        true
      )
      console.log('finish: ', finish)
    } else {
      console.log('not ready to claim')
    }
  },

  async cancelTransfer(
    { dispatch, rootState },
    activeTransaction: ActiveTransaction
  ) {
    const { sending, invariant } = activeTransaction.crosschainTx
    const sendingTxData = {
      ...invariant,
      ...sending,
    }

    if (!connextSDK) {
      await dispatch('instantiateConnext')
    }
    if (!rootState.wallet.connected) {
      await dispatch('connectWallet')
    }

    await connextSDK.cancel(
      { signature: '0x', txData: sendingTxData },
      activeTransaction.crosschainTx.invariant.sendingChainId
    )
  },
}

const getters = <GetterTree<ConnextState, RootState>>{
  getActiveConnextTxs: () => async () => {
    if (!connextSDK) {
      // connextSDK = await instantiateConnextSDK()
      console.log('connext after instantiating', connextSDK)
    }

    const activeTxs = await connextSDK.getActiveTransactions()
    return activeTxs.map((tx: any) => {
      const variant = tx.crosschainTx.receiving ?? tx.crosschainTx.sending
      return {
        sentAmount: utils.formatEther(tx.crosschainTx.sending?.amount ?? '0'),
        receivedAmount: utils.formatEther(
          tx.crosschainTx.receiving?.amount ?? '0'
        ),
        // gasAmount: gasAmount,
        status: tx.status,
        sendingChain: parseInt(
          tx.crosschainTx.invariant.sendingChainId.toString()
        ),
        receivingChain: parseInt(
          tx.crosschainTx.invariant.receivingChainId.toString()
        ),
        // asset: tx.crosschainTx,
        key: tx.crosschainTx.invariant.transactionId,
        preparedAt: tx.preparedTimestamp,
        expired: Date.now() / 1000 > variant.expiry,
        action: tx,
      }
    })
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTransaction: () => async () => {
    // connextSDK = await instantiateConnextSDK()
    const query = `
      {
        transactions(orderBy: preparedTimestamp, orderDirection: desc, where: { transactionId: '0xd3a053e2db95eb6ca25eeb02bd27ab99031e25800e4160b197304c2ba1957acf' }) {
          id
          status
          chainId
          preparedTimestamp
          receivingChainTxManagerAddress
          user {
            id
          }
          router {
            id
          }
          initiator
          sendingAssetId
          receivingAssetId
          sendingChainFallback
          callTo
          receivingAddress
          callDataHash
          transactionId
          sendingChainId
          receivingChainId
          amount
          expiry
          preparedBlockNumber
          encryptedCallData
          prepareCaller
          bidSignature
          encodedBid
          prepareTransactionHash
          prepareMeta
          relayerFee
          signature
          callData
          externalCallSuccess
          externalCallIsContract
          externalCallReturnData
          fulfillCaller
          fulfillTransactionHash
          fulfillMeta
          cancelCaller
          cancelTransactionHash
          cancelMeta
        }
      }
    `
    const tx1 = await connextSDK.querySubgraph(5, query)
    console.log('??????', tx1)
    const tx2 = await connextSDK.querySubgraph(4, query)
    console.log('??????', tx2)
  },
}

export default {
  state,
  mutations,
  actions,
  getters,
}
