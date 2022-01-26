import WalletConnectProvider from '@walletconnect/web3-provider'

export async function getWalletConnectProvider() {
  // Create WalletConnect Provider
  const provider = new WalletConnectProvider({
    // TODO: add logic for using dev vs prod values
    rpc: {
      1: 'https://eth-mainnet.alchemyapi.io/v2/rud551ngiIel2fRYbWmsnhwAE1FGgCLG',
      42: 'https://eth-kovan.alchemyapi.io/v2/QKnfLTfe7CkGA80yAVsCdh8ZatQCsfHI',
      1287: 'https://moonbeam-alpha.api.onfinality.io/rpc?apikey=44e80fe3-d9ce-40f2-8336-6089e751b625',
      // ...
    },
  })

  await provider.ready

  return provider
}