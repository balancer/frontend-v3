import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'

import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { selectRemoveLiquidityHandler } from '../handlers/selectRemoveLiquidityHandler'
import { useRemoveLiquidityPriceImpactQuery } from './useRemoveLiquidityPriceImpactQuery'
import { HumanAmountIn } from '../../liquidity-types'

async function testQuery(humanAmountsIn: HumanAmountIn[]) {
  const handler = selectRemoveLiquidityHandler(aWjAuraWethPoolElementMock())
  const { result } = testHook(() =>
    useRemoveLiquidityPriceImpactQuery(handler, humanAmountsIn, defaultTestUserAccount)
  )
  return result
}

test('queries price impact for add liquidity', async () => {
  const humanAmountsIn: HumanAmountIn[] = [
    { tokenAddress: wETHAddress, humanAmount: '1' },
    { tokenAddress: wjAuraAddress, humanAmount: '1' },
  ]

  const result = await testQuery(humanAmountsIn)

  await waitFor(() => expect(result.current.priceImpact).toBeDefined())

  expect(result.current.priceImpact).toBeCloseTo(0.002368782867485742)
  expect(result.current.isPriceImpactLoading).toBeFalsy()
})
