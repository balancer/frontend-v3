import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'

import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { selectRemoveLiquidityHandler } from '../handlers/selectRemoveLiquidityHandler'
import { RemoveLiquidityType } from '../remove-liquidity.types'
import { useRemoveLiquidityPriceImpactQuery } from './useRemoveLiquidityPriceImpactQuery'
import { parseUnits } from 'viem'
import { BPT_DECIMALS } from '../../../pool.constants'

const poolMock = aWjAuraWethPoolElementMock()

async function testQuery(bptIn: bigint) {
  const handler = selectRemoveLiquidityHandler(
    aWjAuraWethPoolElementMock(),
    RemoveLiquidityType.Proportional
  )
  const { result } = testHook(() => useRemoveLiquidityPriceImpactQuery(handler, poolMock.id, bptIn))
  return result
}

test('queries price impact for add liquidity', async () => {
  const bptIn: bigint = parseUnits('1', BPT_DECIMALS)

  const result = await testQuery(bptIn)

  await waitFor(() => expect(result.current.priceImpact).toBeDefined())

  expect(result.current.priceImpact).toBeCloseTo(0.002368782867485742)
  expect(result.current.isPriceImpactLoading).toBeFalsy()
})
