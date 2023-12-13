import { getDefaultRpcUrl } from '@/lib/modules/web3/Web3Provider'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import {
  AddLiquidity,
  AddLiquidityKind,
  AddLiquidityUnbalancedInput,
  PriceImpact,
  Slippage,
} from '@balancer/sdk'
import { AddLiquidityHelpers } from '../AddLiquidityHelpers'
import { areEmptyAmounts } from '../add-liquidity.helpers'
import {
  AddLiquidityInputs,
  AddLiquidityOutputs,
  BuildLiquidityInputs,
  HumanAmountIn,
  PriceImpactAmount,
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
  constructor(private addLiquidityHelpers: AddLiquidityHelpers) {}

  public async queryAddLiquidity({
    humanAmountsIn,
  }: AddLiquidityInputs): Promise<AddLiquidityOutputs> {
    const addLiquidity = new AddLiquidity()
    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    const sdkQueryOutput = await addLiquidity.query(
      addLiquidityInput,
      this.addLiquidityHelpers.poolStateInput
    )
    return { bptOut: sdkQueryOutput.bptOut, sdkQueryOutput }
  }

  public async calculatePriceImpact({ humanAmountsIn }: AddLiquidityInputs): Promise<number> {
    if (areEmptyAmounts(humanAmountsIn)) {
      // Avoid price impact calculation when there are no amounts in
      return 0
    }

    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    const priceImpactABA: PriceImpactAmount = await PriceImpact.addLiquidityUnbalanced(
      addLiquidityInput,
      this.addLiquidityHelpers.poolStateInput
    )

    return priceImpactABA.decimal
  }

  /*
    sdkQueryOutput is the result of the query that we run in the add liquidity form
  */
  public async buildAddLiquidityTx(buildInputs: BuildLiquidityInputs): Promise<TransactionConfig> {
    const { account, slippagePercent } = buildInputs.inputs
    const sdkQueryOutput = buildInputs.sdkQueryOutput
    if (!account || !slippagePercent) throw new Error('Missing account or slippage')
    if (!sdkQueryOutput) throw new Error('Missing sdkQueryOutput')

    const addLiquidity = new AddLiquidity()

    const { call, to, value } = addLiquidity.buildCall({
      ...sdkQueryOutput,
      slippage: Slippage.fromPercentage(`${Number(slippagePercent)}`),
      sender: account,
      recipient: account,
    })

    return {
      account,
      chainId: this.addLiquidityHelpers.chainId,
      data: call,
      to,
      value,
    }
  }

  /**
   * PRIVATE METHODS
   */
  private constructSdkInput(humanAmountsIn: HumanAmountIn[]): AddLiquidityUnbalancedInput {
    const amountsIn = this.addLiquidityHelpers.toInputAmounts(humanAmountsIn)

    return {
      chainId: this.addLiquidityHelpers.chainId,
      rpcUrl: getDefaultRpcUrl(this.addLiquidityHelpers.chainId),
      amountsIn,
      kind: AddLiquidityKind.Unbalanced,
      useNativeAssetAsWrappedAmountIn: this.addLiquidityHelpers.isNativeAssetIn(humanAmountsIn),
    }
  }
}
