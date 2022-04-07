import { Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { TokenIdentifier } from '@/utils'
import { ERC20__factory } from '@nomad-xyz/contract-interfaces/bridge'

type Address = string

export async function getBalance(
  context: any,
  token: TokenIdentifier,
  address: Address,
  domain: number
): Promise<BigNumber | undefined> {
  const contract = await context.resolveRepresentation(domain, token)
  return await contract.balanceOf(address)
}

export async function getNativeBalance(
  context: any,
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
