import { AddLiquidityService } from '../AddLiquidityService'
import { AddLiquidityInputs, AddLiquidityOutputs } from '../add-liquidity.types'

export abstract class AddLiquidityHandler {
  constructor(public readonly service: AddLiquidityService) {}

  // Query the SDK for the expected output of adding liquidity
  abstract queryAddLiquidity(inputs: AddLiquidityInputs): Promise<AddLiquidityOutputs>
  // Calculate the price impact of adding liquidity
  abstract calculatePriceImpact(inputs: AddLiquidityInputs): Promise<number>
  // Build tx payload for adding liquidity
  abstract buildAddLiqudityTx(inputs: AddLiquidityInputs): Promise<any>
}
