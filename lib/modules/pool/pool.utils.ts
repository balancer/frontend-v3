import {
  GqlChain,
  GqlPoolAprValue,
  GqlPoolBase,
  GqlPoolMinimal,
} from '@/lib/shared/services/api/generated/graphql'
import { invert } from 'lodash'
import { FetchPoolProps, PoolVariant } from './pool.types'
import { Numberish, bn, fNum } from '@/lib/shared/utils/numbers'

// URL slug for each chain
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

// Maps GraphQL chain enum to URL slug
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

/**
 * Constructs path to pool detail page.
 * @param {String} id Pool ID could be ID or address depending on variant.
 * @param {GqlChain} chain Chain enum.
 * @param {String} variant Pool variant, defaults to v2.
 * @returns {String} Path to pool detail page.
 */
export function getPoolPath({ id, chain, variant = PoolVariant.v2 }: FetchPoolProps) {
  return `/pools/${chainToSlugMap[chain]}/${variant}/${id}`
}

/**
 * Returns formatted APR value from GraphQL response.
 * @param {GqlPoolAprValue} apr APR value from GraphQL response.
 * @returns {String} Formatted APR value.
 */
export function getAprLabel(apr: GqlPoolAprValue): string {
  if (apr.__typename === 'GqlPoolAprRange') {
    return `${fNum('apr', apr.min)} - ${fNum('apr', apr.max)}`
  } else if (apr.__typename === 'GqlPoolAprTotal') {
    return fNum('apr', apr.total)
  } else {
    return '-'
  }
}

/**
 * Calculates BPT price for pool using total liquidity and total BPT.
 */
export function getBptPrice(pool: GqlPoolMinimal): string {
  return bn(pool.dynamicData.totalLiquidity).div(pool.dynamicData.totalShares).toString()
}

export function usdValueOfBpt(pool: GqlPoolMinimal, bpt: Numberish): string {
  const bptPrice = getBptPrice(pool)
  return bn(bptPrice).times(bpt.toString()).toString()
}
