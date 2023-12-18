import { TokenAmount } from '@balancer/sdk'
import { hasValidHumanAmounts, humanizeTokenAmount } from './LiquidityActionHelpers'
import { HumanAmountIn } from './liquidity-types'

describe('hasValidHumanAmounts', () => {
  test('when all humanAmounts are empty', () => {
    const humanAmountsIn: HumanAmountIn[] = [
      { tokenAddress: '0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f', humanAmount: '' },
      { tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', humanAmount: '' },
    ]
    expect(hasValidHumanAmounts(humanAmountsIn)).toBeFalsy()
  })
  test('when all humanAmounts are zero', () => {
    const humanAmountsIn: HumanAmountIn[] = [
      { tokenAddress: '0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f', humanAmount: '0' },
      { tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', humanAmount: '0' },
    ]
    expect(hasValidHumanAmounts(humanAmountsIn)).toBeFalsy()
  })
  test('when  humanAmounts is an empty array', () => {
    const humanAmountsIn: HumanAmountIn[] = []
    expect(hasValidHumanAmounts(humanAmountsIn)).toBeFalsy()
  })
})

test('humanizes token amount', () => {
  const tokenAmount: TokenAmount = {
    amount: 251359380787607529n,
  } as TokenAmount
  expect(humanizeTokenAmount(tokenAmount)).toBe('0.2514')
})
