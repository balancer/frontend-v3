import { HumanAmount } from '@balancer/sdk'
import { parseUnits } from 'viem'

export function testRawAmount(humanAmount: HumanAmount) {
  return parseUnits(humanAmount, 18)
}
