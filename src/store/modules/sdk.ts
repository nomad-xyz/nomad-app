import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { providers, BigNumber, BytesLike } from 'ethers'
import { TokenIdentifier, TransferMessage } from '@nomad-xyz/sdk-bridge'
import { TXData } from './transactions'
import { RootState } from '@/store'
import * as types from '@/store/mutation-types'
import { networks, proofsS3, isProduction } from '@/config'
import { getBalance, getNativeBalance, getERC20Balance } from '@/utils/balance'
import { isNativeToken, getNetworkByDomainID } from '@/utils'
import { NetworkMetadata, NetworkName } from '@/config/types'

const nomadSDK = await import('@nomad-xyz/sdk-bridge')
export const nomad = await nomadSDK.BridgeContext.fetch(
  process.env.VUE_APP_NOMAD_ENVIRONMENT
)

export interface SendData {
  isNative: boolean
  originNetwork: number
  destNetwork: number
  asset: TokenIdentifier
  amnt: number
  recipient: string
  gasLimit?: number
}

export interface SDKState {
  balance: BigNumber | null
  sending: boolean
  blacklist: Set<number>
}

const state: SDKState = {
  balance: null,
  sending: false,
  blacklist: new Set(),
}

const mutations = <MutationTree<SDKState>>{
  [types.SET_BALANCE](state: SDKState, balance: BigNumber | null) {
    console.log('{dispatch} set balance: ', balance)
    state.balance = balance
  },

  [types.SET_SENDING](state: SDKState, sending: boolean) {
    console.log('{dispatch} transaction send in process: ', sending)
    state.sending = sending
  },

  [types.SET_BLACKLIST](state: SDKState, blacklist: Set<number>) {
    console.log('{dispatch} set blacklist: ', blacklist)
    state.blacklist = blacklist
  },
}

const actions = <ActionTree<SDKState, RootState>>{
  async instantiateNomad({ dispatch }) {
    Object.values(networks).forEach(({ name, rpcUrl }) => {
      nomad.registerRpcProvider(name, rpcUrl)
    })
    if (isProduction) {
      nomad.registerRpcProvider('xdai', process.env.VUE_APP_XDAI_RPC)
    }
    console.log('nomad instantiated: ', nomad)
    await dispatch('checkFailedHomes')
  },
  async checkFailedHomes({ commit }) {
    await nomad.checkHomes(Object.keys(networks))
    const blacklist = nomad.blacklist()
    console.log('blacklist', blacklist)
    commit(types.SET_BLACKLIST, blacklist)
  },

  async getBalanceFromWallet({ rootState, commit }) {
    console.log('gettingbalanceFromwallet')

    // if not on supported network, don't get balance
    if (!rootState.userInput.originNetwork) return

    // get current network domain
    const networkName = rootState.userInput.originNetwork
    const network = networks[networkName]
    const domain = network.domainID
    const address = rootState.wallet.address
    const token = rootState.userInput.token

    let balance
    if (token.nativeNetwork === networkName) {
      if (isNativeToken(networkName, token)) {
        console.log('getting native token balance')
        try {
          balance = await getNativeBalance(nomad, network.name, address)
        } catch (e) {
          balance = 0
          console.error(e)
          console.log(`no balance for ${token.name}`)
        }
      } else {
        console.log('getting balance of ERC20 token: ', token.name)
        if (!token.tokenIdentifier) {
          throw new Error('Native token, no token identifier')
        }
        const provider = nomad.getProvider(network.name)
        try {
          balance = await getERC20Balance(
            provider as providers.Web3Provider,
            token.tokenIdentifier.id as string,
            address
          )
        } catch (e) {
          balance = 0
          console.error(e)
          console.log(`no balance for ${token.name}`)
        }
      }
    } else {
      console.log('getting representational token balance')
      if (!token.tokenIdentifier) {
        throw new Error('Native token, no token identifier')
      }
      try {
        balance = await getBalance(
          nomad,
          token.tokenIdentifier,
          address,
          domain
        )
      } catch (e) {
        // there is no balance so it errors
        // should return 0
        balance = 0
        console.error(e)
        console.log(`no balance for ${token.name}`)
      }
    }

    commit(types.SET_BALANCE, balance)
  },

  registerSigner({ rootGetters }, network: NetworkMetadata) {
    console.log('registering signer for ', network)
    const networkName = network.name
    const signer = rootGetters.getSigner()

    nomad.clearSigners()
    nomad.missingProviders
      .map((numberString) => parseInt(numberString))
      .forEach((domain: number) => {
        const network = getNetworkByDomainID(domain)
        nomad.registerRpcProvider(networkName, network.rpcUrl)
      })

    nomad.registerSigner(networkName, signer)
  },

  async send(
    { commit, dispatch },
    payload: SendData
  ): Promise<TransferMessage | null> {
    console.log('sending...', payload)
    commit(types.SET_SENDING, true)
    const { isNative, originNetwork, destNetwork, asset, amnt, recipient } =
      payload

    const originDomain = nomad.resolveDomain(originNetwork)
    const destDomain = nomad.resolveDomain(destNetwork)

    let overrides
    if (originDomain === 5001 || originDomain === 5551) {
      overrides = { gasLimit: 3600000 }
    }

    let transferMessage
    try {
      // if ETH Helper contract exists, native token must be wrapped
      // before sending, use sendNative
      const ethHelper = nomad.getBridge(originDomain)?.ethHelper
      if (ethHelper && isNative) {
        console.log('send native')
        transferMessage = await nomad.sendNative(
          originDomain,
          destDomain,
          amnt,
          recipient,
          false,
          overrides
        )
      } else {
        console.log('send ERC-20')
        transferMessage = await nomad.send(
          originDomain,
          destDomain,
          asset,
          amnt,
          recipient,
          false,
          overrides
        )
      }
      console.log('tx sent!!!!!!!!!!!!', transferMessage)
      commit(types.SET_SENDING, false)
      return transferMessage
    } catch (e) {
      await dispatch('checkFailedHomes')
      commit(types.SET_SENDING, false)
      throw e
    }
  },

  async processTx({ dispatch }, tx: { origin: NetworkName; hash: string }) {
    // get transfer message
    const { origin, hash } = tx
    const message = await nomadSDK.TransferMessage.singleFromTransactionHash(
      nomad,
      origin,
      hash
    )

    // switch network and register signer
    const destNetwork = getNetworkByDomainID(message.destination)
    await dispatch('switchNetwork', destNetwork.name)
    await dispatch('registerSigner', destNetwork)

    try {
      const receipt = await message.process()
      console.log('PROCESSED!!!!')
      return receipt
    } catch (e) {
      await dispatch('checkFailedHomes')
      throw e
    }
  },
}

const getters = <GetterTree<SDKState, RootState>>{
  activeNetworks: (state: SDKState) => () => {
    return Object.keys(networks)
      .filter((n) => !state.blacklist.has(networks[n].domainID))
      .map((n) => networks[n])
  },
  blacklist: (state: SDKState) => () => state.blacklist,
  getGasPrice: () => async (network: string | number) => {
    const provider = nomad.getProvider(network)
    const gasPrice = await provider?.getGasPrice()
    return gasPrice
  },

  getTxMessage:
    () =>
    async (tx: TXData): Promise<TransferMessage | undefined> => {
      const { network, hash } = tx

      return await nomadSDK.TransferMessage.singleFromTransactionHash(
        nomad,
        network,
        hash
      )
    },

  getTimestamp:
    () => async (destDomain: string | number, blockNumber: number) => {
      const provider = nomad.mustGetProvider(destDomain)
      return (await provider.getBlock(blockNumber)).timestamp
    },

  resolveDomain: () => (network: string) => {
    return nomad.resolveDomain(network)
  },

  resolveDomainName: () => (network: number) => {
    return nomad.resolveDomainName(network)
  },

  resolveRepresentation:
    () => async (network: string, token: TokenIdentifier) => {
      return await nomad.resolveRepresentation(network, token)
    },

  getDomains: () => () => nomad.domainNumbers,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
