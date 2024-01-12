import { getDefaultRpcUrl } from '@/lib/modules/web3/Web3Provider'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import {
  HumanAmount,
  InputAmount,
  PriceImpact,
  PriceImpactAmount,
  RemoveLiquidity,
  RemoveLiquidityKind,
  RemoveLiquidityQueryOutput,
  RemoveLiquiditySingleTokenInput,
  Slippage,
} from '@balancer/sdk'
import { Address, parseEther } from 'viem'
import { BPT_DECIMALS } from '../../../pool.constants'
import { Pool } from '../../../usePool'
import {
  LiquidityActionHelpers,
  ensureLastQueryResponse,
  isEmptyHumanAmount,
} from '../../LiquidityActionHelpers'
import {
  BuildRemoveLiquidityInput,
  QueryRemoveLiquidityOutput,
  SingleTokenRemoveLiquidityInput,
} from '../remove-liquidity.types'
import { RemoveLiquidityHandler } from './RemoveLiquidity.handler'

export class SingleTokenRemoveLiquidityHandler implements RemoveLiquidityHandler {
  helpers: LiquidityActionHelpers
  queryResponse?: RemoveLiquidityQueryOutput

  constructor(pool: Pool) {
    this.helpers = new LiquidityActionHelpers(pool)
  }

  public async queryRemoveLiquidity({
    humanBptIn,
    tokenOut,
  }: SingleTokenRemoveLiquidityInput): Promise<QueryRemoveLiquidityOutput> {
    if (!tokenOut) return { amountsOut: [] }

    const removeLiquidity = new RemoveLiquidity()
    const removeLiquidityInput = this.constructSdkInput(humanBptIn, tokenOut)

    this.queryResponse = await removeLiquidity.query(
      removeLiquidityInput,
      this.helpers.poolStateInput
    )

    return { amountsOut: this.queryResponse.amountsOut }
  }

  public async calculatePriceImpact({
    humanBptIn,
    tokenOut,
  }: SingleTokenRemoveLiquidityInput): Promise<number> {
    if (isEmptyHumanAmount(humanBptIn) || !tokenOut) {
      // Avoid price impact calculation
      return 0
    }

    const removeLiquidityInput = this.constructSdkInput(humanBptIn, tokenOut)

    const priceImpactABA: PriceImpactAmount = await PriceImpact.removeLiquidity(
      removeLiquidityInput,
      this.helpers.poolStateInput
    )

    return priceImpactABA.decimal
  }

  public async buildRemoveLiquidityCallData({
    account,
    slippagePercent,
  }: BuildRemoveLiquidityInput): Promise<TransactionConfig> {
    this.queryResponse = ensureLastQueryResponse(
      'Single token remove liquidity',
      this.queryResponse
    )

    const removeLiquidity = new RemoveLiquidity()

    const { call, to, value } = removeLiquidity.buildCall({
      ...this.queryResponse,
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
    humanBptIn: HumanAmount,
    tokenOut: Address
  ): RemoveLiquiditySingleTokenInput {
    const bptInInputAmount: InputAmount = {
      rawAmount: parseEther(humanBptIn),
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
