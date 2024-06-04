import { getChainId, getNetworkConfig } from '@/lib/config/app.config'
import { TokenAmountToApprove } from '@/lib/modules/tokens/approvals/approval-rules'
import { nullAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { GqlChain, GqlPoolType } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { SentryError } from '@/lib/shared/utils/errors'
import { bn } from '@/lib/shared/utils/numbers'
import {
  HumanAmount,
  InputAmount,
  MinimalToken,
  NestedPoolState,
  PoolState,
  TokenAmount,
  mapPoolToNestedPoolState,
  mapPoolType,
  PoolStateWithBalances,
} from '@balancer/sdk'
import { keyBy } from 'lodash'
import { Hex, formatUnits, parseUnits, Address } from 'viem'
import { isAffectedByCspIssue } from '../alerts/pool-issues/PoolIssue.rules'
import { hasNestedPools, isComposableStableV1, isGyro } from '../pool.helpers'
import { Pool } from '../PoolProvider'
import {
  isNativeAsset,
  isWrappedNativeAsset,
  swapNativeWithWrappedNative,
} from '../../tokens/token.helpers'
import { HumanTokenAmountWithAddress } from '../../tokens/token.types'

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
    // TODO: PoolGetPool should be exposed by the SDK
    type PoolGetPool = Parameters<typeof mapPoolToNestedPoolState>[0]
    return mapPoolToNestedPoolState(this.pool as PoolGetPool)
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

  public getAmountsToApprove(
    humanAmountsIn: HumanTokenAmountWithAddress[]
  ): TokenAmountToApprove[] {
    return this.toInputAmounts(humanAmountsIn).map(({ address, rawAmount }) => {
      return {
        tokenAddress: address,
        requiredRawAmount: rawAmount,
        requestedRawAmount: rawAmount, //This amount will be probably replaced by MAX_BIGINT depending on the approval rules
      }
    })
  }

  public toInputAmounts(humanAmountsIn: HumanTokenAmountWithAddress[]): InputAmount[] {
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
      // if native token swap with wrapped native token
      const tokenAddressToCheck = swapNativeWithWrappedNative(tokenAddress, this.pool.chain)

      if (!amountsInByTokenAddress[tokenAddressToCheck]) {
        throw new Error(
          `Provided token address ${tokenAddressToCheck} not found in pool tokens [${Object.keys(
            amountsInByTokenAddress
          ).join(' , \n')}]`
        )
      }
      const decimals = amountsInByTokenAddress[tokenAddressToCheck].decimals
      amountsInByTokenAddress[tokenAddressToCheck].rawAmount = parseUnits(humanAmount, decimals)
    })

    return Object.values(amountsInByTokenAddress).filter(a => a.rawAmount > 0n)
  }

  public isNativeAssetIn(humanAmountsIn: HumanTokenAmountWithAddress[]): boolean {
    const nativeAssetAddress = this.networkConfig.tokens.nativeAsset.address

    return humanAmountsIn.some(amountIn => isSameAddress(amountIn.tokenAddress, nativeAssetAddress))
  }
}

export const isEmptyAmount = (amountIn: HumanTokenAmountWithAddress) =>
  isEmptyHumanAmount(amountIn.humanAmount)

export const isEmptyHumanAmount = (humanAmount: HumanAmount | '') =>
  !humanAmount || bn(humanAmount).eq(0)

export const areEmptyAmounts = (humanAmountsIn: HumanTokenAmountWithAddress[]) =>
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

export function supportsProportionalAdds(pool: Pool) {
  // Nested pools do not support proportional adds (addable tokens feature)
  return !shouldUseNestedLiquidity(pool)
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

export function requiresProportionalInput(poolType: GqlPoolType): boolean {
  return isGyro(poolType)
}

export function toPoolState(pool: Pool): PoolState {
  return {
    id: pool.id as Hex,
    address: pool.address as Address,
    tokens: pool.poolTokens as MinimalToken[],
    type: mapPoolType(pool.type),
    vaultVersion: pool.vaultVersion,
  }
}

export function toPoolStateWithBalances(pool: Pool): PoolStateWithBalances {
  return {
    id: pool.id as Hex,
    address: pool.address as Address,
    type: mapPoolType(pool.type),
    tokens: pool.poolTokens.map((t, index) => ({
      index,
      address: t.address as Address,
      balance: t.balance as HumanAmount,
      decimals: t.decimals,
    })),
    totalShares: pool.dynamicData.totalShares as HumanAmount,
    vaultVersion: pool.vaultVersion,
  }
}

/**
 * Filters the human amounts based on whether the token to filter:
 * - is already in the array and
 * - is native and the wrapped native token is already in the array and
 * - is wrapped native and the native token is already in the array
 *
 * @param {HumanAmoHumanTokenAmountWithAddressuntIn[]} humanAmountsIn - The array of human amounts to filter.
 * @param {Address} tokenAddress - The token address to compare against.
 * @param {GqlChain} chain - The chain type for comparison.
 * @return {HumanTokenAmountWithAddress[]} The filtered array of human amounts.
 */
export function filterHumanAmountsIn(
  humanAmountsIn: HumanTokenAmountWithAddress[],
  tokenAddress: Address,
  chain: GqlChain
) {
  return humanAmountsIn.filter(
    amountIn =>
      !isSameAddress(amountIn.tokenAddress, tokenAddress) &&
      !(isNativeAsset(tokenAddress, chain) && isWrappedNativeAsset(amountIn.tokenAddress, chain)) &&
      !(isNativeAsset(amountIn.tokenAddress, chain) && isWrappedNativeAsset(tokenAddress, chain))
  )
}
