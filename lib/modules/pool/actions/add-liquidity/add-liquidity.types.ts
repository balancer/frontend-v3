import { TokenAmount } from '@balancer/sdk'
import { Address } from 'wagmi'
import { HumanAmountIn } from '../liquidity-types'

// Default handlers (UnbalancedAddLiquidityHandler) that use the SDK to query/build the transaction will return sdkQueryOutput
// Edge-case handlers (TwammAddLiquidityHandler) that do not use the SDK edge-case handlers will not return sdkQueryOutput
export interface QueryAddLiquidityOutput {
  bptOut: TokenAmount
}

export interface BuildAddLiquidityInputs {
  humanAmountsIn: HumanAmountIn[]
  account: Address
  slippagePercent: string
  queryOutput: QueryAddLiquidityOutput
}
