//TODO: move all this file logic to a better place

import {
  AddLiquidityBaseBuildCallInput,
  AddLiquidityBaseQueryOutput,
  Slippage,
} from '@balancer/sdk'
import { Pool } from '../../../PoolProvider'
import { LiquidityActionHelpers } from '../../LiquidityActionHelpers'
import { HumanTokenAmountWithAddress } from '@/lib/modules/tokens/token.types'

// For now only valid for unbalanced adds
export function constructBaseBuildCallInput({
  humanAmountsIn,
  slippagePercent,
  sdkQueryOutput,
  pool,
}: {
  humanAmountsIn: HumanTokenAmountWithAddress[]
  slippagePercent: string
  sdkQueryOutput: AddLiquidityBaseQueryOutput
  pool: Pool
}): AddLiquidityBaseBuildCallInput {
  const helpers = new LiquidityActionHelpers(pool)

  console.log({ includesNativeAsset: helpers.isNativeAssetIn(humanAmountsIn) })

  const baseBuildCallParams = {
    ...(sdkQueryOutput as AddLiquidityBaseQueryOutput),
    slippage: Slippage.fromPercentage(`${Number(slippagePercent)}`),
    wethIsEth: helpers.isNativeAssetIn(humanAmountsIn),
  }
  // baseBuildCallParams.amountsIn = baseBuildCallParams.amountsIn.filter(
  //   amountIn => amountIn.amount > 0n
  // )
  return baseBuildCallParams
}
