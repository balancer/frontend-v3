import { createPublicClient, http } from 'viem'
import { GqlChain } from '../api/generated/graphql'
import { getNetworkConfig } from '@/lib/config/app.config'
import * as chains from 'viem/chains'

function getViemChain(chainId: number) {
  const viemChains = Object.values(chains)
  const chain = viemChains.find(chain => chain.id === chainId)
  if (!chain) throw new Error('Chain not found')
  return chain
}

export function getViemClient(chain: GqlChain) {
  const { rpcUrl, chainId } = getNetworkConfig(chain)

  return createPublicClient({
    chain: getViemChain(chainId),
    transport: http(rpcUrl),
  })
}
