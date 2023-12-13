import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'

import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { HumanAmountIn } from '../add-liquidity.types'
import { selectAddLiquidityHandler } from '../selectAddLiquidityHandler'
import { useAddLiquidityBtpOutQuery } from './useAddLiquidityBtpOutQuery'

async function testQuery(humanAmountsIn: HumanAmountIn[]) {
  const { handler } = selectAddLiquidityHandler(aWjAuraWethPoolElementMock())
  const { result } = testHook(() =>
    useAddLiquidityBtpOutQuery(handler, humanAmountsIn, defaultTestUserAccount)
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

  expect(result.current.bptOut).toBeDefined()
  expect(result.current.bptOutUnits).toBe('33,427')
  expect(result.current.isBptOutQueryLoading).toBeFalsy()
})
