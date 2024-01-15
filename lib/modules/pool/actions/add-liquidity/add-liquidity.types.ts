import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { TokenAmount } from '@balancer/sdk'
import { Address } from 'wagmi'

export type QueryAddLiquidityOutput = {
  bptOut: TokenAmount
}

export type MixedAddLiquidityOutput = {
  bptOut: TokenAmount
  transactionConfig?: TransactionConfig
}

export type BuildAddLiquidityInput = {
  account: Address
  slippagePercent: string
}
