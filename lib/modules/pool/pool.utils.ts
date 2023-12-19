import {
  GqlChain,
  GqlPoolAprValue,
  GqlPoolMinimalType,
} from '@/lib/shared/services/api/generated/graphql'
import { invert } from 'lodash'
import { FetchPoolProps, PoolVariant } from './pool.types'
import { fNum } from '@/lib/shared/utils/numbers'

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

// Maps GraphQL pool type enum to human readable label for UI.
const poolTypeLabelMap: { [key in GqlPoolMinimalType]: string } = {
  [GqlPoolMinimalType.Weighted]: 'Weighted',
  [GqlPoolMinimalType.Element]: 'Element',
  [GqlPoolMinimalType.Gyro]: 'Gyro 2-CLP',
  [GqlPoolMinimalType.Gyro3]: 'Gyro 3-CLP',
  [GqlPoolMinimalType.Gyroe]: 'Gyro E-CLP',
  [GqlPoolMinimalType.Investment]: 'Managed',
  [GqlPoolMinimalType.Linear]: 'Linear',
  [GqlPoolMinimalType.LiquidityBootstrapping]: 'LBP',
  [GqlPoolMinimalType.MetaStable]: 'MetaStable',
  [GqlPoolMinimalType.PhantomStable]: 'PhantomStable',
  [GqlPoolMinimalType.Stable]: 'Stable',
  [GqlPoolMinimalType.Unknown]: 'Unknown',
  [GqlPoolMinimalType.Fx]: 'FX',
}

export function getPoolTypeLabel(type: GqlPoolMinimalType): string {
  return poolTypeLabelMap[type]
}
