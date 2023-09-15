import { screen } from '@testing-library/react'
import { PoolList } from './PoolList'
import { PoolList as PoolListType } from '@/lib/modules/pool/pool.types'
import { renderWithDefaultProviders } from '@/test/utils/custom-renderers'
import { defaultPoolListItem1, mockPoolList } from '@/test/msw/mocks/PoolList.handlers'
import { aGqlPoolMinimal } from '@/test/msw/mocks/gqlPoolMinimal.builders'

import { PoolListProvider } from '@/lib/modules/pool/PoolList/usePoolList'
import { TokenBalancesContext } from '@/lib/modules/tokens/useTokenBalances'
import { defaultTokenBalances } from '@/lib/modules/tokens/useTokenBalances.mock'
import { noop } from 'lodash'

function renderPoolsList() {
  return renderWithDefaultProviders(
    <PoolListProvider>
      <TokenBalancesContext.Provider value={defaultTokenBalances}>
        <PoolList />
      </TokenBalancesContext.Provider>
    </PoolListProvider>
  )
}

describe('PoolList', () => {
  beforeAll(() => {
    vi.spyOn(console, 'log').mockImplementation(noop)
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('Renders pool details', async () => {
    renderPoolsList()
    const poolName = await screen.findByText(defaultPoolListItem1.name)
    expect(poolName).toBeInTheDocument()

    // console.log is only called when there are token balances
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledWith({
      balances: [
        {
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          amount: 0n,
          chainId: 1,
          decimals: 8,
          formatted: '0',
        },
        {
          address: '0xba100000625a3754423978a60c9317c58a424e3d',
          amount: 0n,
          chainId: 1,
          decimals: 8,
          formatted: '0',
        },
      ],
    })
  })

  test('Renders pool details with a custom mocked GQL pool', async () => {
    const mockedList: PoolListType = [aGqlPoolMinimal({ name: 'FOO BAL' })]

    mockPoolList(mockedList)

    renderPoolsList()
    const poolName = await screen.findByText(/FOO BAL/i)
    expect(poolName).toBeInTheDocument()
  })
})
