import { Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { NomadContext } from '@nomad-xyz/sdk'
import { TokenIdentifier } from '@nomad-xyz/sdk-bridge'
import { ERC20__factory } from '@nomad-xyz/contract-interfaces/bridge'

type Address = string

// export async function getBalances(
//   context: NomadContext,
//   token: TokenIdentifier,
//   address: Address
// ): Promise<Record<number, BigNumber> | undefined> {
//   try {
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     const representations = await context.resolveRepresentations(token)
//     const balances: Record<number, BigNumber> = {}
//     let domain, instance

//     for ([domain, instance] of representations.tokens.entries()) {
//       console.log({ instance })
//       balances[domain] = await instance.balanceOf(address)
//     }
//     return balances
//   } catch (e) {
//     console.log('getBalances error', e)
//   }
// }

export async function getBalance(
  context: NomadContext,
  token: TokenIdentifier,
  address: Address,
  domain: number
): Promise<BigNumber | undefined> {
  // let key, instance, balance
  // const representations = await context.resolveRepresentations(token)
  // const tokenEntries = representations.tokens.entries()

  // for ([key, instance] of tokenEntries) {
  //   if (domain === key) {
  //     balance = await instance.balanceOf(address)
  //     return balance
  //   }
  // }
  return new BigNumber(10, '0')
}

export async function getNativeBalance(
  context: NomadContext,
  network: string,
  address: string
): Promise<BigNumber | undefined> {
  const provider = context.getProvider(network)
  return provider?.getBalance(address)
}

export async function getERC20Balance(
  provider: Web3Provider,
  tokenAddress: string,
  account: string
): Promise<BigNumber | undefined> {
  const tokenContract = ERC20__factory.connect(tokenAddress as string, provider)
  return await tokenContract.balanceOf(account)
}
