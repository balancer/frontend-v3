/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HumanTokenAmountWithAddress } from '@/lib/modules/tokens/token.types'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { getRpcUrl } from '@/lib/modules/web3/transports'
import {
  AddLiquidity,
  AddLiquidityKind,
  AddLiquidityUnbalancedInput,
  PriceImpact,
  PriceImpactAmount,
} from '@balancer/sdk'
import { Pool } from '../../../PoolProvider'
import { LiquidityActionHelpers, areEmptyAmounts } from '../../LiquidityActionHelpers'
import { SdkBuildAddLiquidityInput, SdkQueryAddLiquidityOutput } from '../add-liquidity.types'
import { AddLiquidityHandler } from './AddLiquidity.handler'

/**
 * UnbalancedAddLiquidityHandler is a handler that implements the
 * AddLiquidityHandler interface for unbalanced adds, e.g. where the user
 * specifies the token amounts in. It uses the Balancer SDK to implement it's
 * methods. It also handles the case where one of the input tokens is the native
 * asset instead of the wrapped native asset.
 */
export abstract class BaseUnbalancedAddLiquidityHandler implements AddLiquidityHandler {
  protected helpers: LiquidityActionHelpers

  constructor(pool: Pool) {
    this.helpers = new LiquidityActionHelpers(pool)
  }

  public async simulate(
    humanAmountsIn: HumanTokenAmountWithAddress[]
  ): Promise<SdkQueryAddLiquidityOutput> {
    const addLiquidity = new AddLiquidity()
    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    const sdkQueryOutput = await addLiquidity.query(addLiquidityInput, this.helpers.poolState)

    return { bptOut: sdkQueryOutput.bptOut, sdkQueryOutput }
  }

  public async getPriceImpact(humanAmountsIn: HumanTokenAmountWithAddress[]): Promise<number> {
    if (areEmptyAmounts(humanAmountsIn)) {
      // Avoid price impact calculation when there are no amounts in
      return 0
    }

    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    const priceImpactABA: PriceImpactAmount = await PriceImpact.addLiquidityUnbalanced(
      addLiquidityInput,
      this.helpers.poolState
    )

    return priceImpactABA.decimal
  }

  public abstract buildCallData(input: SdkBuildAddLiquidityInput): Promise<TransactionConfig>

  /**
   * PRIVATE METHODS
   */
  protected constructSdkInput(
    humanAmountsIn: HumanTokenAmountWithAddress[]
  ): AddLiquidityUnbalancedInput {
    const amountsIn = this.helpers.toSdkInputAmounts(humanAmountsIn)

    return {
      chainId: this.helpers.chainId,
      rpcUrl: getRpcUrl(this.helpers.chainId),
      amountsIn,
      kind: AddLiquidityKind.Unbalanced,
    }
  }
}
