import { poolId, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import {
  DefaultTokenAllowancesTestProvider,
  buildDefaultPoolTestProvider,
  testHook,
} from '@/test/utils/custom-renderers'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { waitFor } from '@testing-library/react'

import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { PropsWithChildren } from 'react'
import { HumanAmountIn } from '../add-liquidity.types'
import { useBuildAddLiquidityQuery } from './useBuildAddLiquidityTxQuery'

const PoolProvider = buildDefaultPoolTestProvider(aWjAuraWethPoolElementMock())

export const Providers = ({ children }: PropsWithChildren) => (
  <PoolProvider>
    <DefaultTokenAllowancesTestProvider>{children}</DefaultTokenAllowancesTestProvider>
  </PoolProvider>
)

async function testQuery(humanAmountsIn: HumanAmountIn[]) {
  const enabled = true
  const { result } = testHook(() => useBuildAddLiquidityQuery(humanAmountsIn, enabled, poolId), {
    wrapper: Providers,
  })
  return result
}

test('fetches join pool config when user is not connected', async () => {
  const result = await testQuery([])

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.data).toBeUndefined()
})

test('fetches join pool config when user is connected', async () => {
  const humanAmountsIn: HumanAmountIn[] = [
    { tokenAddress: wETHAddress, humanAmount: '1' },
    { tokenAddress: wjAuraAddress, humanAmount: '1' },
  ]

  const result = await testQuery(humanAmountsIn)

  await waitFor(() => expect(result.current.data?.to).toBeDefined())

  expect(result.current.data?.account).toBe(defaultTestUserAccount)
})
