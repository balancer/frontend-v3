import { TokenAmount } from '@balancer/sdk'
import { Address } from 'wagmi'
import { HumanAmountIn } from '../liquidity-types'

export type QueryAddLiquidityOutput = {
  bptOut: TokenAmount
}

export interface BuildAddLiquidityInput {
  humanAmountsIn: HumanAmountIn[]
  account: Address
  slippagePercent: string
  queryOutput: QueryAddLiquidityOutput
}
