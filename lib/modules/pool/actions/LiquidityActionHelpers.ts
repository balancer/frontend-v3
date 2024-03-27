import { getChainId, getNetworkConfig } from '@/lib/config/app.config'
import { TokenAmountToApprove } from '@/lib/modules/tokens/approvals/approval-rules'
import { nullAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { GqlPoolType } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { SentryError } from '@/lib/shared/utils/errors'
import {
  HumanAmount,
  InputAmount,
  MinimalToken,
  NestedPool,
  NestedPoolState,
  PoolState,
  PoolStateWithBalances,
  RawPoolToken,
  TokenAmount,
  mapPoolType,
} from '@balancer/sdk'
import { keyBy } from 'lodash'
import { Hex, formatUnits, parseUnits } from 'viem'
import { Address } from 'wagmi'
import { hasNestedPools, isComposableStableV1, isGyro } from '../pool.helpers'
import { Pool } from '../usePool'
import { HumanAmountIn } from './liquidity-types'
import { isAffectedByCspIssue } from '../alerts/pool-issues/PoolIssue.rules'
import { bn } from '@/lib/shared/utils/numbers'

// Null object used to avoid conditional checks during hook loading state
const NullPool: Pool = {
  id: nullAddress,
  address: nullAddress,
  type: 'Null',
  tokens: [],
} as unknown as Pool

/*
  This class provides helper methods to traverse the pool state and prepare data structures needed by add/remove liquidity  handlers
  to implement the Add/RemoveLiquidityHandler interface
*/
export class LiquidityActionHelpers {
  constructor(public pool: Pool = NullPool) {}

  /* Used by default (non-nested) SDK handlers */
  public get poolState(): PoolState {
    return toPoolState(this.pool)
  }

  /* Used by default nested SDK handlers */
  public get nestedPoolState(): NestedPoolState {
    return mapPoolToNestedPoolState(this.pool)
  }

  public get poolStateWithBalances(): PoolStateWithBalances {
    return toPoolStateWithBalances(this.pool)
  }

  public get networkConfig() {
    return getNetworkConfig(this.pool.chain)
  }

  public get chainId() {
    return getChainId(this.pool.chain)
  }

  public getAmountsToApprove(humanAmountsIn: HumanAmountIn[]): TokenAmountToApprove[] {
    return this.toInputAmounts(humanAmountsIn).map(({ address, rawAmount }) => {
      return {
        tokenAddress: address,
        requiredRawAmount: rawAmount,
        requestedRawAmount: rawAmount, //This amount will be probably replaced by MAX_BIGINT depending on the approval rules
      }
    })
  }

  public toInputAmounts(humanAmountsIn: HumanAmountIn[]): InputAmount[] {
    if (!humanAmountsIn.length) return []

    const amountsInList: InputAmount[] = this.pool.allTokens.map(t => {
      return {
        rawAmount: 0n,
        decimals: t.decimals,
        address: t.address as Address,
      }
    })

    const amountsInByTokenAddress = keyBy(amountsInList, a => a.address)

    // from humanAmountsIn to SDK AmountsIn
    humanAmountsIn.forEach(({ tokenAddress, humanAmount }) => {
      if (!amountsInByTokenAddress[tokenAddress]) {
        throw new Error(
          `Provided token address ${tokenAddress} not found in pool tokens [${Object.keys(
            amountsInByTokenAddress
          ).join(' , \n')}]`
        )
      }
      const decimals = amountsInByTokenAddress[tokenAddress].decimals
      amountsInByTokenAddress[tokenAddress].rawAmount = parseUnits(humanAmount, decimals)
    })

    const amountsIn = Object.values(amountsInByTokenAddress).filter(a => a.rawAmount > 0n)
    return amountsIn
  }

  public isNativeAssetIn(humanAmountsIn: HumanAmountIn[]): boolean {
    const nativeAssetAddress = this.networkConfig.tokens.nativeAsset.address

    return humanAmountsIn.some(amountIn => isSameAddress(amountIn.tokenAddress, nativeAssetAddress))
  }
}

export const isEmptyAmount = (amountIn: HumanAmountIn) => isEmptyHumanAmount(amountIn.humanAmount)

export const isEmptyHumanAmount = (humanAmount: HumanAmount | '') =>
  !humanAmount || bn(humanAmount).eq(0)

export const areEmptyAmounts = (humanAmountsIn: HumanAmountIn[]) =>
  !humanAmountsIn || humanAmountsIn.length === 0 || humanAmountsIn.every(isEmptyAmount)

export function toHumanAmount(tokenAmount: TokenAmount): HumanAmount {
  return formatUnits(tokenAmount.amount, tokenAmount.token.decimals) as HumanAmount
}

export function ensureLastQueryResponse<Q>(
  liquidityActionDescription: string,
  queryResponse?: Q
): Q {
  if (!queryResponse) {
    // This should never happen but this is a check against potential regression bugs
    console.error(`Missing queryResponse in ${liquidityActionDescription}`)
    throw new SentryError(
      `Missing queryResponse.
It looks that you tried to call useBuildCallData before the last query finished generating queryResponse`
    )
  }

  return queryResponse
}

export function supportsNestedLiquidity(pool: Pool) {
  return pool.type === GqlPoolType.ComposableStable || pool.type === GqlPoolType.Weighted
}

export function shouldUseNestedLiquidity(pool: Pool) {
  return supportsNestedLiquidity(pool) && hasNestedPools(pool)
}

export function shouldUseRecoveryRemoveLiquidity(pool: Pool): boolean {
  // DEBUG: Uncomment following if condition to allow testing pools in recovery mode (but note paused). Examples:
  // pools/ethereum/v2/0x0da692ac0611397027c91e559cfd482c4197e4030002000000000000000005c9 (WEIGHTED)
  // pools/ethereum/v2/0x156c02f3f7fef64a3a9d80ccf7085f23cce91d76000000000000000000000570 (COMPOSABLE_STABLE)
  // if (pool.dynamicData.isInRecoveryMode) return true

  // All composableStables V1 are in recovery mode and they should use recovery exit even if they are not paused
  if (isComposableStableV1(pool)) return true

  if (pool.dynamicData.isInRecoveryMode && pool.dynamicData.isPaused) return true

  if (pool.dynamicData.isInRecoveryMode && isAffectedByCspIssue(pool)) return true

  return false
}

export function requiresProportionalInput(poolType: GqlPoolType) {
  return isGyro(poolType)
}

export function toPoolState(pool: Pool): PoolState {
  if (pool.type === 'META_STABLE') {
    throw new Error('META_STABLE pool type is not yet supported by the SDK')
  }

  return {
    id: pool.id as Hex,
    address: pool.address as Address,
    tokens: pool.tokens as MinimalToken[],
    type: mapPoolType(pool.type),
    vaultVersion: 2, //TODO: change to dynamic version when we implement v3 integration
  }
}

//TODO: this should be exposed by the SDK
export function mapPoolToNestedPoolState(pool: Pool): NestedPoolState {
  const pools: NestedPool[] = [
    {
      id: pool.id as Address,
      address: pool.address as Address,
      type: mapPoolType(pool.type),
      level: 1,
      tokens: pool.tokens.map(t => {
        const minimalToken: MinimalToken = {
          address: t.address as Address,
          decimals: t.decimals,
          index: t.index,
        }
        return minimalToken
      }),
    },
  ]

  pool.tokens.forEach(token => {
    if ('pool' in token) {
      // Token represents nested pools only nested if they have a pool property
      if (token.pool === undefined) return

      // map API result to NestedPool
      pools.push({
        id: token.pool.id as Address,
        address: token.pool.address as Address,
        level: 0,
        type: mapPoolType(token.pool.type),
        tokens: token.pool.tokens.map(t => {
          const minimalToken: MinimalToken = {
            address: t.address as Address,
            decimals: t.decimals,
            index: t.index,
          }
          return minimalToken
        }),
      })
    }
  })

  const mainTokens = pool.allTokens
    .filter(t => {
      return t.isMainToken
    })
    .map(t => {
      return {
        address: t.address,
        decimals: t.decimals,
      }
    })

  return {
    pools,
    mainTokens,
  } as NestedPoolState
}

export function toPoolStateWithBalances(pool: Pool): PoolStateWithBalances {
  // TODO: fix in SDK
  const poolType = pool.type === GqlPoolType.Gyro ? 'GYRO2' : pool.type
  return {
    id: pool.id as Hex,
    address: pool.address as Address,
    tokens: pool.tokens as RawPoolToken[],
    type: mapPoolType(poolType),
    totalShares: pool.dynamicData.totalShares as HumanAmount,
    vaultVersion: 2, //TODO: change to dynamic version when we implement v3 integration
  }
}
