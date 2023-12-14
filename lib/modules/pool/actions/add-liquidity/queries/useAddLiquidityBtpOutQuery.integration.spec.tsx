import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'

import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { selectAddLiquidityHandler } from '../selectAddLiquidityHandler'
import { useAddLiquidityBtpOutQuery } from './useAddLiquidityBtpOutQuery'
import { HumanAmountIn } from '../../liquidity-types'

async function testQuery(humanAmountsIn: HumanAmountIn[]) {
  const handler = selectAddLiquidityHandler(aWjAuraWethPoolElementMock())
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
  expect(result.current.bptOutUnits).toBe('33.4271k')
  expect(result.current.isBptOutQueryLoading).toBeFalsy()
})
