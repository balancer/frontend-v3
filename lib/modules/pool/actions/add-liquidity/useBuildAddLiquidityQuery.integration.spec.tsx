import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import {
  DefaultTokenAllowancesTestProvider,
  buildDefaultPoolTestProvider,
  testHook,
} from '@/test/utils/custom-renderers'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { waitFor } from '@testing-library/react'

import { aTokenExpandedMock } from '@/lib/modules/tokens/__mocks__/token.builders'
import { aGqlPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { PropsWithChildren } from 'react'
import { Address } from 'viem'
import { HumanAmountIn } from './add-liquidity.types'
import { useBuildAddLiquidityQuery } from './useBuildAddLiquidityQuery'

const PoolProvider = buildDefaultPoolTestProvider(
  aGqlPoolElementMock({
    allTokens: [
      aTokenExpandedMock({ address: wjAuraAddress }),
      aTokenExpandedMock({ address: wETHAddress }),
    ],
  })
)

export const Providers = ({ children }: PropsWithChildren) => (
  <PoolProvider>
    <DefaultTokenAllowancesTestProvider>{children}</DefaultTokenAllowancesTestProvider>
  </PoolProvider>
)

async function testUseBuildAddLiquidityQuery(humanAmountsIn: HumanAmountIn[], account?: Address) {
  const enabled = true
  const { result } = testHook(() => useBuildAddLiquidityQuery(humanAmountsIn, enabled, account), {
    wrapper: Providers,
  })
  return result
}

test('fetches join pool config when user is not connected', async () => {
  const account = undefined
  const result = await testUseBuildAddLiquidityQuery([], account)

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.data).toBeUndefined()
})

test.skip('fetches join pool config when user is connected', async () => {
  const humanAmountsIn: HumanAmountIn[] = [
    { tokenAddress: wETHAddress, humanAmount: '1' },
    { tokenAddress: wjAuraAddress, humanAmount: '1' },
  ]

  const result = await testUseBuildAddLiquidityQuery(humanAmountsIn, defaultTestUserAccount)

  await waitFor(() => expect(result.current.data?.to).toBeDefined())

  expect(result.current.data?.account).toBe(defaultTestUserAccount)
})
