import { HumanAmount } from '@balancer/sdk'
import { Address } from 'wagmi'

export type HumanAmountIn = {
  humanAmount: HumanAmount | ''
  tokenAddress: Address
}
