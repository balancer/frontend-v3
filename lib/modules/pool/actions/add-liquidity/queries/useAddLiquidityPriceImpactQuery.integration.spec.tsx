import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { DefaultPoolTestProvider, testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'

import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { HumanAmountIn } from '../../liquidity-types'
import { selectAddLiquidityHandler } from '../handlers/selectAddLiquidityHandler'
import { useAddLiquidityPriceImpactQuery } from './useAddLiquidityPriceImpactQuery'
import { connectWithDefaultUser } from '@/test/utils/wagmi/wagmi-connections'

async function testQuery(humanAmountsIn: HumanAmountIn[]) {
  const handler = selectAddLiquidityHandler(aWjAuraWethPoolElementMock())
  const { result } = testHook(() => useAddLiquidityPriceImpactQuery(handler, humanAmountsIn), {
    wrapper: DefaultPoolTestProvider,
  })
  return result
}

test('queries price impact for add liquidity', async () => {
  await connectWithDefaultUser()
  const humanAmountsIn: HumanAmountIn[] = [
    { tokenAddress: wETHAddress, humanAmount: '1' },
    { tokenAddress: wjAuraAddress, humanAmount: '1' },
  ]

  const result = await testQuery(humanAmountsIn)

  await waitFor(() => expect(result.current.data).not.toBeUndefined())

  expect(result.current.data).toBeGreaterThan(0.001)
  expect(result.current.isLoading).toBeFalsy()
})
