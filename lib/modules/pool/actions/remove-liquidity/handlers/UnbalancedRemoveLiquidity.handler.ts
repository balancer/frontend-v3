import { getDefaultRpcUrl } from '@/lib/modules/web3/Web3Provider'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import {
  RemoveLiquidity,
  RemoveLiquidityKind,
  RemoveLiquidityUnbalancedInput,
  Slippage,
} from '@balancer/sdk'
import { Pool } from '../../../usePool'
import { LiquidityActionHelpers } from '../../LiquidityActionHelpers'
import {
  BuildLiquidityInputs,
  RemoveLiquidityInputs,
  RemoveLiquidityOutputs,
} from '../remove-liquidity.types'
import { RemoveLiquidityHandler } from './RemoveLiquidity.handler'
import { HumanAmountIn } from '../../liquidity-types'

/**
 * UnbalancedAddLiquidityHandler is a handler that implements the
 * AddLiquidityHandler interface for unbalanced adds, e.g. where the user
 * specifies the token amounts in. It uses the Balancer SDK to implement it's
 * methods. It also handles the case where one of the input tokens is the native
 * asset instead of the wrapped native asset.
 */
export class UnbalancedRemoveLiquidityHandler implements RemoveLiquidityHandler {
  addLiquidityHelpers: LiquidityActionHelpers
  constructor(pool: Pool) {
    this.addLiquidityHelpers = new LiquidityActionHelpers(pool)
  }

  public async queryRemoveLiquidity({
    humanAmountsIn,
  }: RemoveLiquidityInputs): Promise<RemoveLiquidityOutputs> {
    const removeLiquidity = new RemoveLiquidity()
    const removeLiquidityInput = this.constructSdkInput(humanAmountsIn)

    const sdkQueryOutput = await removeLiquidity.query(
      removeLiquidityInput,
      this.addLiquidityHelpers.poolStateInput
    )
    return { bptIn: sdkQueryOutput.bptIn, sdkQueryOutput }
  }

  /*
    sdkQueryOutput is the result of the query that we run in the remove liquidity form
  */
  public async buildRemoveLiquidityTx(
    buildInputs: BuildLiquidityInputs
  ): Promise<TransactionConfig> {
    const { account, slippagePercent } = buildInputs.inputs
    const sdkQueryOutput = buildInputs.sdkQueryOutput
    if (!account || !slippagePercent) throw new Error('Missing account or slippage')
    if (!sdkQueryOutput) throw new Error('Missing sdkQueryOutput')

    const removeLiquidity = new RemoveLiquidity()

    const { call, to, value } = removeLiquidity.buildCall({
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
  private constructSdkInput(humanAmountsIn: HumanAmountIn[]): RemoveLiquidityUnbalancedInput {
    const amountsOut = this.addLiquidityHelpers.toInputAmounts(humanAmountsIn)

    return {
      chainId: this.addLiquidityHelpers.chainId,
      rpcUrl: getDefaultRpcUrl(this.addLiquidityHelpers.chainId),
      amountsOut,
      kind: RemoveLiquidityKind.Unbalanced,
      //TODO: review this case
      toNativeAsset: this.addLiquidityHelpers.isNativeAssetIn(humanAmountsIn),
    }
  }
}
