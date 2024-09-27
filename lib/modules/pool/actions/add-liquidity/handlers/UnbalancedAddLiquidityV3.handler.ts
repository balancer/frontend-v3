/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { AddLiquidity } from '@balancer/sdk'
import { SdkBuildAddLiquidityInput } from '../add-liquidity.types'
import { BaseUnbalancedAddLiquidityHandler } from './BaseUnbalancedAddLiquidity.handler'
import { constructBaseBuildCallInput } from './v3Helpers'

/**
 * UnbalancedAddLiquidityHandlerV3 is a handler that implements the
 * AddLiquidityHandler interface for unbalanced V3 adds, e.g. where the user
 * specifies the token amounts in. It uses the Balancer SDK to implement it's
 * methods. It also handles the case where one of the input tokens is the native
 * asset instead of the wrapped native asset.
 */
export class UnbalancedAddLiquidityHandlerV3 extends BaseUnbalancedAddLiquidityHandler {
  public async buildCallData({
    humanAmountsIn,
    slippagePercent,
    queryOutput,
    account,
    permit2,
  }: SdkBuildAddLiquidityInput): Promise<TransactionConfig> {
    const addLiquidity = new AddLiquidity()

    const buildCallParams = constructBaseBuildCallInput({
      humanAmountsIn,
      sdkQueryOutput: queryOutput.sdkQueryOutput,
      slippagePercent: slippagePercent,
      pool: this.helpers.pool,
    })

    if (!permit2) {
      throw new Error('Permit2 signature is required for V3 pools')
    }

    const { callData, to, value } = addLiquidity.buildCallWithPermit2(buildCallParams, permit2)

    return {
      account,
      chainId: this.helpers.chainId,
      data: callData,
      to,
      value,
    }
  }
}
