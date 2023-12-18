import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'

import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { selectAddLiquidityHandler } from '../handlers/selectAddLiquidityHandler'
import { useAddLiquidityBptOutQuery } from './useAddLiquidityBptOutQuery'
import { HumanAmountIn } from '../../liquidity-types'

async function testQuery(humanAmountsIn: HumanAmountIn[]) {
  const handler = selectAddLiquidityHandler(aWjAuraWethPoolElementMock())
  const { result } = testHook(() =>
    useAddLiquidityBptOutQuery(handler, humanAmountsIn, defaultTestUserAccount)
  )
  return result
}

test('queries btp out for add liquidity', async () => {
  const humanAmountsIn: HumanAmountIn[] = [
    { tokenAddress: wETHAddress, humanAmount: '100' },
    { tokenAddress: wjAuraAddress, humanAmount: '1' },
  ]

  const result = await testQuery(humanAmountsIn)

  await waitFor(() => expect(result.current.bptOut).not.toBeNull())

  expect(result.current.bptOut?.amount).toBeDefined()
  expect(result.current.isBptOutQueryLoading).toBeFalsy()
})
