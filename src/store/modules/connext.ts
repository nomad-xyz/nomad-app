import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { ActiveTransaction, NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk'
import { BigNumber, utils } from 'ethers'
// import { Logger } from '@connext/nxtp-utils'

import { RootState } from '@/store'
import { networks, isProduction } from '@/config'
import * as types from '@/store/mutation-types'
import { NetworkName, TokenMetadata } from '@/config/types'
import instantiateConnextSDK from '@/utils/connext'
import { tokens } from '@/config'

let connextSDK: NxtpSdk

const nativeTokenId = '0x0000000000000000000000000000000000000000'

export type SwapData = {
  origin: NetworkName
  destination: NetworkName
  destinationAddress: string
  token: TokenMetadata
  amount: number
}

export interface ConnextState {
  preparingSwap: boolean
  quote: any
  prepared: any
}

const state: ConnextState = {
  preparingSwap: false,
  quote: undefined,
  prepared: undefined,
}

const mutations = <MutationTree<ConnextState>>{
  [types.SET_PREPARING_SWAP](state: ConnextState, preparing: boolean) {
    console.log('{dispatch} preparing swap: ', preparing)
    state.preparingSwap = preparing
  },
  [types.SET_QUOTE](state: ConnextState, quote: any) {
    console.log('{dispatch} set quote: ', quote)
    state.quote = quote
  },
  [types.SET_PREPARED](state: ConnextState, prepared: any) {
    console.log('{dispatch} set prepared: ', prepared)
    state.prepared = prepared
  },
}

const actions = <ActionTree<ConnextState, RootState>>{
  async instantiateConnext() {
    console.log('Instantiate Connext, production = ', isProduction)
    connextSDK = await instantiateConnextSDK()
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

    let sendingAsset
    let receivingAsset

    // token is ERC20 and not native asset
    if (!token.nativeOnly && token.tokenIdentifier) {
      const sending = await rootGetters.resolveRepresentation(
        originNetwork,
        token.tokenIdentifier
      )
      sendingAsset = sending.address
      const receiving = await rootGetters.resolveRepresentation(
        destinationNetwork,
        token.tokenIdentifier
      )
      receivingAsset = receiving.address
    } else if (
      token.nativeOnly &&
      networks[originNetwork].nativeToken.symbol === token.symbol
    ) {
      // if sending ETH from Ethereum, get ETH as send asset and wETH as receive asset
      console.log('send native token')
      sendingAsset = nativeTokenId
      const wrappedIdentifier = tokens[token.wrappedAsset!].tokenIdentifier!
      const receiving = await rootGetters.resolveRepresentation(
        destinationNetwork,
        wrappedIdentifier
      )
      receivingAsset = receiving.address
    }

    if (!sendingAsset || !receivingAsset) {
      console.error('Sending or Receiving asset not defined')
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
      // sendingChainId: sendingChainId,
      // sendingAssetId: '0xe71678794fff8846bFF855f716b0Ce9d9a78E844',
      // receivingChainId: receivingChainId,
      // receivingAssetId: '0x9aC2c46d7AcC21c881154D57c0Dc1c55a3139198',
      // receivingAddress: destinationAddress,
      // amount: amountBN?.toString(),
      // preferredRouters: isProduction
      //   ? []
      //   : ['0x087f402643731b20883fc5dba71b37f6f00e69b9'],
    }
  },

  resetTransferQuote({ commit }) {
    commit(types.SET_QUOTE, undefined)
  },

  async getTransferQuote({ commit, dispatch }) {
    const payload = await dispatch('formatDataForTransfer')
    console.log('Preparing for transfer quote: ', payload)
    const quote = await connextSDK.getTransferQuote(payload)
    // set in store
    commit(types.SET_QUOTE, quote)
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
    commit(types.SET_PREPARING_SWAP, false)
    return transfer

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
      connextSDK = await instantiateConnextSDK()
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
    connextSDK = await instantiateConnextSDK()
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
