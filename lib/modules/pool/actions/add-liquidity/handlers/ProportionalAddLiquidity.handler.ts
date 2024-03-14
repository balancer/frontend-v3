/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getDefaultRpcUrl } from '@/lib/modules/web3/Web3Provider'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import {
  AddLiquidity,
  AddLiquidityKind,
  AddLiquidityProportionalInput,
  InputAmount,
  Slippage,
  calculateProportionalAmounts,
} from '@balancer/sdk'
import { Pool } from '../../../usePool'
import { LiquidityActionHelpers } from '../../LiquidityActionHelpers'
import { HumanAmountIn } from '../../liquidity-types'
import { SdkBuildAddLiquidityInput, SdkQueryAddLiquidityOutput } from '../add-liquidity.types'
import { AddLiquidityHandler } from './AddLiquidity.handler'

/**
 * ProportionalAddLiquidityHandler is a handler that implements the
 * AddLiquidityHandler interface for unbalanced adds, e.g. where the user
 * specifies the token amounts in. It uses the Balancer SDK to implement it's
 * methods. It also handles the case where one of the input tokens is the native
 * asset instead of the wrapped native asset.
 */
export class ProportionalAddLiquidityHandler implements AddLiquidityHandler {
  helpers: LiquidityActionHelpers

  constructor(pool: Pool) {
    this.helpers = new LiquidityActionHelpers(pool)
  }

  public async getPriceImpact(): Promise<number> {
    return 0 // Proportional joins don't have price impact
  }

  public async simulate(humanAmountsIn: HumanAmountIn[]): Promise<SdkQueryAddLiquidityOutput> {
    // This is an edge-case scenario where the user only enters one humanAmount (that we always move to the first position of the humanAmountsIn array)
    const humanAmountIn = this.helpers.toInputAmounts(humanAmountsIn)[0]

    const { bptOut } = calculateProportionalAmounts(
      this.helpers.poolStateWithBalances,
      humanAmountIn
    )

    const addLiquidity = new AddLiquidity()

    const addLiquidityInput = this.constructSdkInput(humanAmountsIn, bptOut)
    const sdkQueryOutput = await addLiquidity.query(addLiquidityInput, this.helpers.poolState)

    return { bptOut: sdkQueryOutput.bptOut, sdkQueryOutput }
  }

  public async buildCallData({
    account,
    slippagePercent,
    queryOutput,
  }: SdkBuildAddLiquidityInput): Promise<TransactionConfig> {
    const addLiquidity = new AddLiquidity()

    const { call, to, value } = addLiquidity.buildCall({
      ...queryOutput.sdkQueryOutput,
      slippage: Slippage.fromPercentage(`${Number(slippagePercent)}`),
      sender: account,
      recipient: account,
      wethIsEth: false, // assuming we don't want to withdraw the native asset over the wrapped native asset for now.
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
  private constructSdkInput(
    humanAmountsIn: HumanAmountIn[],
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
