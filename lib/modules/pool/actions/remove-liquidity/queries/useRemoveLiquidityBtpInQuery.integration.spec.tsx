import { poolId, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'

import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { HumanAmountIn } from '../../liquidity-types'
import { selectRemoveLiquidityHandler } from '../handlers/selectRemoveLiquidityHandler'
import { useRemoveLiquidityBtpInQuery } from './useRemoveLiquidityBptInQuery'

async function testQuery(humanAmountsIn: HumanAmountIn[]) {
  const handler = selectRemoveLiquidityHandler(aWjAuraWethPoolElementMock())
  const { result } = testHook(() => useRemoveLiquidityBtpInQuery(handler, humanAmountsIn, poolId))
  return result
}

// TODO: finish when we implement remove liquidity with realistic inputs
test.skip('queries btp in for remove liquidity', async () => {
  const humanAmountsIn: HumanAmountIn[] = [
    { tokenAddress: wETHAddress, humanAmount: '100' },
    { tokenAddress: wjAuraAddress, humanAmount: '1' },
  ]

  const result = await testQuery(humanAmountsIn)

  await waitFor(() => expect(result.current.bptIn).toBeDefined())

  expect(result.current.bptIn?.decimalScale).toBe(1000000000000000000n)
  expect(result.current.isBptInQueryLoading).toBeFalsy()
})
