import networkConfigs from '@/lib/config/networks'
import { GqlChain } from '../services/api/generated/graphql'

export function etherscanGetTokenUrl(tokenAddress: string, chain: GqlChain): string {
  return `${networkConfigs[chain].etherscanUrl}/token/${tokenAddress}`
}

export function etherscanGetAddressUrl(address: string, chain: GqlChain): string {
  return `${networkConfigs[chain].etherscanUrl}/address/${address}`
}

export function etherscanGetTxUrl(tx: string, chain: GqlChain): string {
  return `${networkConfigs[chain].etherscanUrl}/tx/${tx}`
}

export function etherscanGetBlockUrl(blockNumber: number, chain: GqlChain): string {
  return `${networkConfigs[chain].etherscanUrl}/block/${blockNumber}`
}

export function etherscanTxShortenForDisplay(txHash: string) {
  return txHash.slice(0, 12) + '...'
}

export function etherscanGetContractWriteUrl(address: string, chain: GqlChain): string {
  return `${networkConfigs[chain].etherscanUrl}/address/${address}#writeContract`
}

export function etherscanGetContractReadUrl(address: string, chain: GqlChain): string {
  return `${networkConfigs[chain].etherscanUrl}/address/${address}#readContract`
}
