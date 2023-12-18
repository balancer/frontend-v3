import { getDefaultRpcUrl } from '@/lib/modules/web3/Web3Provider'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import {
  PriceImpact,
  RemoveLiquidity,
  RemoveLiquidityKind,
  RemoveLiquidityQueryOutput,
  RemoveLiquidityUnbalancedInput,
  Slippage,
} from '@balancer/sdk'
import { Pool } from '../../../usePool'
import { LiquidityActionHelpers, areEmptyAmounts } from '../../LiquidityActionHelpers'
import {
  BuildLiquidityInputs,
  RemoveLiquidityInputs,
  RemoveLiquidityOutputs,
} from '../remove-liquidity.types'
import { RemoveLiquidityHandler } from './RemoveLiquidity.handler'
import { HumanAmountIn } from '../../liquidity-types'
import { PriceImpactAmount } from '../../add-liquidity/add-liquidity.types'

/**
 * UnbalancedAddLiquidityHandler is a handler that implements the
 * AddLiquidityHandler interface for unbalanced adds, e.g. where the user
 * specifies the token amounts in. It uses the Balancer SDK to implement it's
 * methods. It also handles the case where one of the input tokens is the native
 * asset instead of the wrapped native asset.
 */
export class UnbalancedRemoveLiquidityHandler implements RemoveLiquidityHandler {
  helpers: LiquidityActionHelpers
  sdkQueryOutput?: RemoveLiquidityQueryOutput

  constructor(pool: Pool) {
    this.helpers = new LiquidityActionHelpers(pool)
  }

  public async queryRemoveLiquidity({
    humanAmountsIn,
  }: RemoveLiquidityInputs): Promise<RemoveLiquidityOutputs> {
    const removeLiquidity = new RemoveLiquidity()
    const removeLiquidityInput = this.constructSdkInput(humanAmountsIn)

    this.sdkQueryOutput = await removeLiquidity.query(
      removeLiquidityInput,
      this.helpers.poolStateInput
    )

    return { bptIn: this.sdkQueryOutput.bptIn }
  }

  public async calculatePriceImpact({ humanAmountsIn }: RemoveLiquidityInputs): Promise<number> {
    if (areEmptyAmounts(humanAmountsIn)) {
      // Avoid price impact calculation when there are no amounts in
      return 0
    }

    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    const priceImpactABA: PriceImpactAmount = await PriceImpact.removeLiquidity(
      addLiquidityInput,
      this.helpers.poolStateInput
    )

    return priceImpactABA.decimal
  }

  /*
    sdkQueryOutput is the result of the query that we run in the remove liquidity form
  */
  public async buildRemoveLiquidityTx(
    buildInputs: BuildLiquidityInputs
  ): Promise<TransactionConfig> {
    const { account, slippagePercent } = buildInputs.inputs
    if (!account || !slippagePercent) throw new Error('Missing account or slippage')
    if (!this.sdkQueryOutput) {
      console.error('Missing sdkQueryOutput.')
      throw new Error(
        `Missing sdkQueryOutput.
It looks that you did not call useRemoveLiquidityBtpOutQuery before trying to build the tx config`
      )
    }

    const removeLiquidity = new RemoveLiquidity()

    const { call, to, value } = removeLiquidity.buildCall({
      ...this.sdkQueryOutput,
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

  /**
   * PRIVATE METHODS
   */
  private constructSdkInput(humanAmountsIn: HumanAmountIn[]): RemoveLiquidityUnbalancedInput {
    const amountsOut = this.helpers.toInputAmounts(humanAmountsIn)

    return {
      chainId: this.helpers.chainId,
      rpcUrl: getDefaultRpcUrl(this.helpers.chainId),
      amountsOut,
      kind: RemoveLiquidityKind.Unbalanced,
      //TODO: review this case
      toNativeAsset: this.helpers.isNativeAssetIn(humanAmountsIn),
    }
  }
}
