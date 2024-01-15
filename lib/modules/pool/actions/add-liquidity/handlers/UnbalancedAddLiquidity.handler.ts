/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getDefaultRpcUrl } from '@/lib/modules/web3/Web3Provider'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import {
  AddLiquidity,
  AddLiquidityKind,
  AddLiquidityQueryOutput,
  AddLiquidityUnbalancedInput,
  Address,
  PriceImpact,
  PriceImpactAmount,
  Slippage,
} from '@balancer/sdk'
import { Pool } from '../../../usePool'
import {
  LiquidityActionHelpers,
  areEmptyAmounts,
  ensureLastQueryResponse,
} from '../../LiquidityActionHelpers'
import { HumanAmountIn } from '../../liquidity-types'
import {
  BuildAddLiquidityInput,
  MixedAddLiquidityOutput,
  QueryAddLiquidityOutput,
} from '../add-liquidity.types'
import { AddLiquidityHandler } from './AddLiquidity.handler'

/**
 * UnbalancedAddLiquidityHandler is a handler that implements the
 * AddLiquidityHandler interface for unbalanced adds, e.g. where the user
 * specifies the token amounts in. It uses the Balancer SDK to implement it's
 * methods. It also handles the case where one of the input tokens is the native
 * asset instead of the wrapped native asset.
 */
export class UnbalancedAddLiquidityHandler implements AddLiquidityHandler {
  helpers: LiquidityActionHelpers
  queryResponse?: AddLiquidityQueryOutput

  constructor(pool: Pool) {
    this.helpers = new LiquidityActionHelpers(pool)
  }

  public async queryAddLiquidity(
    humanAmountsIn: HumanAmountIn[]
  ): Promise<QueryAddLiquidityOutput> {
    // Deletes the previous queryResponse to enforce that we don't build callData with an outdated queryResponse (while a new one is loading)
    this.queryResponse = undefined
    const addLiquidity = new AddLiquidity()
    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    this.queryResponse = await addLiquidity.query(addLiquidityInput, this.helpers.poolStateInput)

    return { bptOut: this.queryResponse.bptOut }
  }

  public async calculatePriceImpact(humanAmountsIn: HumanAmountIn[]): Promise<number> {
    if (areEmptyAmounts(humanAmountsIn)) {
      // Avoid price impact calculation when there are no amounts in
      return 0
    }

    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    const priceImpactABA: PriceImpactAmount = await PriceImpact.addLiquidityUnbalanced(
      addLiquidityInput,
      this.helpers.poolStateInput
    )

    return priceImpactABA.decimal
  }

  public async buildAddLiquidityCallData({
    account,
    slippagePercent,
  }: BuildAddLiquidityInput): Promise<TransactionConfig> {
    this.queryResponse = ensureLastQueryResponse('Unbalanced add liquidity', this.queryResponse)

    const addLiquidity = new AddLiquidity()

    const { call, to, value } = addLiquidity.buildCall({
      ...this.queryResponse,
      slippage: Slippage.fromPercentage(`${Number(slippagePercent)}`),
      sender: account,
      recipient: account,
    })

    return {
      account,
      chainId: this.helpers.chainId,
      data: call,
      to,
      value,
    }
  }

  public async mixed(
    humanAmountsIn: HumanAmountIn[],
    account: Address,
    slippagePercent: string,
    isBuildCallReady: boolean // This is true when the user isconnected and the flow is in the "build call data step" (for example, after the approval steps are finished)
  ): Promise<MixedAddLiquidityOutput> {
    const queryResponse = await this.queryAddLiquidity(humanAmountsIn)

    if (!isBuildCallReady) {
      return {
        bptOut: queryResponse.bptOut,
      }
    }

    const buildCallDataResponse = await this.buildAddLiquidityCallData({ account, slippagePercent })
    return {
      bptOut: queryResponse.bptOut,
      transactionConfig: buildCallDataResponse,
    }
  }

  /**
   * PRIVATE METHODS
   */
  private constructSdkInput(humanAmountsIn: HumanAmountIn[]): AddLiquidityUnbalancedInput {
    const amountsIn = this.helpers.toInputAmounts(humanAmountsIn)

    return {
      chainId: this.helpers.chainId,
      rpcUrl: getDefaultRpcUrl(this.helpers.chainId),
      amountsIn,
      kind: AddLiquidityKind.Unbalanced,
      useNativeAssetAsWrappedAmountIn: this.helpers.isNativeAssetIn(humanAmountsIn),
    }
  }
}
