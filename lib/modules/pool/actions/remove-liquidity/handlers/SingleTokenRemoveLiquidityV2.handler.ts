import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { getRpcUrl } from '@/lib/modules/web3/transports'
import { SentryError } from '@/lib/shared/utils/errors'
import {
  HumanAmount,
  InputAmount,
  PriceImpact,
  PriceImpactAmount,
  RemoveLiquidity,
  RemoveLiquidityKind,
  RemoveLiquiditySingleTokenExactInInput,
  Slippage,
} from '@balancer/sdk'
import { Address, parseEther } from 'viem'
import { Pool } from '../../../PoolProvider'
import { BPT_DECIMALS } from '../../../pool.constants'
import { isV3Pool } from '../../../pool.helpers'
import {
  LiquidityActionHelpers,
  formatBuildCallParams,
  isEmptyHumanAmount,
} from '../../LiquidityActionHelpers'
import {
  QueryRemoveLiquidityInput,
  SdkBuildRemoveLiquidityInput,
  SdkQueryRemoveLiquidityOutput,
} from '../remove-liquidity.types'
import { RemoveLiquidityHandler } from './RemoveLiquidity.handler'

export class SingleTokenRemoveLiquidityV2Handler implements RemoveLiquidityHandler {
  helpers: LiquidityActionHelpers

  constructor(pool: Pool) {
    this.helpers = new LiquidityActionHelpers(pool)
  }

  public async simulate({
    humanBptIn,
    tokenOut,
  }: QueryRemoveLiquidityInput): Promise<SdkQueryRemoveLiquidityOutput> {
    const removeLiquidity = new RemoveLiquidity()
    const removeLiquidityInput = this.constructSdkInput(humanBptIn, tokenOut)

    const sdkQueryOutput = await removeLiquidity.query(removeLiquidityInput, this.helpers.poolState)

    return { amountsOut: sdkQueryOutput.amountsOut, sdkQueryOutput }
  }

  public async getPriceImpact({
    humanBptIn,
    tokenOut,
  }: QueryRemoveLiquidityInput): Promise<number> {
    if (!tokenOut) {
      throw new SentryError('TokenOut should never be undefined in Single Token remove liquidity')
    }

    if (isEmptyHumanAmount(humanBptIn) || !tokenOut) {
      // Avoid price impact calculation
      return 0
    }

    const removeLiquidityInput = this.constructSdkInput(humanBptIn, tokenOut)

    const priceImpactABA: PriceImpactAmount = await PriceImpact.removeLiquidity(
      removeLiquidityInput,
      this.helpers.poolState
    )

    return priceImpactABA.decimal
  }

  public async buildCallData({
    account,
    slippagePercent,
    queryOutput,
    wethIsEth,
  }: SdkBuildRemoveLiquidityInput): Promise<TransactionConfig> {
    const removeLiquidity = new RemoveLiquidity()

    const baseBuildCallParams = {
      ...queryOutput.sdkQueryOutput,
      slippage: Slippage.fromPercentage(`${Number(slippagePercent)}`),
      wethIsEth,
    }

    const buildCallParams = isV3Pool(this.helpers.pool)
      ? baseBuildCallParams
      : formatBuildCallParams(baseBuildCallParams, account)

    const { callData, to, value } = removeLiquidity.buildCall(buildCallParams)

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
    humanBptIn: HumanAmount,
    tokenOut: Address
  ): RemoveLiquiditySingleTokenExactInInput {
    const bptInInputAmount: InputAmount = {
      rawAmount: parseEther(humanBptIn),
      decimals: BPT_DECIMALS,
      address: this.helpers.pool.address as Address,
    }

    return {
      chainId: this.helpers.chainId,
      rpcUrl: getRpcUrl(this.helpers.chainId),
      bptIn: bptInInputAmount,
      kind: RemoveLiquidityKind.SingleTokenExactIn,
      tokenOut,
    }
  }
}
