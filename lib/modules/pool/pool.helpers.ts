import { getChainId } from '@/lib/config/app.config'
import { dateToUnixTimestamp } from '@/lib/shared/hooks/useTime'
import {
  GetPoolQuery,
  GqlChain,
  GqlPoolBase,
  GqlPoolNestingType,
  GqlPoolType,
} from '@/lib/shared/services/api/generated/graphql'
import { getAddressBlockExplorerLink, isSameAddress } from '@/lib/shared/utils/addresses'
import { Numberish, bn } from '@/lib/shared/utils/numbers'
import BigNumber from 'bignumber.js'
import { Address, getAddress } from 'viem'

/**
 * METHODS
 */
export function addressFor(poolId: string): string {
  return getAddress(poolId.slice(0, 42))
}

export function isLinear(poolType: GqlPoolType): boolean {
  return poolType === GqlPoolType.Linear
}

export function isStable(poolType: GqlPoolType): boolean {
  return (
    poolType === GqlPoolType.Stable ||
    poolType === GqlPoolType.MetaStable ||
    poolType === GqlPoolType.ComposableStable
  )
}

export function isMetaStable(poolType: GqlPoolType): boolean {
  return poolType === GqlPoolType.MetaStable
}

export function isPhantomStable(poolType: GqlPoolType): boolean {
  return poolType === GqlPoolType.PhantomStable
}

export function isComposableStable(poolType: GqlPoolType): boolean {
  return poolType === GqlPoolType.ComposableStable
}

// TODO: verify
// export function isComposableStableV1(pool: Pool): boolean {
//   return isComposableStable(pool.poolType) && pool.poolTypeVersion === 1
// }

// TODO: verify
// export function isComposableStableLike(poolType: GqlPoolType): boolean {
//   return isPhantomStable(poolType) || isComposableStable(poolType)
// }

export function isFx(poolType: GqlPoolType | string): boolean {
  return poolType === GqlPoolType.Fx
}

// TODO: verify how to determine boosted pool from api
export function isBoosted(pool: GqlPoolBase) {
  return pool.type === GqlPoolType.PhantomStable
  //   return !!Object.keys(poolMetadata(pool.id)?.features || {}).includes(PoolFeature.Boosted)
}

export function isGyro(poolType: GqlPoolType) {
  return [GqlPoolType.Gyro, GqlPoolType.Gyro3, GqlPoolType.Gyroe].includes(poolType)
}

export function isUnknownType(poolType: any): boolean {
  return !Object.values(GqlPoolType).includes(poolType)
}

export function isLiquidityBootstrapping(poolType: GqlPoolType): boolean {
  return poolType === GqlPoolType.LiquidityBootstrapping
}

export function isLBP(poolType: GqlPoolType): boolean {
  return isLiquidityBootstrapping(poolType)
}

export function isWeighted(poolType: GqlPoolType): boolean {
  return poolType === GqlPoolType.Weighted
}

export function isManaged(poolType: GqlPoolType): boolean {
  // Correct terminology is managed pools but subgraph still returns poolType = "Investment"
  return poolType === GqlPoolType.Investment
}

export function isWeightedLike(poolType: GqlPoolType): boolean {
  return isWeighted(poolType) || isManaged(poolType) || isLiquidityBootstrapping(poolType)
}

export function isStableLike(poolType: GqlPoolType): boolean {
  return (
    isStable(poolType) ||
    isMetaStable(poolType) ||
    isPhantomStable(poolType) ||
    isComposableStable(poolType) ||
    isFx(poolType) ||
    isGyro(poolType)
  )
}

export function isSwappingHaltable(poolType: GqlPoolType): boolean {
  return isManaged(poolType) || isLiquidityBootstrapping(poolType)
}

export function noInitLiquidity(pool: GqlPoolBase): boolean {
  // Uncomment to DEBUG
  // if (
  //   pool.id ===
  //   '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014'
  // )
  //   return true;
  return new BigNumber(pool.dynamicData.totalShares || '0').eq(0)
}
export function preMintedBptIndex(pool: GqlPoolBase): number | void {
  return pool.allTokens.findIndex(token => isSameAddress(token.address, pool.address))
}

export function calcBptPrice(totalLiquidity: string, totalShares: string): string {
  return bn(totalLiquidity).div(totalShares).toString()
}

export function calcBptPriceFor(pool: GetPoolQuery['pool']): string {
  return calcBptPrice(pool.dynamicData.totalLiquidity, pool.dynamicData.totalShares)
}

export function bptUsdValue(pool: GetPoolQuery['pool'], bptAmount: Numberish): string {
  return bn(bptAmount).times(calcBptPriceFor(pool)).toString()
}

export function createdAfterTimestamp(pool: GqlPoolBase): boolean {
  // Pools should always have valid createTime so, for safety, we block the pool in case we don't get it
  // (createTime should probably not be treated as optional in the SDK types)
  if (!pool.createTime) return true

  const creationTimestampLimit = dateToUnixTimestamp('2023-03-29')

  // // Uncomment to debug
  // if (
  //   pool.id ===
  //   '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080'
  // )
  //   creationTimestampLimit = dateToUnixTimestamp('2021-08-13'); //DEBUG DATE

  // Epoch timestamp is bigger if the date is older
  return pool.createTime > creationTimestampLimit
}

type Pool = GetPoolQuery['pool']
export function usePoolHelpers(pool: Pool, chain: GqlChain) {
  const gaugeExplorerLink = getAddressBlockExplorerLink(
    pool?.staking?.gauge?.gaugeAddress as Address,
    chain
  )
  const poolExplorerLink = getAddressBlockExplorerLink(pool.address as Address, chain)

  const hasGaugeAddress = !!pool?.staking?.gauge?.gaugeAddress

  const gaugeAddress = pool?.staking?.gauge?.gaugeAddress || ''

  const chainId = getChainId(pool.chain)

  return {
    poolExplorerLink,
    gaugeExplorerLink,
    hasGaugeAddress,
    gaugeAddress,
    chainId,
  }
}

export function hasNestedPools(pool: Pool) {
  // The following discriminator is needed because not all pools in GqlPoolQuery do have nestingType property
  // and the real TS discriminator is __typename which we don't want to use
  return 'nestingType' in pool && pool.nestingType !== GqlPoolNestingType.NoNesting
}
