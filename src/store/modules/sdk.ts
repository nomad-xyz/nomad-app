import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { ethers, BigNumber, BytesLike } from 'ethers'
import { mainnet, staging, dev, NomadContext } from '@nomad-xyz/sdk'
import { TransferMessage } from '@nomad-xyz/sdk/nomad/messages/BridgeMessage'
import { TokenIdentifier } from '@nomad-xyz/sdk/nomad'

import { TXData } from './transactions'
import { RootState } from '@/store'
import * as types from '@/store/mutation-types'
import { networks, s3URL } from '@/config/index'
import { getBalance, getNativeBalance, getERC20Balance } from '@/utils/balance'
import { isNativeToken, getNetworkByDomainID } from '@/utils/index'
import { NetworkMetadata } from '@/config/config.types'

const environment = process.env.VUE_APP_NOMAD_ENVIRONMENT
function getNomadContext() {
  switch (environment) {
    case 'development':
      return dev

    case 'staging':
      return staging

    case 'production':
      return mainnet

    default:
      return dev
  }
}

function _instantiateNomad(): NomadContext {
  // configure for mainnet/testnet
  const nomadContext: NomadContext = getNomadContext()

  // register rpc provider and signer for each network
  Object.values(networks).forEach(({ name, rpcUrl }) => {
    nomadContext.registerRpcProvider(name, rpcUrl)
  })

  return nomadContext
}

let nomad: NomadContext

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
}

const state: SDKState = {
  balance: null,
  sending: false,
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
}

const actions = <ActionTree<SDKState, RootState>>{
  instantiateNomad() {
    console.log('instantiateNomad: ', environment)
    try {
      nomad = _instantiateNomad()
      console.log('nomad after instantiating', nomad)
    } catch (e) {
      console.error(e)
      throw new Error("Couldn't setup Nomad")
    }
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
    if (token.tokenIdentifier.domain === networkName) {
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
        const provider = nomad.getProvider(network.name)
        try {
          balance = await getERC20Balance(
            provider as ethers.providers.Web3Provider,
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

  registerSigner({ commit }, network: NetworkMetadata) {
    console.log('registering signer for ', network)
    const networkName = network.name
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const newSigner = provider.getSigner()

    nomad.clearSigners()
    const missingProviders = nomad.missingProviders
    missingProviders.forEach((domain: number) => {
      const network = getNetworkByDomainID(domain)
      nomad.registerRpcProvider(networkName, network.rpcUrl)
    })

    nomad.registerSigner(networkName, newSigner)
  },

  async send({ commit }, payload: SendData): Promise<TransferMessage | null> {
    console.log('sending...', payload)
    commit(types.SET_SENDING, true)
    const { isNative, originNetwork, destNetwork, asset, amnt, recipient } =
      payload

    const originDomain = nomad.resolveDomain(originNetwork)
    const destDomain = nomad.resolveDomain(destNetwork)

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
          recipient
        )
      } else {
        console.log('send ERC-20')
        transferMessage = await nomad.send(
          originDomain,
          destDomain,
          asset,
          amnt,
          recipient
        )
      }
      console.log('tx sent!!!!!!!!!!!!', transferMessage)
      commit(types.SET_SENDING, false)
      return transferMessage
    } catch (e) {
      console.error(e)
    }

    commit(types.SET_SENDING, false)
    return null
  },
  async processTx({ dispatch }, tx: any) {
    // get transfer message
    const { origin, hash } = tx
    const message = await TransferMessage.singleFromTransactionHash(
      nomad,
      origin,
      hash
    )

    const destNetwork = getNetworkByDomainID(message.destination)
    await dispatch('switchNetwork', destNetwork.name)
    // register signer
    await dispatch('registerSigner', destNetwork)

    // get proof
    const res = await fetch(`${s3URL}${origin}_${message.leafIndex.toString()}`)
    const data = (await res.json()) as any
    console.log('proof: ', data)

    // get replica contract
    const core = nomad.getCore(message.destination)
    const replica = core?.getReplica(message.origin)

    // connect signer
    const signer = nomad.getSigner(message.origin)
    replica!.connect(signer!)

    // prove and process
    try {
      const receipt = await replica!.proveAndProcess(
        data.message as BytesLike,
        data.proof.path,
        data.proof.index
      )
      console.log('PROCESSED!!!!')
      return receipt
    } catch (e) {
      console.log(e)
    }
  },
}

const getters = <GetterTree<SDKState, RootState>>{
  getGasPrice: () => async (network: string | number) => {
    try {
      const provider = nomad.getProvider(network)
      const gasPrice = await provider?.getGasPrice()
      return gasPrice
    } catch (e) {
      console.error(e)
    }
  },

  getTxMessage:
    () =>
    async (tx: TXData): Promise<TransferMessage> => {
      const { network, hash } = tx
      let message

      try {
        message = await TransferMessage.singleFromTransactionHash(
          nomad,
          network,
          hash
        )
      } catch (e) {
        console.error(e)
      }

      return message as TransferMessage
    },

  resolveDomain: (state: SDKState) => (network: string) => {
    return nomad.resolveDomain(network)
  },

  resolveDomainName: (state: SDKState) => (network: number) => {
    return nomad.resolveDomainName(network)
  },

  resolveRepresentation:
    (state: SDKState) => async (network: string, token: TokenIdentifier) => {
      let bridgeToken

      try {
        bridgeToken = await nomad.resolveRepresentation(network, token)
      } catch (e) {
        console.error(e)
      }

      return bridgeToken
    },
}

export default {
  state,
  mutations,
  actions,
  getters,
}
