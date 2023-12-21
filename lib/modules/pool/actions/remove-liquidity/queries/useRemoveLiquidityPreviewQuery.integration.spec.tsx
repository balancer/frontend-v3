import { poolId } from '@/lib/debug-helpers'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'

import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { HumanAmount } from '@balancer/sdk'
import { selectRemoveLiquidityHandler } from '../handlers/selectRemoveLiquidityHandler'
import { RemoveLiquidityType } from '../remove-liquidity.types'
import { useRemoveLiquidityPreviewQuery } from './useRemoveLiquidityPreviewQuery'

async function testQuery(humanBptIn: HumanAmount) {
  const handler = selectRemoveLiquidityHandler(
    aWjAuraWethPoolElementMock(),
    RemoveLiquidityType.Proportional
  )
  const { result } = testHook(() => useRemoveLiquidityPreviewQuery(handler, poolId, humanBptIn))
  return result
}

test.skip('queries btp in for remove liquidity', async () => {
  const humanBptIn: HumanAmount = '1'

  const result = await testQuery(humanBptIn)

  await waitFor(() => expect(result.current.amountsOut).toBeDefined())

  expect(result.current.amountsOut).toBeDefined()
  expect(result.current.isPreviewQueryLoading).toBeFalsy()
})
