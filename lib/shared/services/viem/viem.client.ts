import { createPublicClient, http } from 'viem'
import { GqlChain } from '../api/generated/graphql'
import { getNetworkConfig } from '@/lib/config/app.config'
import { supportedChains } from '@/lib/modules/web3/Web3Provider'

function getViemChain(chainId: number) {
  const chain = supportedChains.find(chain => chain.id === chainId)
  if (!chain) throw new Error('Chain not supported')
  return chain
}

export function getViemClient(chain: GqlChain) {
  const { rpcUrl, chainId } = getNetworkConfig(chain)

  return createPublicClient({
    chain: getViemChain(chainId),
    transport: http(rpcUrl),
  })
}
