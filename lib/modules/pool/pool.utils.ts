import { GqlChain } from '@/lib/services/api/generated/graphql'
import { invert } from 'lodash'
import { FetchPoolProps } from './pool.types'

export enum ChainSlug {
  Ethereum = 'ethereum',
  Arbitrum = 'arbitrum',
  Polygon = 'polygon',
  Avalanche = 'avalanche',
  Fantom = 'fantom',
  Base = 'base',
  Optimisim = 'optimism',
  Zkevm = 'zkevm',
  Gnosis = 'gnosis',
}

export const chainToSlugMap: Record<GqlChain, ChainSlug> = {
  [GqlChain.Mainnet]: ChainSlug.Ethereum,
  [GqlChain.Arbitrum]: ChainSlug.Arbitrum,
  [GqlChain.Polygon]: ChainSlug.Polygon,
  [GqlChain.Avalanche]: ChainSlug.Avalanche,
  [GqlChain.Fantom]: ChainSlug.Fantom,
  [GqlChain.Base]: ChainSlug.Base,
  [GqlChain.Optimism]: ChainSlug.Optimisim,
  [GqlChain.Zkevm]: ChainSlug.Zkevm,
  [GqlChain.Gnosis]: ChainSlug.Gnosis,
}

export const slugToChainMap = invert(chainToSlugMap) as Record<ChainSlug, GqlChain>

export function getPoolPath({
  id,
  chain,
  balancerVersion = 'v2',
}: Omit<FetchPoolProps, 'initPool'>) {
  return `/pools/${chainToSlugMap[chain]}/${balancerVersion}/${id}`
}
