import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'

import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { selectRemoveLiquidityHandler } from '../handlers/selectRemoveLiquidityHandler'
import { useRemoveLiquidityBtpOutQuery } from './useRemoveLiquidityBtInQuery'
import { HumanAmountIn } from '../../liquidity-types'

async function testQuery(humanAmountsIn: HumanAmountIn[]) {
  const handler = selectRemoveLiquidityHandler(aWjAuraWethPoolElementMock())
  const { result } = testHook(() =>
    useRemoveLiquidityBtpOutQuery(handler, humanAmountsIn, defaultTestUserAccount)
  )
  return result
}

test('queries btp in for remove liquidity', async () => {
  const humanAmountsIn: HumanAmountIn[] = [
    { tokenAddress: wETHAddress, humanAmount: '100' },
    { tokenAddress: wjAuraAddress, humanAmount: '1' },
  ]

  const result = await testQuery(humanAmountsIn)

  await waitFor(() => expect(result.current.bptIn).not.toBeNull())

  expect(result.current.bptIn?.decimalScale).toBe(1000000000000000000n)
  expect(result.current.isBptInQueryLoading).toBeFalsy()
})
