/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getDefaultRpcUrl } from '@/lib/modules/web3/ChainConfig'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import {
  AddLiquidity,
  AddLiquidityKind,
  AddLiquidityProportionalInput,
  InputAmount,
  Slippage,
  calculateProportionalAmounts,
} from '@balancer/sdk'
import { Pool } from '../../../PoolProvider'
import { LiquidityActionHelpers } from '../../LiquidityActionHelpers'
import { SdkBuildAddLiquidityInput, SdkQueryAddLiquidityOutput } from '../add-liquidity.types'
import { AddLiquidityHandler } from './AddLiquidity.handler'
import { HumanTokenAmountWithAddress } from '@/lib/modules/tokens/token.types'

/**
 * ProportionalAddLiquidityHandler is a handler that implements the
 * AddLiquidityHandler interface for strictly proportional adds, e.g. where the user
 * specifies the token amounts in. It uses the Balancer SDK to calculate the BPT
 * out with the current pools state, then uses that bptOut for the query.
 */
export class ProportionalAddLiquidityHandler implements AddLiquidityHandler {
  helpers: LiquidityActionHelpers

  constructor(pool: Pool) {
    this.helpers = new LiquidityActionHelpers(pool)
  }

  public async getPriceImpact(): Promise<number> {
    return 0 // Proportional joins don't have price impact
  }

  public async simulate(
    humanAmountsIn: HumanTokenAmountWithAddress[]
  ): Promise<SdkQueryAddLiquidityOutput> {
    // This is an edge-case scenario where the user only enters one humanAmount (that we always move to the first position of the humanAmountsIn array)
    const humanAmountIn = this.helpers.toSdkInputAmounts(humanAmountsIn)[0]

    const { bptAmount } = calculateProportionalAmounts(
      this.helpers.poolStateWithBalances,
      humanAmountIn
    )

    bptAmount.rawAmount = bptAmount.rawAmount - 10n // Subtract 10 wei to ensure query doesn't fail when user maxes out balance.

    const addLiquidity = new AddLiquidity()

    const addLiquidityInput = this.constructSdkInput(humanAmountsIn, bptAmount)
    const sdkQueryOutput = await addLiquidity.query(addLiquidityInput, this.helpers.poolState)

    return { bptOut: sdkQueryOutput.bptOut, sdkQueryOutput }
  }

  public async buildCallData({
    account,
    slippagePercent,
    queryOutput,
    humanAmountsIn,
  }: SdkBuildAddLiquidityInput): Promise<TransactionConfig> {
    const addLiquidity = new AddLiquidity()

    const { callData, to, value } = addLiquidity.buildCall({
      ...queryOutput.sdkQueryOutput,
      slippage: Slippage.fromPercentage(`${Number(slippagePercent)}`),
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

  /**
   * PRIVATE METHODS
   */
  private constructSdkInput(
    humanAmountsIn: HumanTokenAmountWithAddress[],
    bptOut: InputAmount
  ): AddLiquidityProportionalInput {
    return {
      chainId: this.helpers.chainId,
      rpcUrl: getDefaultRpcUrl(this.helpers.chainId),
      bptOut,
      kind: AddLiquidityKind.Proportional,
    }
  }
}
