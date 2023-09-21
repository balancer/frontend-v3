import { PoolList as PoolListType } from '@/lib/modules/pool/pool.types'
import { defaultPoolList, mockPoolList } from '@/test/msw/mocks/PoolList.handlers'
import { aGqlPoolMinimal } from '@/test/msw/mocks/gqlPoolMinimal.builders'
import { renderHookWithDefaultProviders } from '@/test/utils/custom-renderers'

import { _usePoolList } from '@/lib/modules/pool/PoolList/usePoolList'
import { waitForLoadedUseQuery } from '@/test/utils/hooks'

async function renderUsePoolsList() {
  const { result } = renderHookWithDefaultProviders(() => _usePoolList())
  await waitForLoadedUseQuery(result)
  return result
}

test('Returns pool list', async () => {
  const result = await renderUsePoolsList()

  expect(result.current.pools).toEqual(defaultPoolList)
})

test('Returns pool list with a custom mocked GQL pool', async () => {
  const mockedList: PoolListType = [aGqlPoolMinimal({ name: 'FOO BAL' })]

  mockPoolList(mockedList)

  const result = await renderUsePoolsList()

  expect(result.current.pools[0].name).toEqual('FOO BAL')
})
