import { createPublicClient, http } from 'viem'
import { GqlChain } from '../api/generated/graphql'
import { getNetworkConfig } from '@/lib/config/app.config'
import { chains } from '@/lib/modules/web3/Web3Provider'
import { Chain } from 'viem'

function getViemChain(chainId: number): Chain {
  const chain = chains.find(chain => chain.id === chainId)
  if (!chain) throw new Error('Chain not supported')
  return chain
}

export function getViemClient(chain: GqlChain) {
  const { chainId } = getNetworkConfig(chain)

  return createPublicClient({
    chain: getViemChain(chainId),
    transport: http(),
  })
}
