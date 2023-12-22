import { poolId } from '@/lib/debug-helpers'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'

import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { selectRemoveLiquidityHandler } from '../handlers/selectRemoveLiquidityHandler'
import { RemoveLiquidityType } from '../remove-liquidity.types'
import { useRemoveLiquidityPreviewQuery } from './useRemoveLiquidityPreviewQuery'
import { parseUnits } from 'viem'
import { BPT_DECIMALS } from '../../../pool.constants'

async function testQuery(bptIn: bigint) {
  const handler = selectRemoveLiquidityHandler(
    aWjAuraWethPoolElementMock(),
    RemoveLiquidityType.Proportional
  )
  const { result } = testHook(() => useRemoveLiquidityPreviewQuery(handler, poolId, bptIn))
  return result
}

test.skip('queries btp in for remove liquidity', async () => {
  const bptIn: bigint = parseUnits('1', BPT_DECIMALS)

  const result = await testQuery(bptIn)

  await waitFor(() => expect(result.current.amountsOut).toBeDefined())

  expect(result.current.amountsOut).toBeDefined()
  expect(result.current.isPreviewQueryLoading).toBeFalsy()
})
