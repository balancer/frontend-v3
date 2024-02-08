import { balAddress, daiAddress, usdcAddress, usdtAddress, wETHAddress } from '@/lib/debug-helpers'
import { GqlPoolElement } from '@/lib/shared/services/api/generated/graphql'
import { aBalWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import {
  DefaultAddLiquidityTestProvider,
  buildDefaultPoolTestProvider,
  testHook,
} from '@/test/utils/custom-renderers'
import { PropsWithChildren } from 'react'
import { _useAddLiquidity } from './useAddLiquidity'
import { nestedPoolMock } from '../../__mocks__/nestedPoolMock'
import { act } from '@testing-library/react'

async function testUseAddLiquidity(pool: GqlPoolElement = aBalWethPoolElementMock()) {
  const PoolProvider = buildDefaultPoolTestProvider(pool)

  const Providers = ({ children }: PropsWithChildren) => (
    <PoolProvider>
      <DefaultAddLiquidityTestProvider>{children}</DefaultAddLiquidityTestProvider>
    </PoolProvider>
  )
  const { result } = testHook(() => _useAddLiquidity(), {
    wrapper: Providers,
  })
  return result
}

test('returns amountsIn with empty input amount by default', async () => {
  const result = await testUseAddLiquidity()

  expect(result.current.humanAmountsIn).toEqual([
    {
      tokenAddress: balAddress,
      humanAmount: '',
    },
    {
      tokenAddress: wETHAddress,
      humanAmount: '',
    },
  ])
})

test('returns inputAmounts', async () => {
  const result = await testUseAddLiquidity()

  expect(result.current.inputAmounts).toEqual([])

  act(() => result.current.setHumanAmountIn(balAddress, '1'))
  act(() => result.current.setHumanAmountIn(wETHAddress, '2'))

  expect(result.current.inputAmounts).toMatchInlineSnapshot(`
    [
      {
        "address": "0xba100000625a3754423978a60c9317c58a424e3d",
        "decimals": 18,
        "rawAmount": 1000000000000000000n,
      },
      {
        "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "decimals": 18,
        "rawAmount": 2000000000000000000n,
      },
    ]
  `)
})

// Only works when using .only
// there's a global state collision otherwise (investigation pending)
test.skip('returns valid tokens for a nested pool', async () => {
  const result = await testUseAddLiquidity(nestedPoolMock as GqlPoolElement)

  expect(result.current.validTokens.map(t => t.address)).toEqual([
    wETHAddress,
    daiAddress,
    usdtAddress,
    usdcAddress,
  ])
})
