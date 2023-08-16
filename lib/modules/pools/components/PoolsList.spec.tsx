import { screen } from '@testing-library/react'
import PoolsList from './PoolsList'
import { PoolsList as PoolListType } from '@/lib/modules/pools/pool.types'
import { renderWithDefaultProviders } from '@/test/utils/custom-renderers'
import { defaultPoolListItem1, mockPoolList } from '@/test/msw/mocks/PoolList.handlers'
import { aGqlPoolMinimal } from '@/test/msw/mocks/gqlPoolMinimal.builders'
import { PoolsProvider } from '../hooks/usePools'
import { TokenBalancesContext } from '@/lib/modules/tokens/useTokenBalances'
import { defaultTokenBalances } from '@/lib/modules/tokens/useTokenBalances.mock'
import { noop } from 'lodash'

function renderPoolsList() {
  return renderWithDefaultProviders(
    <PoolsProvider>
      <TokenBalancesContext.Provider value={defaultTokenBalances}>
        <PoolsList />
      </TokenBalancesContext.Provider>
    </PoolsProvider>
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
    expect(console.log).toHaveBeenCalledTimes(3)
  })

  test('Renders pool details with a custom mocked GQL pool', async () => {
    const mockedList: PoolListType = [aGqlPoolMinimal({ name: 'FOO BAL' })]

    mockPoolList(mockedList)

    renderPoolsList()
    const poolName = await screen.findByText(/FOO BAL/i)
    expect(poolName).toBeInTheDocument()
  })
})
