import {
  GetPoolQuery,
  GqlChain,
  GqlPoolAprValue,
  GqlPoolComposableStableNested,
  GqlPoolLinearNested,
  GqlPoolTokenBase,
  GqlPoolType,
} from '@/lib/shared/services/api/generated/graphql'
import { invert } from 'lodash'
import { FetchPoolProps, PoolVariant } from './pool.types'
import { fNum } from '@/lib/shared/utils/numbers'
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
const poolTypeLabelMap: { [key in GqlPoolType]: string } = {
  [GqlPoolType.Weighted]: 'Weighted',
  [GqlPoolType.Element]: 'Element',
  [GqlPoolType.Gyro]: 'Gyro 2-CLP',
  [GqlPoolType.Gyro3]: 'Gyro 3-CLP',
  [GqlPoolType.Gyroe]: 'Gyro E-CLP',
  [GqlPoolType.Investment]: 'Managed',
  [GqlPoolType.Linear]: 'Linear',
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

export function isLinearPool(
  pool: GetPoolQuery['pool'] | GqlPoolComposableStableNested | GqlPoolLinearNested
) {
  return pool.__typename === 'GqlPoolLinear' || pool.__typename == 'GqlPoolLinearNested'
}

export function isComposableStablePool(
  pool: GetPoolQuery['pool'] | GqlPoolComposableStableNested | GqlPoolLinearNested
) {
  return (
    pool.__typename === 'GqlPoolComposableStable' ||
    pool.__typename == 'GqlPoolComposableStableNested'
  )
}

export function getProportionalExitAmountsForBptIn(
  bptInHumanReadable: string,
  poolTokens: GqlPoolTokenBase[],
  poolTotalShares: string
): TokenAmountHumanReadable[] {
  const bptInAmountScaled = parseUnits(bptInHumanReadable, 18)
  return getProportionalExitAmountsFromScaledBptIn(bptInAmountScaled, poolTokens, poolTotalShares)
}

export function getProportionalExitAmountsFromScaledBptIn(
  bptIn: bigint,
  poolTokens: GqlPoolTokenBase[],
  poolTotalShares: string
): TokenAmountHumanReadable[] {
  const bptTotalSupply = parseUnits(poolTotalShares, 18)

  return poolTokens.map(token => {
    const tokenBalance = parseUnits(token.totalBalance, token.decimals)
    const tokenProportionalAmount = (bptIn * tokenBalance) / bptTotalSupply

    return {
      address: token.address,
      amount: formatUnits(tokenProportionalAmount, token.decimals),
    }
  })
}
