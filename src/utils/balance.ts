import { Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { TokenIdentifier } from '@nomad-xyz/sdk-bridge'
import { ERC20__factory } from '@nomad-xyz/contract-interfaces/bridge'
import { BridgeContext } from '@nomad-xyz/sdk-bridge'

type Address = string

export async function getBalance(
  context: BridgeContext,
  token: TokenIdentifier,
  address: Address,
  domain: number
): Promise<BigNumber | undefined> {
  const contract = await context.resolveRepresentation(domain, token)
  if (!contract) return BigNumber.from(0)
  return await contract.balanceOf(address)
}

export async function getNativeBalance(
  context: BridgeContext,
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
