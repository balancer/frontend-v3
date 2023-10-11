import { GqlChain, GqlPoolAprValue } from '@/lib/services/api/generated/graphql'
import { invert } from 'lodash'
import { FetchPoolProps } from './pool.types'
import numeral from 'numeral'

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
export function getPoolPath({ id, chain, variant = 'v2' }: FetchPoolProps) {
  return `/pools/${chainToSlugMap[chain]}/${variant}/${id}`
}

/**
 * Formats APR value into percentage string.
 * @param {String} apr APR value from API.
 * @returns {String} Formatted APR value.
 */
const formatApr = (apr: string) => {
  if (parseFloat(apr) < 0.0000001) return '0%'

  return numeral(apr).format('0.[00]%')
}

/**
 * Returns formatted APR value from GraphQL response.
 * @param {GqlPoolAprValue} apr APR value from GraphQL response.
 * @returns {String} Formatted APR value.
 */
export function getAprLabel(apr: GqlPoolAprValue): string {
  if (apr.__typename === 'GqlPoolAprRange') {
    return `${formatApr(apr.min)} - ${formatApr(apr.max)}`
  } else if (apr.__typename === 'GqlPoolAprTotal') {
    return formatApr(apr.total)
  } else {
    return '-'
  }
}
