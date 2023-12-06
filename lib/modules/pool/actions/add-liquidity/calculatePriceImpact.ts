import { SupportedChainId } from '@/lib/config/config.types'
import { PoolStateInput, PriceImpact } from '@balancer/sdk'
import { AddLiquidityConfigBuilder } from './AddLiquidityConfigBuilder'
import { HumanAmountIn } from './add-liquidity.types'

// TODO: ask SDK team to expose PriceImpactAmount
export type PriceImpactAmount = Awaited<ReturnType<typeof PriceImpact.addLiquidityUnbalanced>>

export const NullPriceImpactAmount: PriceImpactAmount = {
  amount: 0n,
  bps: 0,
  decimal: 0,
  percentage: 0,
}

export async function calculatePriceImpact(
  chainId: SupportedChainId,
  poolStateInput: PoolStateInput,
  humanAmountsIn: HumanAmountIn[]
) {
  const isEmptyAmount = (amountIn: HumanAmountIn) =>
    !amountIn.humanAmount || amountIn.humanAmount === '0'
  if (humanAmountsIn.every(isEmptyAmount)) {
    // Avoid price impact calculation when there are no amounts in
    return NullPriceImpactAmount
  }

  const allowances = {} // TODO: use later

  const addLiquidityBuilder = new AddLiquidityConfigBuilder(
    chainId,
    allowances,
    poolStateInput,
    'unbalanced'
  )

  const addLiquidityInput = addLiquidityBuilder.getUnbalancedAddLiquidityInput({ humanAmountsIn })

  const priceImpactABA: PriceImpactAmount = await PriceImpact.addLiquidityUnbalanced(
    addLiquidityInput,
    poolStateInput
  )
  return priceImpactABA
}
