import { dateToUnixTimestamp } from '@/lib/shared/hooks/useTime'
import {
  GetPoolQuery,
  GqlChain,
  GqlPoolBase,
  GqlPoolMinimalType,
} from '@/lib/shared/services/api/generated/graphql'
import { getAddressBlockExplorerLink, isSameAddress } from '@/lib/shared/utils/addresses'
import BigNumber from 'bignumber.js'
import { Address, getAddress } from 'viem'

/**
 * METHODS
 */
export function addressFor(poolId: string): string {
  return getAddress(poolId.slice(0, 42))
}

export function isLinear(poolType: GqlPoolMinimalType): boolean {
  return poolType === GqlPoolMinimalType.Linear
}

export function isStable(poolType: GqlPoolMinimalType): boolean {
  return poolType === GqlPoolMinimalType.Stable
}

export function isMetaStable(poolType: GqlPoolMinimalType): boolean {
  return poolType === GqlPoolMinimalType.MetaStable
}

export function isPhantomStable(poolType: GqlPoolMinimalType): boolean {
  return poolType === GqlPoolMinimalType.PhantomStable
}

// TODO: verify
// export function isComposableStable(poolType: GqlPoolMinimalType): boolean {
//   return poolType === GqlPoolMinimalType.ComposableStable
// }

// TODO: verify
// export function isComposableStableV1(pool: Pool): boolean {
//   return isComposableStable(pool.poolType) && pool.poolTypeVersion === 1
// }

// TODO: verify
// export function isComposableStableLike(poolType: GqlPoolMinimalType): boolean {
//   return isPhantomStable(poolType) || isComposableStable(poolType)
// }

export function isFx(poolType: GqlPoolMinimalType | string): boolean {
  return poolType === GqlPoolMinimalType.Fx
}

// TODO: verify how to determine boosted pool from api
export function isBoosted(pool: GqlPoolBase) {
  return pool.type === 'BOOSTED'
  //   return !!Object.keys(poolMetadata(pool.id)?.features || {}).includes(PoolFeature.Boosted)
}

export function isGyro(poolType: GqlPoolMinimalType) {
  return [GqlPoolMinimalType.Gyro, GqlPoolMinimalType.Gyro3, GqlPoolMinimalType.Gyroe].includes(
    poolType
  )
}

export function isUnknownType(poolType: any): boolean {
  return !Object.values(GqlPoolMinimalType).includes(poolType)
}

export function isLiquidityBootstrapping(poolType: GqlPoolMinimalType): boolean {
  return poolType === GqlPoolMinimalType.LiquidityBootstrapping
}

export function isLBP(poolType: GqlPoolMinimalType): boolean {
  return isLiquidityBootstrapping(poolType)
}

export function isWeighted(poolType: GqlPoolMinimalType): boolean {
  return poolType === GqlPoolMinimalType.Weighted
}

export function isManaged(poolType: GqlPoolMinimalType): boolean {
  // Correct terminology is managed pools but subgraph still returns poolType = "Investment"
  return poolType === GqlPoolMinimalType.Investment
}

export function isWeightedLike(poolType: GqlPoolMinimalType): boolean {
  return isWeighted(poolType) || isManaged(poolType) || isLiquidityBootstrapping(poolType)
}

export function isSwappingHaltable(poolType: GqlPoolMinimalType): boolean {
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

type Pool = GetPoolQuery['pool']
export function buildGqlPoolHelpers(pool: Pool, chain: GqlChain) {
  function getBlockExplorerPoolLink() {
    return getAddressBlockExplorerLink(pool.address as Address, chain)
  }

  function getBlockExplorerGaugeLink() {
    return getAddressBlockExplorerLink(pool?.staking?.gauge?.gaugeAddress as Address, chain)
  }

  function hasGaugeAddress() {
    return !!pool?.staking?.gauge?.gaugeAddress
  }

  function getGaugeAddress() {
    return pool?.staking?.gauge?.gaugeAddress || ''
  }

  return { getBlockExplorerPoolLink, getBlockExplorerGaugeLink, hasGaugeAddress, getGaugeAddress }
}
