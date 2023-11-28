import { dateToUnixTimestamp } from '@/lib/shared/hooks/useTime'
import { GqlPoolBase, GqlPoolFilterType } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import BigNumber from 'bignumber.js'
import { getAddress } from 'viem'

/**
 * METHODS
 */
export function addressFor(poolId: string): string {
  return getAddress(poolId.slice(0, 42))
}

export function isLinear(poolType: GqlPoolFilterType): boolean {
  return poolType === GqlPoolFilterType.Linear
}

export function isStable(poolType: GqlPoolFilterType): boolean {
  return poolType === GqlPoolFilterType.Stable
}

export function isMetaStable(poolType: GqlPoolFilterType): boolean {
  return poolType === GqlPoolFilterType.MetaStable
}

export function isStablePhantom(poolType: GqlPoolFilterType): boolean {
  return poolType === GqlPoolFilterType.PhantomStable
}

// TODO: verify
// export function isComposableStable(poolType: GqlPoolFilterType): boolean {
//   return poolType === GqlPoolFilterType.ComposableStable
// }

// TODO: verify
// export function isComposableStableV1(pool: Pool): boolean {
//   return isComposableStable(pool.poolType) && pool.poolTypeVersion === 1
// }

// TODO: verify
// export function isComposableStableLike(poolType: GqlPoolFilterType): boolean {
//   return isStablePhantom(poolType) || isComposableStable(poolType)
// }

export function isFx(poolType: GqlPoolFilterType | string): boolean {
  return poolType === 'FX'
}

// TODO: verify how to determine boosted pool from api
export function isBoosted(pool: GqlPoolBase) {
  return pool.type === 'BOOSTED'
  //   return !!Object.keys(poolMetadata(pool.id)?.features || {}).includes(PoolFeature.Boosted)
}

export function isGyro(pool: GqlPoolBase) {
  return [GqlPoolFilterType.Gyro, GqlPoolFilterType.Gyro3, GqlPoolFilterType.Gyroe].includes(
    pool.type as GqlPoolFilterType
  )
}

export function isUnknownType(poolType: any): boolean {
  return !Object.values(GqlPoolFilterType).includes(poolType)
}

export function isLiquidityBootstrapping(poolType: GqlPoolFilterType): boolean {
  return poolType === GqlPoolFilterType.LiquidityBootstrapping
}

export function isLBP(poolType: GqlPoolFilterType): boolean {
  return isLiquidityBootstrapping(poolType)
}

export function isWeighted(poolType: GqlPoolFilterType): boolean {
  return poolType === GqlPoolFilterType.Weighted
}

export function isManaged(poolType: GqlPoolFilterType): boolean {
  // Correct terminology is managed pools but subgraph still returns poolType = "Investment"
  return poolType === GqlPoolFilterType.Investment
}

export function isWeightedLike(poolType: GqlPoolFilterType): boolean {
  return isWeighted(poolType) || isManaged(poolType) || isLiquidityBootstrapping(poolType)
}

export function isSwappingHaltable(poolType: GqlPoolFilterType): boolean {
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
