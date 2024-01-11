import { getChainId, getNetworkConfig } from '@/lib/config/app.config'
import { TokenAmountToApprove } from '@/lib/modules/tokens/approvals/approval-rules'
import { nullAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { HumanAmount, InputAmount, PoolStateInput, TokenAmount } from '@balancer/sdk'
import { Dictionary, keyBy } from 'lodash'
import { formatUnits, parseUnits } from 'viem'
import { Address } from 'wagmi'
import { toPoolStateInput } from '../pool.helpers'
import { Pool } from '../usePool'
import { HumanAmountIn } from './liquidity-types'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { SentryError } from '@/lib/shared/utils/errors'

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

  public get poolStateInput(): PoolStateInput {
    return toPoolStateInput(this.pool)
  }

  public get networkConfig() {
    return getNetworkConfig(this.pool.chain)
  }

  public get chainId() {
    return getChainId(this.pool.chain)
  }

  public get poolTokenAddresses(): Address[] {
    return this.pool.tokens.map(t => t.address as Address)
  }

  public getAmountsToApprove(
    humanAmountsIn: HumanAmountIn[],
    tokensByAddress: Dictionary<GqlToken>
  ): TokenAmountToApprove[] {
    return this.toInputAmounts(humanAmountsIn).map(({ address, rawAmount }, index) => {
      const humanAmountIn = humanAmountsIn[index]
      return {
        tokenAddress: address,
        humanAmount: humanAmountIn.humanAmount || '0',
        rawAmount,
        tokenSymbol: tokensByAddress[humanAmountIn.tokenAddress].symbol,
      }
    })
  }

  public toInputAmounts(humanAmountsIn: HumanAmountIn[]): InputAmount[] {
    const amountsInList: InputAmount[] = this.pool.tokens.map(t => {
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

    const amountsIn = Object.values(amountsInByTokenAddress)
    return amountsIn
  }

  public isNativeAssetIn(humanAmountsIn: HumanAmountIn[]): boolean {
    const nativeAssetAddress = this.networkConfig.tokens.nativeAsset.address

    return humanAmountsIn.some(amountIn => isSameAddress(amountIn.tokenAddress, nativeAssetAddress))
  }
}

export const isEmptyAmount = (amountIn: HumanAmountIn) => isEmptyHumanAmount(amountIn.humanAmount)

export const isEmptyHumanAmount = (humanAmount: HumanAmount | '') =>
  !humanAmount || humanAmount === '0'

export const areEmptyAmounts = (humanAmountsIn: HumanAmountIn[]) =>
  !humanAmountsIn || humanAmountsIn.length === 0 || humanAmountsIn.every(isEmptyAmount)

export const hasValidHumanAmounts = (humanAmountsIn: HumanAmountIn[]) =>
  humanAmountsIn.some(a => a.humanAmount && a.humanAmount !== '0')

export function toHumanAmount(tokenAmount: TokenAmount): HumanAmount {
  return formatUnits(tokenAmount.amount, tokenAmount.token.decimals) as HumanAmount
}

export function ensureLastQueryResponse<Q>(liquidityActionDescription: string, queryResponse?: Q): Q {
  if (!queryResponse) {
    // This should never happen because we don't allow the user to trigger buildLiquidityCallData
    // before the query is loaded.
    console.error(`Missing queryResponse in ${liquidityActionDescription}`)
    throw new SentryError(
      `Missing queryResponse.
It looks that you tried to call useBuildCallData before the last query finished generating queryResponse`
    )
  }

  return queryResponse
}
