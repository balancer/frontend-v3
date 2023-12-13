import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'

import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { HumanAmountIn } from '../add-liquidity.types'
import { selectAddLiquidityHandler } from '../selectAddLiquidityHandler'
import { useAddLiquidityPriceImpactQuery } from './useAddLiquidityPriceImpactQuery'

async function testQuery(humanAmountsIn: HumanAmountIn[]) {
  const handler = selectAddLiquidityHandler(aWjAuraWethPoolElementMock())
  const { result } = testHook(() =>
    useAddLiquidityPriceImpactQuery(handler, humanAmountsIn, defaultTestUserAccount)
  )
  return result
}

test('queries price impact for add liquidity', async () => {
  const humanAmountsIn: HumanAmountIn[] = [
    { tokenAddress: wETHAddress, humanAmount: '1' },
    { tokenAddress: wjAuraAddress, humanAmount: '1' },
  ]

  const result = await testQuery(humanAmountsIn)

  await waitFor(() => expect(result.current.formattedPriceImpact).not.toBe('-'))

  expect(result.current.priceImpact).toBeCloseTo(0.002368782867485742)
  expect(result.current.formattedPriceImpact).toBe('0.24%')
  expect(result.current.isPriceImpactLoading).toBeFalsy()
})
