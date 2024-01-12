import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'

import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { selectRemoveLiquidityHandler } from '../handlers/selectRemoveLiquidityHandler'
import { RemoveLiquidityType } from '../remove-liquidity.types'
import { useRemoveLiquidityPriceImpactQuery } from './useRemoveLiquidityPriceImpactQuery'
import { HumanAmount } from '@balancer/sdk'

const poolMock = aWjAuraWethPoolElementMock()

async function testQuery(humanBptIn: HumanAmount) {
  const handler = selectRemoveLiquidityHandler(
    aWjAuraWethPoolElementMock(),
    RemoveLiquidityType.Proportional
  )
  const { result } = testHook(() =>
    useRemoveLiquidityPriceImpactQuery(handler, poolMock.id, humanBptIn)
  )
  return result
}

test('queries price impact for add liquidity', async () => {
  const humanBptIn: HumanAmount = '1'

  const result = await testQuery(humanBptIn)

  await waitFor(() => expect(result.current.priceImpact).toBeDefined())

  expect(result.current.priceImpact).toBeCloseTo(0.002368782867485742)
  expect(result.current.isPriceImpactLoading).toBeFalsy()
})
