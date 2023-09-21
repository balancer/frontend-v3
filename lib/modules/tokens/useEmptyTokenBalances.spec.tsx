import { aTokenBase } from '@/test/msw/mocks/token.builders'
import { renderHookWithDefaultProviders } from '@/test/utils/custom-renderers'
import { waitForLoadedUseQuery } from '@/test/utils/hooks'
import { TokenBase } from './token.types'
import { useEmptyTokenBalances } from './useEmptyTokenBalances'
import { mockTokenBalancesResponse } from './__mocks__/useTokenBalances'
import { aTokenAmount } from './token.builders'

async function renderUseEmptyTokenBalances(tokens: TokenBase[]) {
  const account = '0xc128468b7ce63ea702c1f104d55a2566b13d3abc'
  const { result } = renderHookWithDefaultProviders(() => useEmptyTokenBalances(account, tokens))
  await waitForLoadedUseQuery(result)
  return result
}

const emptyBalance = aTokenAmount({ amount: 0n })
const positiveBalance = aTokenAmount({ amount: 300n })
const tokens = [aTokenBase(), aTokenBase()]

describe('useEmptyTokenBalances', () => {
  test.skip('throws when user has a negative balance', async () => {
    const result = await renderUseEmptyTokenBalances(tokens) // This would throw lots of MSW warnings because it is doing real onchain calls

    expect(result.current.emptyBalances).toEqual([])
  })

  test('when all tokens have balance', async () => {
    const mockedBalances = [aTokenAmount({ amount: 100n }), aTokenAmount({ amount: 300n })]
    mockTokenBalancesResponse(mockedBalances)
    vi.mock('./useTokenBalances.tsx')

    const result = await renderUseEmptyTokenBalances(tokens)

    expect(result.current.emptyBalances).toEqual([])
  })

  test('when one token has no balance', async () => {
    const mockedBalances = [emptyBalance, positiveBalance]
    mockTokenBalancesResponse(mockedBalances)
    vi.mock('./useTokenBalances.tsx')

    const result = await renderUseEmptyTokenBalances(tokens)

    expect(result.current.emptyBalances).toEqual([emptyBalance])
  })
})
