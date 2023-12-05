import { balAddress, wETHAddress } from '@/lib/debug-helpers'
import { aTokenExpandedMock } from '@/lib/modules/tokens/__mocks__/token.builders'
import { aGqlPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { buildDefaultPoolTestProvider, testHook } from '@/test/utils/custom-renderers'
import { _useAddLiquidity } from './useAddLiquidity'

async function testUseAddLiquidity() {
  const { result } = testHook(() => _useAddLiquidity(), {
    wrapper: buildDefaultPoolTestProvider(
      aGqlPoolElementMock({
        allTokens: [
          aTokenExpandedMock({ address: balAddress }),
          aTokenExpandedMock({ address: wETHAddress }),
        ],
      })
    ),
  })
  return result
}

test('returns amountsIn with empty input amount by default', async () => {
  const result = await testUseAddLiquidity()

  expect(result.current.amountsIn).toEqual([
    {
      tokenAddress: balAddress,
      value: '',
    },
    {
      tokenAddress: wETHAddress,
      value: '',
    },
  ])
})
