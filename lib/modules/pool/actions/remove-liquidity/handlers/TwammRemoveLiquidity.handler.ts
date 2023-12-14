import { SupportedChainId } from '@/lib/config/config.types'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { Token, TokenAmount } from '@balancer/sdk'
import {
  RemoveLiquidityInputs,
  RemoveLiquidityOutputs,
  BuildLiquidityInputs,
} from '../remove-liquidity.types'
import { RemoveLiquidityHandler } from './RemoveLiquidity.handler'

/**
 * TwammAddLiquidityHandler is a handler that implements the
 * RemoveLiquidityHandler interface for TWAMM adds.
 * This is just a fake example to show how to implement edge-case handlers.
 */
export class TwammRemoveLiquidityHandler implements RemoveLiquidityHandler {
  constructor(private chainId: SupportedChainId) {}

  // TODO: This is a non-sense example implementation
  public async queryRemoveLiquidity({
    humanAmountsIn,
  }: RemoveLiquidityInputs): Promise<RemoveLiquidityOutputs> {
    const tokenAmount = TokenAmount.fromHumanAmount(
      {} as unknown as Token,
      humanAmountsIn[0].humanAmount || '0'
    )
    const bptIn: TokenAmount = tokenAmount
    return { bptIn }
  }

  // TODO: This is a non-sense example implementation
  public async buildRemoveLiquidityTx(
    buildInputs: BuildLiquidityInputs
  ): Promise<TransactionConfig> {
    const { humanAmountsIn, account, slippagePercent } = buildInputs.inputs
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
