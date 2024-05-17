import {
  GetPoolQuery,
  GqlBalancePoolAprItem,
  GqlChain,
  GqlPoolAprValue,
  GqlPoolComposableStableNested,
  GqlPoolTokenDetail,
  GqlPoolType,
} from '@/lib/shared/services/api/generated/graphql'
import { invert } from 'lodash'
import { FetchPoolProps, PoolListItem, PoolVariant } from './pool.types'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { TokenAmountHumanReadable } from '../tokens/token.types'
import { formatUnits, parseUnits } from 'viem'

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
  Sepolia = 'sepolia',
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
  [GqlChain.Sepolia]: ChainSlug.Sepolia,
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

// TODO: the following 2 functions (getAprLabel & getTotalAprLabel) most likely need revisiting somewhere in the near future
/**
 * Returns formatted APR value from GraphQL response.
 * @param {GqlPoolAprValue} apr APR value from GraphQL response.
 * @returns {String} Formatted APR value.
 */
export function getAprLabel(apr: GqlPoolAprValue, vebalBoost?: number): string {
  if (apr.__typename === 'GqlPoolAprRange') {
    const minApr = bn(apr.min)
      .multipliedBy(vebalBoost || 1)
      .toNumber()
    const maxApr = bn(apr.max)
      .multipliedBy(vebalBoost || 1)
      .toNumber()
    return `${fNum('apr', minApr)} - ${fNum('apr', maxApr)}`
  } else if (apr.__typename === 'GqlPoolAprTotal') {
    return fNum('apr', apr.total)
  } else {
    return '-'
  }
}

/**
 * Calculates the total APR label based on the array of APR items and an optional boost value.
 *
 * @param {GqlBalancePoolAprItem[]} aprItems - The array of APR items to calculate the total APR label from.
 * @param {string} [vebalBoost] - An optional boost value for calculation.
 * @returns {string} The formatted total APR label.
 */
export function getTotalAprLabel(aprItems: GqlBalancePoolAprItem[], vebalBoost?: string): string {
  let minTotal = '0'
  let maxTotal = '0'
  const boost = vebalBoost || 1

  aprItems.forEach(item => {
    const [min, max] =
      item.apr.__typename === 'GqlPoolAprRange'
        ? [bn(item.apr.min).times(boost), item.apr.max]
        : [item.apr.total, item.apr.total]
    minTotal = bn(min).plus(minTotal).toString()
    maxTotal = bn(max).plus(maxTotal).toString()
  })

  if (minTotal === maxTotal || vebalBoost) {
    return fNum('apr', minTotal)
  } else {
    return `${fNum('apr', minTotal)} - ${fNum('apr', maxTotal)}`
  }
}

// Maps GraphQL pool type enum to human readable label for UI.
const poolTypeLabelMap: { [key in GqlPoolType]: string } = {
  [GqlPoolType.Weighted]: 'Weighted',
  [GqlPoolType.Element]: 'Element',
  [GqlPoolType.Gyro]: 'Gyro 2-CLP',
  [GqlPoolType.Gyro3]: 'Gyro 3-CLP',
  [GqlPoolType.Gyroe]: 'Gyro E-CLP',
  [GqlPoolType.Investment]: 'Managed',
  [GqlPoolType.LiquidityBootstrapping]: 'LBP',
  [GqlPoolType.MetaStable]: 'Stable',
  [GqlPoolType.PhantomStable]: 'Stable',
  [GqlPoolType.Stable]: 'Stable',
  [GqlPoolType.Unknown]: 'Unknown',
  [GqlPoolType.Fx]: 'FX',
  [GqlPoolType.ComposableStable]: 'Stable',
}

export function getPoolTypeLabel(type: GqlPoolType): string {
  return poolTypeLabelMap[type] ?? type.replace(/_/g, ' ').toLowerCase()
}

export const poolClickHandler = (
  event: React.MouseEvent<HTMLElement>,
  id: string,
  chain: GqlChain,
  router: AppRouterInstance
) => {
  const poolPath = getPoolPath({ id, chain })

  if (event.ctrlKey || event.metaKey) {
    window.open(poolPath, '_blank')
  } else {
    router.push(poolPath)
  }
}

// Prefetch pool page on hover, otherwise there is a significant delay
// between clicking the pool and the pool page loading.
export const poolMouseEnterHandler = (
  event: React.MouseEvent<HTMLElement>,
  id: string,
  chain: GqlChain,
  router: AppRouterInstance
) => {
  const poolPath = getPoolPath({ id, chain })
  router.prefetch(poolPath)
}

export function isComposableStablePool(pool: GetPoolQuery['pool'] | GqlPoolComposableStableNested) {
  return (
    pool.__typename === 'GqlPoolComposableStable' ||
    pool.__typename == 'GqlPoolComposableStableNested'
  )
}

export function getProportionalExitAmountsForBptIn(
  bptInHumanReadable: string,
  poolTokens: GqlPoolTokenDetail[],
  poolTotalShares: string
): TokenAmountHumanReadable[] {
  const bptInAmountScaled = parseUnits(bptInHumanReadable, 18)
  return getProportionalExitAmountsFromScaledBptIn(bptInAmountScaled, poolTokens, poolTotalShares)
}

export function getProportionalExitAmountsFromScaledBptIn(
  bptIn: bigint,
  poolTokens: Omit<GqlPoolTokenDetail, 'nestedPool'>[],
  poolTotalShares: string
): TokenAmountHumanReadable[] {
  const bptTotalSupply = parseUnits(poolTotalShares, 18)

  return poolTokens.map(token => {
    const tokenBalance = parseUnits(token.balance, token.decimals)
    const tokenProportionalAmount = bptTotalSupply ? (bptIn * tokenBalance) / bptTotalSupply : 0n

    return {
      address: token.address,
      amount: formatUnits(tokenProportionalAmount, token.decimals),
    }
  })
}

/**
 *
 * @description Returns a map of pool by gauge id
 * @example getPoolsByGaugesMap(pools) => { '0x123': pool1, '0x456': pool2 }
 */
export function getPoolsByGaugesMap(pools: PoolListItem[]) {
  return pools.reduce((acc: Record<string, PoolListItem>, pool) => {
    const gaugeId = pool.staking?.gauge?.id || ''
    if (gaugeId) {
      acc[gaugeId] = pool
    }
    pool.staking?.gauge?.otherGauges?.forEach(otherGauge => {
      const otherGaugeId = otherGauge.id
      if (otherGaugeId) {
        acc[otherGaugeId] = pool
      }
    })

    return acc
  }, {})
}
