import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { AddLiquidity, HumanAmount, Slippage } from '@balancer/sdk'
import { SdkBuildAddLiquidityInput } from '../add-liquidity.types'
import { BaseProportionalAddLiquidityHandler } from './BaseProportionalAddLiquidity.handler'

/**
 * ProportionalAddLiquidityHandler is a handler that implements the
 * AddLiquidityHandler interface for strictly proportional adds, e.g. where the user
 * specifies the token amounts in. It uses the Balancer SDK to calculate the BPT
 * out with the current pools state, then uses that bptOut for the query.
 */
export class ProportionalAddLiquidityHandler extends BaseProportionalAddLiquidityHandler {
  public async buildCallData({
    account,
    queryOutput,
    humanAmountsIn,
    slippagePercent,
  }: SdkBuildAddLiquidityInput): Promise<TransactionConfig> {
    const addLiquidity = new AddLiquidity()

    const { callData, to, value } = addLiquidity.buildCall({
      ...queryOutput.sdkQueryOutput,
      slippage: Slippage.fromPercentage(slippagePercent as HumanAmount),
      sender: account,
      recipient: account,
      wethIsEth: this.helpers.isNativeAssetIn(humanAmountsIn),
    })

    return {
      account,
      chainId: this.helpers.chainId,
      data: callData,
      to,
      value,
    }
  }
}
