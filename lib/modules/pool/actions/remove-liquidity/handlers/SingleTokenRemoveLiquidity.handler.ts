import { getDefaultRpcUrl } from '@/lib/modules/web3/Web3Provider'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import {
  HumanAmount,
  InputAmount,
  PriceImpact,
  RemoveLiquidity,
  RemoveLiquidityKind,
  RemoveLiquidityQueryOutput,
  RemoveLiquiditySingleTokenInput,
  Slippage,
} from '@balancer/sdk'
import { Address, parseEther } from 'viem'
import { BPT_DECIMALS } from '../../../pool.constants'
import { Pool } from '../../../usePool'
import { LiquidityActionHelpers, isEmptyHumanAmount } from '../../LiquidityActionHelpers'
import { PriceImpactAmount } from '../../add-liquidity/add-liquidity.types'
import {
  BuildLiquidityInputs,
  RemoveLiquidityOutputs,
  SingleTokenRemoveLiquidityInputs,
} from '../remove-liquidity.types'
import { RemoveLiquidityHandler, RemoveLiquidityHandlerType } from './RemoveLiquidity.handler'

export class SingleTokenRemoveLiquidityHandler implements RemoveLiquidityHandler {
  type: RemoveLiquidityHandlerType = 'single'

  helpers: LiquidityActionHelpers
  sdkQueryOutput?: RemoveLiquidityQueryOutput

  constructor(pool: Pool) {
    this.helpers = new LiquidityActionHelpers(pool)
  }

  public async queryRemoveLiquidity({
    bptInUnits,
    tokenOut,
  }: SingleTokenRemoveLiquidityInputs): Promise<RemoveLiquidityOutputs> {
    if (!tokenOut) return { amountsOut: [] }

    const removeLiquidity = new RemoveLiquidity()
    const removeLiquidityInput = this.constructSdkInput(bptInUnits, tokenOut)

    this.sdkQueryOutput = await removeLiquidity.query(
      removeLiquidityInput,
      this.helpers.poolStateInput
    )

    return { amountsOut: this.sdkQueryOutput.amountsOut }
  }

  public async calculatePriceImpact({
    bptInUnits,
    tokenOut,
  }: SingleTokenRemoveLiquidityInputs): Promise<number> {
    if (isEmptyHumanAmount(bptInUnits) || !tokenOut) {
      // Avoid price impact calculation
      return 0
    }

    const removeLiquidityInput = this.constructSdkInput(bptInUnits, tokenOut)

    const priceImpactABA: PriceImpactAmount = await PriceImpact.removeLiquidity(
      removeLiquidityInput,
      this.helpers.poolStateInput
    )

    return priceImpactABA.decimal
  }

  /*
    sdkQueryOutput is the result of the query that we run in the remove liquidity form
  */
  public async buildRemoveLiquidityTx(
    buildInputs: BuildLiquidityInputs
  ): Promise<TransactionConfig> {
    const { account, slippagePercent } = buildInputs.inputs
    if (!account || !slippagePercent) throw new Error('Missing account or slippage')
    if (!this.sdkQueryOutput) {
      console.error('Missing sdkQueryOutput in buildRemoveLiquidityTx')
      throw new Error(
        `Missing sdkQueryOutput.
It looks that you did not call useRemoveLiquidityBtpOutQuery before trying to build the tx config`
      )
    }

    const removeLiquidity = new RemoveLiquidity()

    const { call, to, value } = removeLiquidity.buildCall({
      ...this.sdkQueryOutput,
      slippage: Slippage.fromPercentage(`${Number(slippagePercent)}`),
      sender: account,
      recipient: account,
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
    bptInUnits: HumanAmount,
    tokenOut: Address
  ): RemoveLiquiditySingleTokenInput {
    const bptInInputAmount: InputAmount = {
      rawAmount: parseEther(bptInUnits),
      decimals: BPT_DECIMALS,
      address: this.helpers.pool.address as Address,
    }

    return {
      chainId: this.helpers.chainId,
      rpcUrl: getDefaultRpcUrl(this.helpers.chainId),
      bptIn: bptInInputAmount,
      kind: RemoveLiquidityKind.SingleToken,
      tokenOut,
      //TODO: review this case
      // toNativeAsset: this.helpers.isNativeAssetIn(humanAmountsIn),
    }
  }
}
