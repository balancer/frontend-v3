import { SupportedChainId } from '@/lib/config/config.types'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { Token, TokenAmount } from '@balancer/sdk'
import { AddLiquidityInputs, AddLiquidityOutputs } from '../add-liquidity.types'
import { AddLiquidityHandler } from './AddLiquidity.handler'

/**
 * TwammAddLiquidityHandler is a handler that implements the
 * AddLiquidityHandler interface for TWAMM adds.
 * This is just a fake example to show how to implement edge-case handlers.
 */
export function buildTwammAddLiquidityHandler(chainId: SupportedChainId): AddLiquidityHandler {
  return {
    queryAddLiquidity,
    calculatePriceImpact,
    buildAddLiquidityTx,
  }

  // TODO: This is a non-sense example implementation
  async function queryAddLiquidity({
    humanAmountsIn,
  }: AddLiquidityInputs): Promise<AddLiquidityOutputs> {
    const tokenAmount = TokenAmount.fromHumanAmount(
      {} as unknown as Token,
      humanAmountsIn[0].humanAmount || '0'
    )
    const bptOut: TokenAmount = tokenAmount
    return { bptOut }
  }

  // TODO: This is a non-sense example implementation
  async function calculatePriceImpact({ humanAmountsIn }: AddLiquidityInputs): Promise<number> {
    return Number(humanAmountsIn[0].humanAmount)
  }

  // TODO: This is a non-sense example implementation
  async function buildAddLiquidityTx({
    humanAmountsIn,
    account,
    slippagePercent,
  }: AddLiquidityInputs): Promise<TransactionConfig> {
    if (!account || !slippagePercent) throw new Error('Missing account or slippage')

    const value = BigInt(humanAmountsIn[0].humanAmount)

    return {
      account,
      chainId,
      data: '0xTwammExample',
      to: emptyAddress,
      value,
    }
  }
}
