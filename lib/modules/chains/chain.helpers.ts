import { SupportedChainId } from '@/lib/config/config.types'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import {
  Chain,
  arbitrum,
  avalanche,
  base,
  fantom,
  gnosis,
  goerli,
  mainnet,
  optimism,
  polygon,
  polygonZkEvm,
  sepolia,
} from 'viem/chains'

export function mapApiChain(apiChain: GqlChain | 'SEPOLIA' | 'GOERLI'): Chain {
  switch (apiChain) {
    case GqlChain.Arbitrum:
      return arbitrum
    case GqlChain.Avalanche:
      return avalanche
    case GqlChain.Base:
      return base
    case GqlChain.Gnosis:
      return gnosis
    case GqlChain.Fantom:
      return fantom
    case GqlChain.Optimism:
      return optimism
    case GqlChain.Polygon:
      return polygon
    case GqlChain.Mainnet:
      return mainnet
    case GqlChain.Zkevm:
      return polygonZkEvm
    case 'SEPOLIA':
      return sepolia
    case 'GOERLI':
      return goerli

    default:
      throw new Error(`Unexpected API chain: ${apiChain}`)
  }
}

export function getChainId(apiChain: GqlChain): SupportedChainId {
  return mapApiChain(apiChain).id as SupportedChainId
}
