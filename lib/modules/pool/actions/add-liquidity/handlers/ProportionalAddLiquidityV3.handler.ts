/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { AddLiquidity } from '@balancer/sdk'
import { SdkBuildAddLiquidityInput } from '../add-liquidity.types'
import { BaseProportionalAddLiquidityHandler } from './BaseProportionalAddLiquidity.handler'
import { constructBaseBuildCallInput } from './v3Helpers'

export class ProportionalAddLiquidityHandlerV3 extends BaseProportionalAddLiquidityHandler {
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
      throw new Error('Permit2 signature is required in V3 Proportional adds')
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
