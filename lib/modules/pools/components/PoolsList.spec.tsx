import { screen } from '@testing-library/react'
import PoolsList from './PoolsList'
import { PoolsList as PoolListType } from '@/lib/modules/pools/types'
import { renderWithDefaultProviders } from '@/test/utils/render'
import { defaultPoolListItem1, mockPoolList } from '@/test/msw/mocks/PoolList.handlers'
import { aGqlPoolMinimal } from '@/test/msw/mocks/gqlPoolMinimal.builders'

test('Renders pool details', async () => {
  renderWithDefaultProviders(<PoolsList />)
  const poolName = await screen.findByText(defaultPoolListItem1.name)
  expect(poolName).toBeInTheDocument()
})

test('Renders pool details with a custom mocked GQL pool', async () => {
  const mockedList: PoolListType = [aGqlPoolMinimal({ name: 'FOO BAL' })]

  mockPoolList(mockedList)

  renderWithDefaultProviders(<PoolsList />)
  const poolName = await screen.findByText(/FOO BAL/i)
  expect(poolName).toBeInTheDocument()
})
