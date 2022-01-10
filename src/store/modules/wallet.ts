/**
 * Wallet Module contains most information that comes from a user's wallet
 * This is also a good module to look at for how to write a Vuex module
 */
import { MutationTree, ActionTree } from "vuex";
import { RootState } from "@/store";
import * as types from "@/store/mutation-types";
import { networks } from "@/config/index";
import * as mmUtils from "@/utils/metamask";
import { getNetworkByChainID, getOnlyOtherNetwork, nullToken } from "@/utils";

export interface WalletState {
  connected: boolean;
  address: string;
}

const state = (): WalletState => ({
  connected: false,
  address: localStorage.getItem("wallet_address") || "",
});

const mutations = <MutationTree<WalletState>>{
  [types.SET_WALLET_CONNECTION](state: WalletState, connected: boolean) {
    console.log("{dispatch} set wallet connection: ", connected);
    state.connected = connected;
  },

  [types.SET_WALLET_ADDRESS](state: WalletState, address: string) {
    console.log("{dispatch} set wallet address: ", address);
    state.address = address;
    localStorage.setItem("wallet_address", address);
  },
};

const actions = <ActionTree<WalletState, RootState>>{
  async connectWallet({ dispatch, commit, state }) {
    // check if already connected
    if (state.connected) {
      console.log("already connected to wallet");
      return;
    }

    // if window.ethereum does not exist, do not connect
    const { ethereum } = window;
    if (!ethereum) return;

    try {
      // connect Metamask
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (e) {
      console.error(e);
      throw new Error("Couldn't connect to metamask");
    }

    // get provider/signer
    const provider = await mmUtils.getMetamaskProvider();
    const signer = await provider.getSigner();

    // get and set address
    const address = await signer.getAddress();
    dispatch("setWalletAddress", address);
    dispatch("setDestinationAddress", address, { root: true }); // initialize destination address

    // set network, if supported
    const { chainId } = await provider.ready;
    try {
      const network = getNetworkByChainID(chainId);
      dispatch("setWalletNetwork", network.name);
    } catch (e) {
      console.log("network not supported");
    }

    // wallet connected
    commit(types.SET_WALLET_CONNECTION, true);
  },

  setWalletAddress({ commit }, address: string) {
    commit(types.SET_WALLET_ADDRESS, address);
  },

  // when user changes network in Metamask
  setWalletNetwork({ commit, dispatch, rootState }, networkName: string) {
    dispatch("setOriginNetwork", networkName);

    // if there are exactly 2 networks, auto select the destination network
    if (Object.keys(networks).length === 2) {
      dispatch("setDestinationNetwork", getOnlyOtherNetwork(networkName));
    }

    const { token } = rootState.userInput;

    // if token has not been selected, no further action required
    if (!token.symbol) return;

    // if token is not available on network, clear token and balance
    if (token.nativeOnly && token.nativeNetwork !== networkName) {
      commit(types.SET_TOKEN, nullToken);
      commit(types.SET_BALANCE, null);
      return;
    }

    // if token is selected and available on new network, get balance
    dispatch("getBalanceFromWallet");
  },

  async switchNetwork({ dispatch, state, commit }, networkName: string) {
    console.log(`setting wallet network to ${networkName}`);
    if (!state.connected) {
      dispatch("connectWallet");
    }

    // if window.ethereum does not exist, do not instantiate nomad
    const { ethereum } = window;
    if (!ethereum) return;

    const network = networks[networkName];
    const hexChainId = "0x" + network.chainID.toString(16);
    try {
      console.log(`dispatching wallet_switchEthereumChain(${hexChainId})`);
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
    } catch (switchError: any) {
      console.log(switchError.code);
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          const param = {
            chainId: hexChainId,
            rpcUrls: [network.rpcUrl],
            chainName: network.name,
            nativeCurrency: {
              name: network.nativeToken.name,
              symbol: network.nativeToken.symbol,
              decimals: network.nativeToken.decimals,
            },
          };
          console.log(`dispatching wallet_addEthereumChain(${param})`);
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [param],
          });
        } catch (addError: any) {
          // TODO: handle "add" error, alert?
          console.error(addError);
          throw addError;
        }
      }
      console.error(switchError);
      throw switchError;
      // TODO: handle other "switch" errors, alert?
    }

    await dispatch("registerSigner", network);
    await dispatch("setWalletNetwork", network.name);
  },
};

export default {
  state,
  mutations,
  actions,
};
