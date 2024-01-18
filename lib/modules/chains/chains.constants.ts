import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

export const UNSUPPORTED_CHAINS = [GqlChain.Fantom, GqlChain.Optimism]

// Maps GraphQL chain enum to chain ID
export const chainToIdMap: Record<GqlChain, number> = {
  [GqlChain.Mainnet]: 1,
  [GqlChain.Arbitrum]: 42161,
  [GqlChain.Polygon]: 137,
  [GqlChain.Avalanche]: 43114,
  [GqlChain.Fantom]: 250,
  [GqlChain.Base]: 8453,
  [GqlChain.Optimism]: 10,
  [GqlChain.Zkevm]: 1101,
  [GqlChain.Gnosis]: 100,
}
