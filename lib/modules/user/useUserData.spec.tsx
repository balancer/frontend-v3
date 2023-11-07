import { testHook } from '@/test/utils/custom-renderers'

import { _useUserData } from '@/lib/modules/user/useUserData'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { defaultUserDataMock, mockUserData } from '@/test/msw/handlers/UserData.handlers'
import { aUserBalanceMock } from './__mocks__/userData.builders'

async function renderUseUserData() {
  const { result, waitForLoadedUseQuery } = testHook(() => _useUserData())
  await waitForLoadedUseQuery(result)
  return result
}

test('Returns user data balances', async () => {
  const result = await renderUseUserData()

  expect(result.current.balances).toEqual(defaultUserDataMock)
})

describe('calculates user balance in USD (depending on token price)', () => {
  it('for a given pool', async () => {
    mockUserData([
      aUserBalanceMock({
        chain: GqlChain.Polygon,
        poolId: 'pool1',
        tokenPrice: 10,
        totalBalance: '2',
      }),
    ])
    const result = await renderUseUserData()

    expect(result.current.getUserBalanceUSD('pool1', GqlChain.Polygon)).toBe('20.00')
  })

  it('when the given pool id does not exist in balances', async () => {
    const result = await renderUseUserData()

    expect(result.current.getUserBalanceUSD('not found pool', GqlChain.Arbitrum)).toBe('0')
  })
})
