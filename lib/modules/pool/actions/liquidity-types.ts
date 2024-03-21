import { HumanAmount } from '@balancer/sdk'
import { Address } from 'viem'

export type HumanAmountIn = {
  humanAmount: HumanAmount | ''
  tokenAddress: Address
}

export interface HandlerParams {
  handler: object
}
