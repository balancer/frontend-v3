import { SupportedChainId } from '@/lib/config/config.types'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { Token, TokenAmount } from '@balancer/sdk'
import { HumanAmountIn } from '../../liquidity-types'
import { QueryAddLiquidityOutput, TwammBuildAddLiquidityInputs } from '../add-liquidity.types'
import { AddLiquidityHandler } from './AddLiquidity.handler'

/**
 * TwammAddLiquidityHandler is a handler that implements the
 * AddLiquidityHandler interface for TWAMM adds.
 * This is just a fake example to show how to implement edge-case handlers.
 */
export class TwammAddLiquidityHandler implements AddLiquidityHandler {
  constructor(private chainId: SupportedChainId) {}

  // TODO: This is a non-sense example implementation
  public async queryAddLiquidity(
    humanAmountsIn: HumanAmountIn[]
  ): Promise<QueryAddLiquidityOutput> {
    const tokenAmount = TokenAmount.fromHumanAmount(
      {} as unknown as Token,
      humanAmountsIn[0].humanAmount || '0'
    )
    const bptOut: TokenAmount = tokenAmount
    return { bptOut }
  }

  // TODO: This is a non-sense example implementation
  public async calculatePriceImpact(humanAmountsIn: HumanAmountIn[]): Promise<number> {
    return Number(humanAmountsIn[0].humanAmount)
  }

  // TODO: This is a non-sense example implementation
  public async buildAddLiquidityCallData({
    humanAmountsIn,
    account,
    slippagePercent,
  }: TwammBuildAddLiquidityInputs): Promise<TransactionConfig> {
    if (!account || !slippagePercent) throw new Error('Missing account or slippage')

    const value = BigInt(humanAmountsIn[0].humanAmount)

    return {
      account,
      chainId: this.chainId,
      data: '0xTwammExample',
      to: emptyAddress,
      value,
    }
  }
}
